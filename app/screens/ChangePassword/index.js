import React, { useState } from "react";
import { StyleSheet,View,Image,ScrollView,KeyboardAvoidingView } from "react-native";
import homeSlide from '@assets/images/homeSlide.png';
import Input from '@components/Input';
import Button from '@components/Button';
import logoCircle from '@assets/images/logoCircle.png';
import {connect} from 'react-redux';
import {passChange} from '../../redux/action/auth';


export   class ChangePassword extends React.Component {
  state={
    pass:"",
    newpass:"",
    cnfpass:""
  }
  changePassword=async()=>{
    await this.props.changePassword(this.props.data.id);
  }
  handleTextChange = (id,value) => this.setState({ [id]:value });
  handleTelChange=(id,value)=>{
    if(value.length==2 && value.indexOf("+")<0){
      value="+"+value;
    }
    this.setState({ [id]:value })
  }
  render(){
    
  return(<KeyboardAvoidingView style={{ flex:1}} 
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    enabled   
  >
        <ScrollView containerStyle={{flex:1}}> 

      <View style={styles.listMain}>
      <Input
        label="Enter your password"
        value={this.state.pass}
        onChangeText={(val)=>{this.handleTextChange('pass',val)}}
        black
        secureTextEntry={true}

           />
        <Input
        label="New Password"
        value={this.state.newpass}
        onChangeText={(val)=>{this.handleTextChange('newpass',val)}}
        secureTextEntry={true}
        black
        />
        <Input
        label="Confirm Password"
        value={this.state.cnfpass}
        onChangeText={(val)=>{this.handleTextChange('cnfpass',val)}}
        secureTextEntry={true}
        black
        />
        
      </View>
      <View style={{alignItems:"center",marginTop:0,padding:10}}>
        <Button onPress={()=>{this.changePassword()}} filled title="CHANGE PASSWORD"/>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  }, 
  name:{
    color:"#FFF",
    fontSize:28,
    marginTop:20
    
  },
  main:{
    backgroundColor:"#000",
    padding:10,
    height:200,
    alignItems:"center",
    justifyContent:"center",
    overflow:"hidden"
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    position:"absolute",
    width:'60%',
    height:'110%',
    right:0,
    zIndex:-1
  },
  logo:{
      width:100,
      height:100
  },
  listMain:{
      padding:30,
      flex:1
  },
  list:{
      fontSize:17,
      padding:10,
      flexDirection:'row',
      alignItems:"center"
  },
  iconImg:{
      width:25,
      height:25,
      marginRight:10,
      resizeMode:"contain"
  }
});



const mapStateToProps=state=>{
  return{
      data:state.auth.data, 
      profiledata:state.auth.profiledata,
   }
}
const mapDispatchToProps = dispatch => {
  return{
    changePassword:(id)=>dispatch(passChange(id))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(ChangePassword);
