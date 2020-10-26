import React, { Component } from 'react';
import {
  View,
  StatusBar,
  TextInput,
  Animated,
} from 'react-native';
import { color } from 'react-native-reanimated';

import PhoneInput from 'react-native-phone-input';

import CountryPicker, { DARK_THEME,FlagButton } from 'react-native-country-picker-modal'

export default class PickerInput extends Component {
 
    constructor() {
        super();
        
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.state = {
          cca2: 'US',
        };
        // this.phone = React.createRef();
        this.countryPicker = React.createRef();
        
    }
    
      componentDidMount() {
        this.setState({
        //   pickerData: this.phone.getPickerData(),
        });
      }
    
      onPressFlag=()=> {
        // this.countryPicker.openModal();
        this.setState({
            picker:true
        })
      }
    
      selectCountry(country) {
        // this.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({ 
            cca2: country.cca2,
            picker:false
         });
        console.log(country);
        this.props.changeCountry(country)
      }
    
      render() {
        return (
          
            <View 
            {...this.props}
            >

            <CountryPicker
              onSelect={value => this.selectCountry(value)}
              translation="eng"
              cca2={this.state.cca2}
              theme={DARK_THEME}
              countryCode={this.state.cca2}
              withCallingCode={true}
              withFilter={true}
              withFlagButton={true}
              visible={this.state.picker}
              
/>
</View>


);
      }
    }
 