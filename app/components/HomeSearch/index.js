import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
  Image
} from 'react-native';
import { color } from 'react-native-reanimated';
import search from '@assets/images/search.png';
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
      borderWidth: 1, 
      borderColor: '#FFF',
      backgroundColor: '#97979B',
      borderRadius:30,
      padding:10,
      paddingLeft:40

    },
    flightIcon:{
      width:18,height:18,position:"absolute",
      top:32,
      left:14,
      resizeMode:'contain',
      zIndex:9
      
    },
    focusedTextInput: {
        
    },
    selectionColor: '#FFF',
}

export default class HomeSearch extends Component {
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
            <Image source={search} style={style.flightIcon}/>
      
          <TextInput
          {...props}
          style={[style.textInput,
            isFocused&&style.focusedTextInput]}
            placeholderTextColor="#FFF"
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
            placeholder="Search routes"
          blurOnSubmit
          selectionColor={style.selectionColor}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}
 