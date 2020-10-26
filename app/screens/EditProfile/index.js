import React, { useState } from "react";
import { StyleSheet,View,Image,ScrollView, KeyboardAvoidingView,Platform,TouchableOpacity } from "react-native";
import homeSlide from '@assets/images/homeSlide.png';
import Input from '@components/Input';
import Button from '@components/Button';
import logoCircle from '@assets/images/logoCircle.png';
import * as ImagePicker from 'expo-image-picker';

import {connect} from 'react-redux';
import {GetProfile,SaveProfile} from '../../redux/action/auth';


export   class EditProfile extends React.Component {
  state={
    fname:"",
    lname:"",
    email:"",
    tel:""
  }
  async  componentDidMount(){
    const {id}=this.props.data;
    const {profiledata}=this.props;

    await this.props.getProfile(id);
    this.setState({
      fname:profiledata.fname,
      lname:profiledata.lname,
      image:profiledata.image,
      email:profiledata.email,
      tel:"+"+profiledata.countrycode+profiledata.phonenumber,
      
    });

    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }

  }

    pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    console.log(result);
    if (!result.cancelled) {
      this.setState({
        image:result.uri,
        result:result
      })
    }
     
    
  };

  handleTextChange = (id,value) => this.setState({ [id]:value });
  handleTelChange=(id,value)=>{
    if(value.length==2 && value.indexOf("+")<0){
      value="+"+value;
    }
    this.setState({ [id]:value })
  }

  saveProfile=async()=>{
    const {profiledata}=this.props;
    const{fname,lname,email,image}=this.state;
    await  this.props.save(fname,lname,email,profiledata.id,profiledata.countrycode,profiledata.phonenumber,result)
    // await this.props.getProfile(id);
    // this.setState({
    //   fname:profiledata.fname,
    //   lname:profiledata.lname,
    //   email:profiledata.email,
    //   tel:"+"+profiledata.countrycode+profiledata.phonenumber,
    // })
  }

  
  

  render(){
  return(<KeyboardAvoidingView style={{ flex:1}} 
    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
    enabled   
  >
        <ScrollView containerStyle={{flex:1}}>
  <View style={styles.container}>
       <View style={styles.main}>
        <TouchableOpacity onPress={()=>{this.pickImage()}} style={styles.logo}>
        <Image source={{uri:this.state.image}} style={styles.logoImg}/>
        </TouchableOpacity>
        
        <Image source={homeSlide} style={styles.image}/>
      </View>
       

      <View style={styles.listMain}>
      <Input
        label="First name"
        value={this.state.fname}
        onChangeText={(val)=>{this.handleTextChange('fname',val)}}
        black
           />
            <Input
        label="Last name"
        value={this.state.lname}
        onChangeText={(val)=>{this.handleTextChange('lname',val)}}
        black
           />
        <Input
        label="Email"
        value={this.state.email}
        onChangeText={(val)=>{this.handleTextChange('email',val)}}
       
        black
        />
        <Input
        label="+Phone number with country code"
        value={this.state.tel}
        type="tel"
        onChangeText={(val)=>{this.handleTelChange('tel',val)}}
        black
        />       
      </View>
      <View style={{alignItems:"center",marginTop:0,padding:0}}>
        <Button onPress={()=>{this.saveProfile()}} filled title="SAVE DATA"/>
      </View>

      
      
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
  logoImg:{
    maxWidth:100,
    height:100,
    resizeMode:'cover',

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
      height:100,
      borderRadius:100,
      borderWidth:4,
      borderColor:'#FFF',
      overflow:'hidden'
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
     getProfile:(id)=>dispatch(GetProfile(id)),
     save:(fname,lname,email,id_customer,countrycode,phonenumber,image)=>dispatch(SaveProfile(fname,lname,email,id_customer,countrycode,phonenumber,image)),
     
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(EditProfile);
