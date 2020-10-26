import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
  Image
} from 'react-native';


export default class Redirect extends Component {
   

  componentDidMount() {
    this.props.navigation.navigate(this.props.to,this.props.data)
  }

  
  render() {
     
    return (
      <View style={{ paddingTop: 18 }}>
         
      </View>
    );
  }
}
 