import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
  Image
} from 'react-native';
import { color } from 'react-native-reanimated';
import send from '@assets/images/send.png';
import { TouchableOpacity } from "react-native-gesture-handler";

const defaultStyles = {
  labelStyle: {
    position: 'absolute',
      left: 5,
      color:'#FFF',
      fontFamily:"Helvetica-Neue",
      
  },
  textInput: {
      height: 50, 
      fontSize: 15, 
      color: '#FFF', 
      borderWidth: 0, 
      backgroundColor: '#2B2B2B',
      borderRadius:30,
      padding:15,
      paddingLeft:20

    },
    flightIcon:{
      width:18,height:18,position:"absolute",
      top:32,
      left:14,
      
    },
    focusedTextInput: {
        
    },
    selectionColor: '#FFF',
}

export default class ChatInput extends Component {
  state = {
    isFocused: false,
  };

  componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
    }).start();
  }

  render() {
    const { label, colorLablel,icon,...props } = this.props;
    const { isFocused } = this.state;
    const style = defaultStyles;
    const animatedLabelStyle = {
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 7],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#FFF', '#FFF'],
      }),
    };
    return (
      <View style={{ paddingTop: 15 }}>
          <TextInput
          {...props}
          style={[style.textInput,
            isFocused&&style.focusedTextInput]}
            placeholderTextColor="#FFF"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
            placeholder="Type your message"
          blurOnSubmit
          onChangeText={(msg)=>{this.props.onMessageChange(msg)}}
          value={this.props.val}
          selectionColor={style.selectionColor}
          underlineColorAndroid="transparent"
        />

          <Image onStartShouldSetResponder={()=>{this.props.sendMessage()}} source={send} style={{width:40,height:40,position:'absolute',top: 20,right: 6}}/>

      </View>
    );
  }
}
 