import React, { Children, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Text from '@components/Text'

export default function Home(props) {
  const {filled,color,normal,disabled,children}=props;

  if(normal){
    return(<TouchableOpacity {...props}> 
    {children}
    </TouchableOpacity>) 
  }
  
  return(<TouchableOpacity {...props} style={[styles.button,
    {
        backgroundColor:disabled?"#A7A7A9":filled?'#B49A5A':'#FFF',
    },
    
  ]}>
      <Text 
        style={{
        color:color?color:filled?'#FFF':'#B49A5A',
        fontSize:15
        }}        
      >{props.title}</Text>
  </TouchableOpacity>)
}


const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "#fff",
    width:'100%',
    padding:20,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center",
    marginTop:7,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: {
    height: 5,
    width: 5
    },
    elevation: 5,
    marginBottom:7,
  }
});
