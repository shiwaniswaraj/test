import React, { useState } from "react";
import { StyleSheet, View, Image, Platform } from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Redirect from "@components/Redirect";
import Text from "@components/Text";
// import { Notifications, Permissions } from 'expo';
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { connect } from "react-redux";
import { LoginAction } from "../../redux/action/auth";

class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: "",
			token: "",
			error: "",
		};
	}

	askPermissions = async () => {
		const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		);
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			return false;
		}
		return true;
	};

	registerForPushNotifications = async () => {
		const enabled = await this.askPermissions();
		if (!enabled) {
			return Promise.resolve();
		}
		// Get the token that uniquely identifies this device
		let token = await Notifications.getExpoPushTokenAsync();
		return token;
	};

	enablePushNotifications = async () => {

		let token;
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(
				Permissions.NOTIFICATIONS
			);
			let finalStatus = existingStatus;
			if (existingStatus !== "granted") {
				const { status } = await Permissions.askAsync(
					Permissions.NOTIFICATIONS
				);
				finalStatus = status;
			}
			if (finalStatus !== "granted") {
				alert("Failed to get push token for push notification!");
				return;
			}
			token = (await Notifications.getExpoPushTokenAsync()).data;
		} else {
			alert("Must use physical device for Push Notifications");
		}

		if (Platform.OS === "android") {
			Notifications.setNotificationChannelAsync("default", {
				name: "default",
				importance: Notifications.AndroidImportance.MAX,
				vibrationPattern: [0, 250, 250, 250],
				lightColor: "#FF231F7C",
			});
		}

		return token;
	};

	/* async componentWillMount() {
		await this.enablePushNotifications().then((token) => {
			this.setState({
				token,
			});
			console.log(token);
			if (this.props.route.params) {
				this.loginIfHavePrams();
			}
		});
	} */

	async componentDidMount() {
    //this.enablePushNotifications();
    this.props.showLoadingGlobal();
    await this.enablePushNotifications().then((token) => {
			this.setState({
				token,
			});
			console.log(token);
			if (this.props.route.params) {
				this.loginIfHavePrams(token);
			}
    });
    this.props.hideLoadingGlobal();
		if (this.props.isLoggedin) {
			this.props.navigation.navigate("Home");
		}
	}

	loginIfHavePrams = async (token) => {
		let { email, password } = this.props.route.params;
		if (email && password) {
      this.setState({email: email, password: password});
			await this.props.doLogin(email, password, token).then((response) => {
				if (response.data.status == 200) {
					this.storeData("token", response.data.data.token);
					this.storeData("data", JSON.stringify(response.data.data));
				}
			});
		}
	};

	storeData = async (key, value) => {
		try {
			await AsyncStorage.setItem(key, value);
		} catch (e) {
			// saving error
		}
	};

	getData = async () => {
		try {
			const value = await AsyncStorage.getItem("token");
			if (value !== null) {
				// value previously stored
			}
		} catch (e) {
			// error reading value
		}
	};

	handleLogin = async () => {
		const { email, password, token } = this.state;
		await this.props.doLogin(email, password, token).then((response) => {
			if (response.data.status == 200) {
				this.storeData("token", response.data.data.token);
				this.storeData("data", JSON.stringify(response.data.data));
			}
		});
		/* setTimeout(()=>{
        if(this.props.data){

        this.storeData("token",this.props.data.token);
        this.storeData("data",JSON.stringify(this.props.data));
      }
    },2000); */
	};
	handleTextChange = (id, value) => this.setState({ [id]: value });

	render() {
		const { route } = this.props;

		if (this.props.isLoggedin) {
			return (
				<Redirect
					to="Home"
					navigation={this.props.navigation}
					data={{ noDat: "" }}
				/>
			);
		}

		return (
			<View style={styles.container}>
				<Input
					label="Email"
					value={this.state.email}
					onChangeText={(val) => {
						this.handleTextChange("email", val);
					}}
					autoCapitalize="none"
					keyboardType="email-address"
				/>
				<Input
					label="Password"
					value={this.state.password}
					onChangeText={(val) => {
						this.handleTextChange("password", val);
					}}
					secureTextEntry={true}
				/>
				<View style={styles.btnBase}>
					<Button color="#000" title="Forgot?" />
					<View style={{ width: 10 }} />
					<Button
						onPress={() => {
							this.handleLogin();
						}}
						title="Login"
					/>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#3d3d3d",
		padding: 20,
		paddingTop: 0,
	},
	btnBase: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		isLoggedin: state.auth.isLoggedin,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		doLogin: (em, pass, tok) => dispatch(LoginAction(em, pass, tok)),
		hideLoadingGlobal: () => dispatch({ type: "hideloading" }),
		showLoadingGlobal: () => dispatch({ type: "showloading" }),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
