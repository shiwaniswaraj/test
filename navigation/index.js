import React from "react";
import { Platform,Image,View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
  
import Home from "../app/screens/Home";
import Login from "../app/screens/Login";
import LoginForm from "../app/screens/LoginForm";
import Register from "../app/screens/Register";
import Otp from "../app/screens/Otp";
import Profile from "../app/screens/Profile";
import Deals from "../app/screens/Deals";
import EditProfile from "../app/screens/EditProfile";
import ChangePassword from "../app/screens/ChangePassword";

import SearchFlight from "../app/screens/SearchFlight";
import MessageCenter from "../app/screens/MessageCenter";
import Chat from "../app/screens/Chat";
import DealsInner from "../app/screens/DealsInner";
import Trips from "../app/screens/Trips";


import icon1 from '@assets/images/icon5.png';
import icon2 from '@assets/images/icon4.png';
import icon3 from '@assets/images/icon3.png';
import icon4 from '@assets/images/icon2.png';
import icon5 from '@assets/images/icon1.png';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const options={
  headerStyle: {
    backgroundColor: '#3d3d3d',
    borderWidth:0,
    borderBottomWidth:0,
    shadowRadius: 0,
    shadowOffset: {
    height: 0,
    },
  },
  headerTintColor: '#FFF',
  headerTitleStyle: {
    color:"#FFF",
    textAlign:"center",
    marginLeft:-20,
    fontFamily:"Helvetica-Neue"
  },
 }
 function screen2(props) {
      return (<SearchFlight {...props}/>)
  }
  function screen3(props) {
    return (<Trips {...props}/>)
}
function screen4(props) {
  return (<MessageCenter {...props}/>)
}
function screen5(props) {
  return (<Profile {...props}/>)
}
function HomeTabScreen() {
  return (
  
     
    <Tab.Navigator
    
    screenOptions={({ route }) => ({
      
       tabBarIcon: ({ focused, color, size }) => {
      let iconName;
        switch(route.name){
         case "Home":
          iconName = icon1
          break;
          case "Screen2":
            iconName = icon2
            break;
            case "Trips":
              iconName = icon3
              break;
              case "Screen4":
                iconName = icon4
                break;
                case "Screen5":
                iconName = icon5
                break;
             
          
           
       }
 
  return <Image source={iconName} resizeMode='contain' style={{width:20,height:20}}      />;
    },
 })}
tabBarOptions={{
 activeTintColor: 'tomato',
 inactiveTintColor: 'gray',
 showLabel:false,
 style: {
  backgroundColor: '#000',
  },
 }}>
     <Tab.Screen name="Home" component={Home} />
     <Tab.Screen name="Screen2" component={screen2} />
     <Tab.Screen name="Trips" component={screen3} />
     <Tab.Screen name="Screen4" component={screen4} />
     <Tab.Screen  name="Screen5" component={screen5} />
      
   </Tab.Navigator>
   
  );
}

export default function Navigation(props) {
  
    
  return(    <NavigationContainer>
    
    <Stack.Navigator
          screenOptions={{
            headerBackTitle:"Back"
          }}
            >
      <Stack.Screen name="Login" options={{headerShown:null}} component={Login} />
      <Stack.Screen name="Home" options={{headerShown:null}} component={HomeTabScreen} />
      
      <Stack.Screen name="LoginForm"  options={{
        title:"LOGIN",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,

    }} component={LoginForm} />
     <Stack.Screen name="Otp" options={{
        title:"REGISTRATION",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
        }} component={Otp} />
      <Stack.Screen name="Register" options={{
        title:"REGISTRATION",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      }} component={Register} />

      <Stack.Screen name="Deals" options={{
        title:"Search Results",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      }} component={Deals} />

       
      <Stack.Screen name="EditProfile" options={{
        title:"EDIT PROFILE",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      }} component={EditProfile} />
     
     <Stack.Screen name="ChangePassword" options={{
        title:"CHANGE PASSWORD",
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      }} component={ChangePassword} />
     
     <Stack.Screen name="Chat"
     options={({ route }) => ({
        title:route.params.title,
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      })} component={Chat} />
          
     
      <Stack.Screen name="DealsInner"
     options={({ route }) => ({
        title:route.params.title,
        headerStyle:options.headerStyle,
        headerTintColor:options.headerTintColor,
        headerTitleStyle:options.headerTitleStyle,
      })} component={DealsInner} />
          

     </Stack.Navigator>

  </NavigationContainer>
)
}
 
 