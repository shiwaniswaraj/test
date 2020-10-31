import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { color } from 'react-native-reanimated';


export default class Input extends Component {
  state = {
    isFocused: false,
  };

  UNSAFE_componentWillMount() {
    this._animatedIsFocused = new Animated.Value(this.props.value === '' ? 0 : 1);
  }

  handleFocus = () => this.setState({ isFocused: true });
  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: (this.state.isFocused || this.props.value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }

  render() {
    const {black}=this.props;
const defaultStyles = {
  labelStyle: {
    position: 'absolute',
      left: 0,
      color:black?'black':'#FFF',
      fontFamily:"Helvetica-Neue"
  },
  textInput: {
      height: 40, 
      fontSize: 15, 
      color: black?'black':'#FFF', 
      borderBottomWidth: 1, 
      borderBottomColor: '#707070',

      
    },
    focusedTextInput: {
        
    },
    selectionColor: black?'black':'#FFF',
}
    const { label, colorLablel,...props } = this.props;
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
        outputRange: [black?'black':'#FFF', black?'black':'#FFF'],
      }),
    };
    return (
      <View style={{ paddingTop: 18 }}>
        <Animated.Text style={[style.labelStyle,animatedLabelStyle,{color:colorLablel?colorLablel:black?'black':'#FFF'}]}>
          {label}
        </Animated.Text>
        <TextInput
          {...props}
          style={[style.textInput,
            isFocused&&style.focusedTextInput,props.style]}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
          selectionColor={style.selectionColor}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}
 