import React, { Children, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from '@components/Text'

export default function Home(props) {
  const {filled,color,normal,children}=props;

  if(normal){
    return(<TouchableOpacity {...props}> 
    {children}
    </TouchableOpacity>) 
  }
  
  return(<TouchableOpacity {...props} style={[styles.button,
    {
        backgroundColor:filled?'#D8343B':'#FFF',
    },
  ]}>
      <Text 
        style={{
        color:color?color:filled?'#FFF':'#D8343B',
        fontSize:15
        }}        
      >{props.title}</Text>
  </TouchableOpacity>)
}


const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "#fff",
    width:212,
    padding:15,
    borderRadius:40,
    justifyContent:"center",
    alignItems:"center",
    marginTop:7,
    marginBottom:7,
  }
});
