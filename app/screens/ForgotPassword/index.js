import React from "react";
import { StyleSheet, View } from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Redirect from "@components/Redirect";
import { connect } from "react-redux";
import { ForgotPasswordAction } from "../../redux/action/auth";

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: "",
			error: "",
		};
	}

	async componentDidMount() {
		if (this.props.isLoggedin) {
			this.props.navigation.navigate("Home");
		}
	}

	handleSubmit = async () => {
		const { email } = this.state;
		await this.props.forgotPassword(email).then(async (response) => {
			if (response.data.status == 200) {
				console.log("user data = ", response.data.data);
				this.props.navigation.navigate("LoginForm");
			}
		});
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
				<View style={styles.btnBase}>
					<View style={{ width: 10 }} />
					<Button
						onPress={() => {
							this.handleSubmit();
						}}
						title="Send Email"
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
		forgotPassword: (em) => dispatch(ForgotPasswordAction(em)),
		hideLoadingGlobal: () => dispatch({ type: "hideloading" }),
		showLoadingGlobal: () => dispatch({ type: "showloading" }),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
