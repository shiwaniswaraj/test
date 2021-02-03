import React, { useState } from "react";
import { StyleSheet,Text } from "react-native";

export default function TextApp(props) {
  return(
      <Text 
        style={[styles.text,props.style]}        
      >{props.children}</Text>)
}


const styles = StyleSheet.create({
  text: {
        fontFamily:"Roboto",
        
    }
});
