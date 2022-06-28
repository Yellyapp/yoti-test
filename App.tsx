import React, {useEffect, useRef, useState} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import YotiFaceCapture from './Yoti'

console.disableYellowBox = true;

function Yoti(){
  return <YotiFaceCapture />
}

const NativeStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <NativeStack.Navigator>
         <NativeStack.Screen
           name='Yoti'
           component={Yoti}
         />
      </NativeStack.Navigator>
    </NavigationContainer>
  );
}
