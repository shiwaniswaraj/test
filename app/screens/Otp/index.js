import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Text from "@components/Text";
import { connect } from "react-redux";
import {
	ResendOtp,
	VerifyOtp,
	RegisterAction,
} from "../../redux/action/auth";

export class Otp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			otp: "",
			time: 60,
		};
	}

	decreseTime = () => {
		const { time } = this.state;
		var t = time;
		setTimeout(() => {
			t--;
			this.setState({
				time: t,
			});
			if (t > 0) {
				this.decreseTime();
			}
		}, 1000);
	};
	componentDidMount() {
		console.log(this.props.route);
		this.decreseTime();
	}

	/* componentDidUpdate() {
		if (this.props.otpverify == true) {
      console.log("otp routes = ",this.props);
			//const { email, password } = this.props.route.params;
			//this.props.navigation.navigate("Home");
		}
	} */

	handleTextChange = (id, value) => this.setState({ [id]: value });

	resend = async () => {
		const { route } = this.props;
		const { tel, ccode } = route.params;
		await this.props.resend(tel, ccode);
	};

	verify = async () => {
		const { route } = this.props;
		const { registerData } = route.params;
		const { tel, ccode, email, password } = registerData;
		
		const { otp } = this.state;
		await this.props.verify(tel, ccode, otp).then(async (response) => {
			if (response.data.status == 200) {
				await this.props
					.doSingup(registerData)
					.then((response) => {
						console.log("otp compo designup = ", response);
						if (response.data.status == 200) {
							this.props.navigation.navigate("LoginForm", {
								email: email,
								password: password,
							});
						} else {
							this.props.navigation.navigate("Register");
						}
					});
			}
		});
	};

	render() {
		/* if (this.props.otpverify && this.state.retdirect) {
			return (
				<Redirect
					to="LoginForm"
					navigation={this.props.navigation}
					data={{ noDat: "" }}
				/>
			);
		} */
		return (
			<View style={styles.container}>
				<Text style={{ color: "#FFF" }}>PLEASE ENTER</Text>
				<Text style={{ color: "#FFF" }}>YOUR SMS CODE BELOW</Text>
				<View style={{ marginTop: 30 }} />

				<Input
					label="SMS Code"
					value={this.state.otp}
					colorLablel="#707070"
					onChangeText={(val) => {
						this.handleTextChange("otp", val);
					}}
					keyboardType="number-pad"
				/>
				{this.state.time > 0 && (
					<Text
						style={{
							fontSize: 12,
							color: "#FFF",
							alignSelf: "flex-end",
							marginTop: 20,
						}}
					>
						Resend In {this.state.time}
					</Text>
				)}

				{this.state.time <= 0 && (
					<TouchableOpacity
						onPress={() => {
							this.resend();
						}}
						style={{
							alignSelf: "flex-end",
							marginTop: 20,
							height: 20,
							backgroundColor: "#000",
						}}
					>
						<Text style={{ fontSize: 12, color: "#FFF" }}>Resend</Text>
					</TouchableOpacity>
				)}
				<View style={styles.btnBase}>
					<Button
						onPress={() => {
							this.verify();
						}}
						title="Next"
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
		otpverify: state.auth.otpverify,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		resend: (phone, ccode) => dispatch(ResendOtp(phone, ccode)),
		verify: (phone, ccode, otp) => dispatch(VerifyOtp(phone, ccode, otp)),
		doSingup: (registerData) =>
			dispatch(RegisterAction(registerData)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Otp);
