import React, { useState } from "react";
import { StyleSheet, TouchableOpacity,Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

export default function Link(props) {
  const {filled}=props;
  return(
      <Text 
        style={{
        color:'#D8343B',
        fontSize:15
        }}        
      >{props.children}</Text>)
}


const styles = StyleSheet.create({
  link: {
   }
});
