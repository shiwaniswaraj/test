import React from "react";
import { StyleSheet, View, Image } from "react-native";
import backgroundLogin from "@assets/images/backgroundlogin.jpg";
import logo from "@assets/images/logo.png";
import Button from "@components/Button";
import Text from "@components/Text";
import Link from "@components/Link";
import { connect } from "react-redux";
import { changeData } from "../../redux/action/auth";
import AsyncStorage from "@react-native-community/async-storage";

import { TouchableOpacity } from "react-native-gesture-handler";
class Login extends React.Component {
	async componentDidMount() {
		const unsubscribe = this.props.navigation.addListener("focus", () => {

			if (this.props.isLoggedin) {
				this.props.navigation.navigate("Home");
				return;
			}
    });
    
    const data = await this.getData("data");

		if (data) {
			await this.props.changeData(data);
    }

		if (this.props.isLoggedin) {
			this.props.navigation.navigate("Home");
			return;
		}
	}
	getData = async (storage_Key) => {
		const value = await AsyncStorage.getItem(storage_Key);
		if (storage_Key == "data") {
			return value ? JSON.parse(value) : null;
		}
		return value ? true : false;
	};

	render() {
		const { navigation } = this.props;
		const { route } = this.props;
		// const { from} = route.params;

		return (
			<View style={styles.container}>
				<View style={styles.logoContainer}>
					<Image source={logo} style={styles.logo} />
				</View>
				<View
					style={styles.skip}
					onStartShouldSetResponder={() => {
						navigation.navigate("Home");
					}}
				>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("Home");
						}}
					>
						<Text style={{ color: "#FFF" }}>SKIP</Text>
					</TouchableOpacity>
				</View>
				<Image
					source={backgroundLogin}
					style={{ width: "100%", height: "100%" }}
				/>
				<View style={styles.btnBase}>
					<Button
						onPress={() => {
							navigation.navigate("Register");
						}}
						filled
						title="CREATE ACCOUNT"
					/>
					{!route.params && (
						<Button
							onPress={() => {
								navigation.navigate("LoginForm");
							}}
							title="LOGIN"
						/>
					)}
					{route.params && route.params.from && (
						<Button
							onPress={() => {
								navigation.navigate("LoginForm", {
									from: route.params.from,
									...route.params,
								});
							}}
							title="LOGIN"
						/>
					)}

					<Text style={[styles.textCommon, { marginTop: 10 }]}>
						EMCJET is an Indirect Air Carrier and does not own, maintain, or
						operate aircraft.{" "}
					</Text>
					<Text style={styles.textCommon}>
						the <Link>Terms of Use</Link> and the <Link>Privacy Policy</Link>
					</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#3d3d3d",
	},
	logo: {
		width: 185,
		height: 43,
		alignSelf: "center",
	},
	logoContainer: {
		position: "absolute",
		top: 60,
		zIndex: 9,
		alignSelf: "center",
	},
	skip: {
		position: "absolute",
		right: 30,
		top: 40,
		zIndex: 10,
		color: "#FFF",
	},
	btnBase: {
		position: "absolute",
		alignSelf: "center",
		bottom: 10,
		zIndex: 9,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	textCommon: {
		padding: 5,
		color: "#FFF",
		textAlign: "center",
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
		//doLogin: (em, pass) => dispatch(LoginAction(em, pass)),
		changeData: (data) => dispatch(changeData(data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
