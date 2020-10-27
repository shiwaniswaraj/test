import React, { useState, useEffect } from "react";
import { Platform, Image, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

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

import icon1 from "@assets/images/icon5.png";
import icon2 from "@assets/images/icon4.png";
import icon3 from "@assets/images/icon3.png";
import icon4 from "@assets/images/icon2.png";
import icon5 from "@assets/images/icon1.png";

import icon1Red from "@assets/images/icon5-red.png";
import icon2Red from "@assets/images/icon4-red.png";
import icon3Red from "@assets/images/icon3-red.png";
import icon4Red from "@assets/images/icon2-red.png";
import icon5Red from "@assets/images/icon1-red.png";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const options = {
	headerStyle: {
		backgroundColor: "#3d3d3d",
		borderWidth: 0,
		borderBottomWidth: 0,
		shadowRadius: 0,
		shadowOffset: {
			height: 0,
		},
	},
	headerTintColor: "#FFF",
	headerTitleStyle: {
		color: "#FFF",
		textAlign: "center",
		fontFamily: "Helvetica-Neue",
	},
};
function screen2(props) {
	return <SearchFlight {...props} />;
}
function screen3(props) {
	return <Trips {...props} />;
}
function screen4(props) {
	return <MessageCenter {...props} />;
}
function screen5(props) {
	return <Profile {...props} />;
}
function HomeTabScreen(props) {
	const [icon1Image, setIcon1Image] = useState(icon1Red);
	const [icon2Image, setIcon2Image] = useState(icon2);
	const [icon3Image, setIcon3Image] = useState(icon3);
	const [icon4Image, setIcon4Image] = useState(icon4);
	const [icon5Image, setIcon5Image] = useState(icon5);

  useEffect(() => {
    let icon1Data = (props.route.state && props.route.state.index == 0) ? icon1Red : icon1;
    let icon2Data = (props.route.state && props.route.state.index == 1) ? icon2Red : icon2;
    let icon3Data = (props.route.state && props.route.state.index == 2) ? icon3Red : icon3;
    let icon4Data = (props.route.state && props.route.state.index == 3) ? icon4Red : icon4;
    let icon5Data = (props.route.state && props.route.state.index == 4) ? icon5Red : icon5;
    if (props.route.state != undefined) {
      setIcon1Image(icon1Data);
    }
    setIcon2Image(icon2Data);
    setIcon3Image(icon3Data);
    setIcon4Image(icon4Data);
    setIcon5Image(icon5Data);
  });
	return (
		<Tab.Navigator
			screenOptions={({ route }) => {
				return {
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						switch (route.name) {
							case "Home":
								iconName = icon1Image;
								break;
							case "Screen2":
								iconName = icon2Image;
								break;
							case "Trips":
								iconName = icon3Image;
								break;
							case "Screen4":
								iconName = icon4Image;
								break;
							case "Screen5":
								iconName = icon5Image;
								break;
						}

						return (
							<Image
								source={iconName}
								resizeMode="contain"
								style={{ width: 20, height: 20 }}
							/>
						);
					},
				};
			}}
			tabBarOptions={{
				activeTintColor: "red",
				inactiveTintColor: "gray",
				showLabel: false,
				style: {
					backgroundColor: "#000",
				},
			}}
		>
			{/* <Tab.Screen
				name="Home"
				component={Home}
				options={{
					tabBarLabel: "Home",
					tabBarIcon: ({ color }) => (
            <Image style={{width:20, height:20, resizeMode:"contain"}} source={icon1}/>
					),
				}}
			/> */}
      <Tab.Screen name="Home" component={Home} />
			<Tab.Screen name="Screen2" component={screen2} />
			<Tab.Screen name="Trips" component={screen3} />
			<Tab.Screen name="Screen4" component={screen4} />
			<Tab.Screen name="Screen5" component={screen5} />
		</Tab.Navigator>
	);
}

export default function Navigation(props) {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{
					headerBackTitle: "Back",
					headerTitleAlign: "center",
				}}
			>
				<Stack.Screen
					name="Login"
					options={{ headerShown: null }}
					component={Login}
				/>
				<Stack.Screen
					name="Home"
					options={{ headerShown: null }}
					component={HomeTabScreen}
				/>

				<Stack.Screen
					name="LoginForm"
					options={{
						title: "LOGIN",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={LoginForm}
				/>
				<Stack.Screen
					name="Otp"
					options={{
						title: "REGISTRATION",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={Otp}
				/>
				<Stack.Screen
					name="Register"
					options={{
						title: "REGISTRATION",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={Register}
				/>

				<Stack.Screen
					name="Deals"
					options={{
						title: "Search Results",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={Deals}
				/>

				<Stack.Screen
					name="EditProfile"
					options={{
						title: "EDIT PROFILE",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={EditProfile}
				/>

				<Stack.Screen
					name="ChangePassword"
					options={{
						title: "CHANGE PASSWORD",
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					}}
					component={ChangePassword}
				/>

				<Stack.Screen
					name="Chat"
					options={({ route }) => ({
						title: route.params.title,
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					})}
					component={Chat}
				/>

				<Stack.Screen
					name="DealsInner"
					options={({ route }) => ({
						title: route.params.title,
						headerStyle: options.headerStyle,
						headerTintColor: options.headerTintColor,
						headerTitleStyle: options.headerTitleStyle,
					})}
					component={DealsInner}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}
