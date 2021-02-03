import React from "react";
import {
	StyleSheet,
	View,
	Platform,
	ScrollView,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Text from "@components/Text";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { connect } from "react-redux";
import { CheckEmailMobile } from "../../redux/action/auth";
import PickerInput from "@components/CountryPicker";
import { Icon, Toast, Switch, Picker } from "native-base";
//import { Picker } from '@react-native-community/picker';
import usStateList from "@assets/us-states.json";

class Register extends React.Component {
	state = {
		email: "",
		password: "",
		cnfPassword: "",
		swtch:true,
		tel: "+1",
		ccode: "1",
		txtcountrycode: "US",
		fname: "",
		lname: "",
		address: "",
		city: "",
		userstate: undefined,
		pincode: "",
		terms: false,
	};
	handleTextChange = (id, value) => this.setState({ [id]: value });
	handleTelChange = (id, value) => {
		const { ccode } = this.state;
		if (value.length <= ccode.length) {
			return;
		}
		this.setState({ [id]: value });
	};

	changeCountry = (country) => {
		console.log("country = ", country.cca2);
		this.setState({
			country,
			ccode: country.callingCode[0],
			tel: "+" + country.callingCode[0],
			txtcountrycode: country.cca2,
		});
	};

	checkEmail = (em) => {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(em)) {
			return true;
		}
		return false;
	};

	notify = (message, type) => {
		Toast.show({
			text: message,
			buttonText: "Okay",
			duration: 2000,
			position: "top",
			type,
		});
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
			console.log(token);
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

	UNSAFE_componentWillMount() {
		this.enablePushNotifications().then((token) => {
			this.setState({
				token,
			});
		});
	}

	componentDidMount() {
		// this.enablePushNotifications()
	}

	handleRegister = async () => {
		let {
			email,
			password,
			cnfPassword,
			ccode,
			tel,
			token,
			txtcountrycode,
			fname,
			lname,
			address,
			city,
			userstate,
			pincode,
			terms,
		} = this.state;

		if (!email || !this.checkEmail(email)) {
			this.notify("Invalid email!", "danger");
			return;
		} else if (!password) {
			this.notify("Please enter password!", "danger");
			return;
		} else if (!cnfPassword) {
			this.notify("Please enter confirm password!", "danger");
			return;
		} else if (password != cnfPassword) {
			this.notify("Confirm password does not match", "danger");
			return;
		} else if (!tel) {
			this.notify("Please enter phone number!", "danger");
			return;
		} else if (tel.length <= 10) {
			this.notify("Please enter correct phone number", "danger");
			return;
		} else if (!ccode) {
			this.notify("Please enter country code!", "danger");
			return;
		} else if (!fname) {
			this.notify("Please enter first name", "danger");
			return;
		} else if (!lname) {
			this.notify("Please enter last name", "danger");
			return;
		} else if (!address) {
			this.notify("Please enter address", "danger");
			return;
		} else if (!city) {
			this.notify("Please enter city", "danger");
			return;
		} else if (!userstate) {
			this.notify("Please enter state", "danger");
			return;
		} else if (!pincode) {
			this.notify("Please enter pincode", "danger");
			return;
		} else if (isNaN(pincode)) {
			this.notify("Please enter only digits", "danger");
			return;
		} else if (!terms) {
			this.notify("Please agree Term and Condition", "danger");
			return;
		}

		ccode = `+${ccode}`;
		tel = tel.replace(ccode, "");

		let dataToSend = {
			email,
			password,
			ccode,
			tel,
			txtcountrycode,
			fname,
			
			lname,
			address,
			city,
			userstate,
			pincode,
			token,
		};
		console.log("post data = ", dataToSend);
		await this.props
			.checkEmailMobile(email, password, ccode, tel, token)
			.then((response) => {
				if (response.data.status == 200) {
					this.setState({ retdirect: true });
					this.props.navigation.navigate("Otp", { registerData: dataToSend });
				}
			});
	};

	render() {
		const { email, password, ccode, tel, retdirect } = this.state;

		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				enabled
				keyboardVerticalOffset={80}
			>
				<ScrollView style={{flex:1}}>
				 
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
				   
					<View style={{ flexDirection: "row" }}>
						<PickerInput
							style={{
								marginTop: 25,
								zIndex: 99,
								position: "absolute" /* top: 5 */,
							}}
							changeCountry={this.changeCountry}
						/>
						<View style={{ flex: 1 }}>
							<Input
								label="+Phone number with country code"
								value={this.state.tel}
								style={{ paddingLeft: 40 }}
								type="tel"
								keyboardType="numeric"
								onChangeText={(val) => {
									this.handleTelChange("tel", val);
								}}
							/>
						</View>
					</View>

					<Text style={{ fontSize: 10, color: "#000", marginTop: 15 }}>
						We will send you an SMS to ensure the phone number is valid
					</Text>

					<View
						style={{
							flexDirection: "row",
							marginTop: 10,
							
						}}
					>
					 
						<Text style={{ marginTop: 0, flex:1,color: "#000" }}>Validation</Text>
						<Switch value={this.state.swtch} onValueChange={(e)=>{
							this.setState({
								swtch:e
							})
						}} color="red"/>

					</View>

					<View
						style={{
							flexDirection: "row",
							marginTop: 10,
							
						}}
					>
					 
						<Text style={{ marginTop: 0, color: "#000" }}>
						I consent that my email and phone will be used to create my account.
Account is required to purchase aviation services. We will send you  an SMS to ensure the phone number is valid
						</Text>
					</View>
					
					
					
				</ScrollView>
				<View style={styles.btnBase}>
						<Button
							filled
							onPress={() => {
								this.handleRegister();
							}}
							title="Next"
						/>
					</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF",
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
		data: state.auth.registerData,
		errorRegister: state.auth.errorRegister,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		checkEmailMobile: (em, pass, ccode, phone, token) =>
			dispatch(CheckEmailMobile(em, pass, ccode, phone, token)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Register);
