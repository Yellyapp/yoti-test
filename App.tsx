import React, {useEffect, useRef, useState} from "react";
import {
  PixelRatio,
  Text,
  StyleSheet,
  Platform,
  useWindowDimensions,
  View,
  Button,
  SafeAreaView
} from "react-native";
import {Camera} from "expo-camera";
import YotiFaceCapture from "@getyoti/react-native-yoti-face-capture";

console.disableYellowBox = true;
export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [isCaptured, setIsCaptured] = useState<boolean>(false)

  const yotiFaceCaptureRef = useRef(null);
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    if (hasPermission) {
      yotiFaceCaptureRef.current.startCamera();
    }
  }, [hasPermission]);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const topOffset = Platform.select({android: 60, default: 60})

  const params = Platform.select({
    // Looks strange but it works for some reason
    // Without this hack android won't recognize the face from the camera
    // Uncomment for working android version
    
    //android: {
    // x: 0,
    // y: windowWidth / 2 + topOffset,
    // width: windowWidth * 2,
    // height: windowHeight + topOffset * 2,
    // },
    default: {
      x: 0,
      y: topOffset,
      width: windowWidth,
      height: windowHeight - topOffset,
    },
    ios:{
      x: 0,
      y: PixelRatio.getPixelSizeForLayoutSize(topOffset),
      width: PixelRatio.getPixelSizeForLayoutSize(windowWidth),
      height: PixelRatio.getPixelSizeForLayoutSize(windowHeight - topOffset),
    }
  })
  const area = [
    PixelRatio.roundToNearestPixel(params.x),
    PixelRatio.roundToNearestPixel(params.y),
    PixelRatio.roundToNearestPixel(params.width),
    PixelRatio.roundToNearestPixel(params.height),
  ]

  const switchAnalysis = (flag) => {
    if(flag){
      yotiFaceCaptureRef.current.startAnalyzing()
    } else {
      yotiFaceCaptureRef.current.stopAnalyzing()
    }
    setIsAnalyzing(flag)
    setMessage('')
    setIsCaptured(false)
  } 

  return (
    <>
      <YotiFaceCapture
        style={{flex: 1, width: "100%"}}
        ref={yotiFaceCaptureRef}
        requireEyesOpen={false}
        requiredStableFrames={0}
        requireBrightEnvironment
        scanningArea={area}
        onFaceCaptureAnalyzedImage={(e) => {
          if(!isCaptured) {
            console.log("onFaceCaptureAnalyzedImage", 'Face capture success');
            switchAnalysis(false)
            setMessage('SUCCESS')
            setIsCaptured(true)
          }
        }}
        onFaceCaptureImageAnalysisFailed={(e) => {
          console.log("onFaceCaptureImageAnalysisFailed", e.cause);
          setMessage(e.cause)
        }}
        onFaceCaptureStateChanged={(e) => {
          console.log("onFaceCaptureStateChanged", e);
        }}
        onFaceCaptureStateFailed={(e) => {
          console.log("onFaceCaptureStateFailed", e);
      }} />
      <SafeAreaView>
        <Button color="red" onPress={()=>{ switchAnalysis(!isAnalyzing)}} title={isAnalyzing ? 'Stop' : 'Start'}></Button>
      </SafeAreaView>
      <View style={styles.messageWrapper}>
        <Text style={styles.message}>
          {message}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    zIndex: 2,
    elevation: 2,
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(100,100,100,0.3)',
    borderRadius: 40,
  },
  message: {
    padding: 10,
    textAlign: 'center'
  }
})
