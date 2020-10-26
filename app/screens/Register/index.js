import React, { useState } from "react";
import { StyleSheet, View,Image,Platform } from "react-native";
import Input from '@components/Input'
import Button from '@components/Button'
import Text from '@components/Text'
import Navigation from "../../../navigation";
import {Toast } from 'native-base';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import {connect} from 'react-redux';
import {RegisterAction} from '../../redux/action/auth';
import Redirect from '@components/Redirect'
import PickerInput from  '@components/CountryPicker'


class Register extends React.Component {
    state={
        email:"",
        password:"",
        tel:"+1",
        ccode:"1"
    }
    handleTextChange = (id,value) => this.setState({ [id]:value });
    handleTelChange=(id,value)=>{
      const {ccode}=this.state;
      // if(value.length==2 && value.indexOf("+")<0){
      //   value="+"+value;
      //   this.setState({
      //     ccode:value
      //   })
      // }
      if(value.length<=ccode.length){
        return;
      }
      this.setState({ [id]:value })
    }

      checkEmail=(em)=>{
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em))
      {
          return (true)
      }
      return (false)
      }
      
      
  notify = (message,type) => {
  Toast.show({
    text: message ,
    buttonText: "Okay",
    duration: 3000,
    position: "top",
    type
  })

}


enablePushNotifications = async () => {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
};

 

componentWillMount() {
 
  this.enablePushNotifications().then((token)=>{
    this.setState({
      token
    })
  });

}

componentDidMount(){
  // this.enablePushNotifications()
}

    handleRegister=async()=>{
      const {email,password,ccode,tel,token}=this.state;
      if(!email || !this.checkEmail(email)){
        this.notify("Invalid email!","danger");
        return;
      }else if(!password){
        this.notify("Please enter password!","danger");
        return;
      }
      else if(!tel){
        this.notify("Please enter phone number!","danger");
        return;
      }
      else if(!ccode){
        this.notify("Please enter country code!","danger");
        return;
      }
      await this.props.doSingup(email,password,ccode,tel,token);
      setTimeout(()=>{
      this.setState({
        retdirect:true
      },()=>{
        if(!this.props.errorRegister){
      this.props.navigation.navigate("Otp",{phone:tel,ccode})
        }
      })
    },2000)
    
    }
    changeCountry=(country)=>{
      this.setState({
        country,
        ccode:country.callingCode[0],
        tel:"+"+country.callingCode[0]
      })
    }

    render(){
      const {email,password,ccode,tel,retdirect}=this.state;

     
    return(<View style={styles.container}>
        <Input
        label="Email"
        value={this.state.email}
        onChangeText={(val)=>{this.handleTextChange('email',val)}}
           />
        <Input
        label="Create Password"
        value={this.state.password}
        onChangeText={(val)=>{this.handleTextChange('password',val)}}
        secureTextEntry={true}
        />
        <View style={{flexDirection:'row'}}>
        <PickerInput style={{marginTop:15,zIndex:99,position:'absolute',top:5}} changeCountry={this.changeCountry}/>
        <View style={{flex:1}}>
        <Input
        label="+Phone number with country code"
        value={this.state.tel}
        style={{paddingLeft:40}}
        type="tel"
        keyboardType='numeric'
        onChangeText={(val)=>{this.handleTelChange('tel',val)}}
        />
        </View>
        </View>

        <Text style={{fontSize:10,color:'#FFF',marginTop:15}}>We will send you an SMS to ensure the phone number is valid</Text>
        <View style={styles.btnBase}>
        <Button  onPress={()=>{this.handleRegister()}}   title="Next"/>
        </View>
  </View>)
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3d3d3d",
    padding:20,
    paddingTop:0
  },
  btnBase:{
    flexDirection:'row',
    justifyContent:"space-between",
    marginTop:20
  }
});


const mapStateToProps=state=>{
  return{
      data:state.auth.registerData, 
      errorRegister:state.auth.errorRegister, 

   }
}
const mapDispatchToProps = dispatch => {
  return{
     doSingup:(em,pass,ccode,phone,token)=>dispatch(RegisterAction(em,pass,ccode,phone,token)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(Register);