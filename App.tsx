import React, { useEffect, useRef, useState } from "react";
import {
  PixelRatio,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
// Image quality options
import YotiFaceCapture from "@getyoti/react-native-yoti-face-capture";

console.disableYellowBox = true;
export default function App() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<any>(null);
  const yotiFaceCaptureRef = useRef(null);
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;

  // You can then control the camera and analysis using the ref

  // Start the camera
  // yotiFaceCaptureRef.current.startCamera()

  // Start the analysis (having started the camera)
  // yotiFaceCaptureRef.current.startAnalysis()

  // Stop the analysis
  // yotiFaceCaptureRef.current.stopAnalysis()

  // Stop the camera
  // yotiFaceCaptureRef.current.stopCamera()
  useEffect(() => {
    if (hasPermission) {
      yotiFaceCaptureRef.current.startCamera();
      yotiFaceCaptureRef.current.startAnalyzing();
    }
  }, [hasPermission]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <YotiFaceCapture
      style={{ flex: 1, width: "100%" }}
      ref={yotiFaceCaptureRef}
      requireEyesOpen={false}
      requiredStableFrames={0}
      requireValidAngle={false}
      requireBrightEnvironment
      scanningArea={[
        0,
        0,
        PixelRatio.getPixelSizeForLayoutSize(windowWidth),
        PixelRatio.getPixelSizeForLayoutSize(windowHeight),
      ]}
      onFaceCaptureAnalyzedImage={(e) => {
        console.log("onFaceCaptureAnalyzedImage", e);

        // analysis.croppedImage
        // analysis.croppedFaceBoundingBox
        // analysis.faceBoundingBox
        // analysis.originalImage
      }}
      onFaceCaptureImageAnalysisFailed={(e) => {
        console.log("onFaceCaptureImageAnalysisFailed", e.cause);

        if (e.cause === "FaceCaptureAnalysisErrorFaceNotCentered") {
          //yotiFaceCaptureRef.current.stopAnalyzing();
        }
        // failure.cause
        // failure.originalImage
      }}
      onFaceCaptureStateChanged={(e) => {
        console.log("onFaceCaptureStateChanged", e);

        // state may either be 'Analyzing', 'CameraReady' or 'CameraStopped'
      }}
      onFaceCaptureStateFailed={(e) => {
        console.log("onFaceCaptureStateFailed", e);
        // failure.cause
        // failure may either be 'CameraInitializationError' or 'MissingPermissions'
      }}
    />
  );
}

