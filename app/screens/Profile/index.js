import React, { useState } from "react";
import { StyleSheet,View,Image,ScrollView } from "react-native";
import homeSlide from '@assets/images/homeSlide.png';
import logoCircle from '@assets/images/logoCircle.png';
import Text from '@components/Text';
import edit from '@assets/images/iconProfile/edit.png';
import familyInsurance from '@assets/images/iconProfile/family-insurance.png';
import faq from '@assets/images/iconProfile/faq.png';
import shield from '@assets/images/iconProfile/shield.png';
import insurance from '@assets/images/iconProfile/insurance.png';
import logout from '@assets/images/iconProfile/logout.png';

import {connect} from 'react-redux';
import {GetProfile,logoutAction  } from '../../redux/action/auth';
import { TouchableOpacity } from "react-native-gesture-handler";



export  class Profile extends React.Component {
  constructor(props){
    super(props);
    this.state={}
  }
  
  doLogout=async()=>{
    await this.props.logout();
    this.props.navigation.navigate('Login');
  }

  async componentDidMount(){
   
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      if(!this.props.data){
        this.props.navigation.navigate("Login");
        return;
      }

    });
    
    if(!this.props.data){
      return;
    }

    const {id}=this.props.data;
    
 

    await this.props.getProfile(id);
      
  }

  render(){
  const{navigation,profiledata}=this.props;

  return(<View style={styles.container}>
      {profiledata && 
       <View style={styles.main}>
        <Image source={logoCircle} style={styles.logo}/>
      <Text style={styles.name}>{profiledata.fname} {profiledata.lname}</Text>
        <Image source={homeSlide} style={styles.image}/>
      </View>
      }
      <ScrollView style={{flex:1}}>

      <View style={styles.listMain}>
        <View style={styles.list}  onStartShouldSetResponder={()=>{navigation.navigate('EditProfile')}}>
            <Image source={edit} style={styles.iconImg}/>
            <Text>Edit profile</Text></View>
        <View style={styles.list} onStartShouldSetResponder={()=>{navigation.navigate('ChangePassword')}}>
        <Image source={shield} style={styles.iconImg}/>
        <Text>Change Password</Text></View>
        <View style={styles.list}>
        <Image source={edit} style={styles.iconImg}/>
        <Text>About</Text></View>
        <View style={styles.list}>
        <Image source={faq} style={styles.iconImg}/>
        <Text>F.A.Q</Text></View>
        <View style={styles.list}>
        <Image source={familyInsurance} style={styles.iconImg}/>
        <Text>Legal</Text></View>
        <View style={styles.list}>
        <Image source={insurance} style={styles.iconImg}/>
        <Text>License notice</Text></View>
        <TouchableOpacity onPress={()=>{this.doLogout()}} style={styles.list}>
        <Image source={logout} style={styles.iconImg}/>
        <Text>Log out</Text></TouchableOpacity>
      </View>
      </ScrollView>
      
  </View>
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
    height:300,
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
      padding:30
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
     logout:()=>dispatch(logoutAction()),
     
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(Profile);