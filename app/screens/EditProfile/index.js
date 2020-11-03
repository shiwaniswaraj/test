import React from "react";
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
	Platform,
	TouchableOpacity,
} from "react-native";
import homeSlide from "@assets/images/homeSlide.png";
import Input from "@components/Input";
import Button from "@components/Button";
import * as ImagePicker from "expo-image-picker";

import { connect } from "react-redux";
import { GetProfile, SaveProfile } from "../../redux/action/auth";
import PickerInput from "@components/CountryPicker";

export class EditProfile extends React.Component {
	state = {
		name: "",
		email: "",
		tel: "",
		ccode: "",
		txtcountrycode: "",
		fetchingData: true,
		address: "",
		city: "",
		userstate: "",
		pincode: "",
		uploadedImage: "",
		image: "",
		result: "",
	};
	async componentDidMount() {
		const { id } = this.props.data;
		const { profiledata } = this.props;
		console.log(profiledata);
		await this.props.getProfile(id);

		this.setState({
			uploadedImage: profiledata.image,
			name: profiledata.name,
			email: profiledata.email,
			tel: profiledata.countrycode + profiledata.phonenumber,
			txtcountrycode: profiledata.txtcountrycode,
			ccode: profiledata.countrycode,
			address: profiledata.address,
			city: profiledata.city,
			userstate: profiledata.state,
			pincode: profiledata.pincode,
		});
		this.setState({ fetchingData: false });

		if (Platform.OS !== "web") {
			const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
			if (status !== "granted") {
				alert("Sorry, we need camera roll permissions to make this work!");
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

		if (!result.cancelled) {
			this.setState({
				image: result.uri,
				result: result,
			});
		}
	};

	handleTextChange = (id, value) => this.setState({ [id]: value });
	handleTelChange = (id, value) => {
		if (value.length == 2 && value.indexOf("+") < 0) {
			value = "+" + value;
		}
		this.setState({ [id]: value });
	};

	changeCountry = (country) => {
		console.log("country = ", country);
		this.setState({
			country,
			ccode: country.callingCode[0],
			tel: "+" + country.callingCode[0],
		});
	};

	saveProfile = async () => {
		const { profiledata } = this.props;
		let {
			name,
			email,
			ccode,
			tel,
			result,
			txtcountrycode,
			address,
			city,
			userstate,
			pincode,
		} = this.state;

		ccode = ccode.startsWith("+") && Boolean(ccode) ? ccode : `+${ccode}`;
		tel = tel.startsWith(ccode) ? tel.replace(ccode, "") : tel;

		const dataToSend = {
			name,
			email,
			ccode,
			tel,
			txtcountrycode,
			address,
			city,
			userstate,
			pincode,
			id: profiledata.id,
			result,
		};
		await this.props.save(dataToSend);
		await this.props.getProfile(profiledata.id)
		.then((res) => {
			if (res.data.status == 200) {
				let userData = res.data.data;
				this.setState({
					uploadedImage: userData.image,
					name: userData.name,
					email: userData.email,
					tel: userData.countrycode + userData.phonenumber,
					txtcountrycode: userData.txtcountrycode,
					ccode: userData.countrycode,
					address: userData.address,
					city: userData.city,
					userstate: userData.state,
					pincode: userData.pincode,
				});
			}
		});
	};

	render() {
		return (
			<>
				{this.state.fetchingData == false && (
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS == "ios" ? "padding" : "height"}
						enabled
					>
						<ScrollView containerStyle={{ flex: 1 }}>
							<View style={styles.container}>
								<View style={styles.main}>
									<TouchableOpacity
										onPress={() => {
											this.pickImage();
										}}
										style={styles.logo}
									>
										{Boolean(this.state.image) && Boolean(this.state.result) ? (
											<Image
												source={{ uri: this.state.image }}
												style={styles.logoImg}
											/>
										) : (
											<Image
												source={{ uri: this.state.uploadedImage }}
												style={styles.logoImg}
											/>
										)}
									</TouchableOpacity>

									<Image source={homeSlide} style={styles.image} />
								</View>

								<View style={styles.listMain}>
									<Input
										label="Name"
										value={this.state.name}
										onChangeText={(val) => {
											this.handleTextChange("name", val);
										}}
										black
									/>
									<Input
										label="Email"
										value={this.state.email}
										onChangeText={(val) => {
											this.handleTextChange("email", val);
										}}
										black
										editable={false}
									/>

									<Input
										label="Address"
										value={this.state.address}
										onChangeText={(val) => {
											this.handleTextChange("address", val);
										}}
										black
										autoCapitalize="none"
									/>

									<Input
										label="City"
										value={this.state.city}
										onChangeText={(val) => {
											this.handleTextChange("city", val);
										}}
										black
										autoCapitalize="none"
									/>

									<Input
										label="State"
										value={this.state.userstate}
										onChangeText={(val) => {
											this.handleTextChange("userstate", val);
										}}
										black
										autoCapitalize="none"
									/>

									<Input
										label="Pincode"
										value={this.state.pincode}
										onChangeText={(val) => {
											this.handleTextChange("pincode", val);
										}}
										black
										autoCapitalize="none"
									/>

									<View style={{ flexDirection: "row" }}>
										<PickerInput
											style={{
												marginTop: 25,
												zIndex: 99,
												position: "absolute",
											}}
											changeCountry={this.changeCountry}
											countryCode={this.state.txtcountrycode}
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
												black
											/>
										</View>
									</View>
								</View>
								<View
									style={{ alignItems: "center", marginTop: 0, padding: 0 }}
								>
									<Button
										onPress={() => {
											this.saveProfile();
										}}
										filled
										title="SAVE DATA"
									/>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				)}
			</>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF",
	},
	name: {
		color: "#FFF",
		fontSize: 28,
		marginTop: 20,
	},
	main: {
		backgroundColor: "#000",
		padding: 10,
		height: 200,
		alignItems: "center",
		justifyContent: "center",
		overflow: "hidden",
	},
	labelStyle: {
		left: 0,
		color: "black",
		fontFamily: "Helvetica-Neue",
	},
	textInput: {
		height: 40,
		fontSize: 15,
		color: "black",
		borderBottomWidth: 1,
		borderBottomColor: "#707070",
	},
	logoImg: {
		maxWidth: 100,
		height: 100,
		resizeMode: "cover",
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
		position: "absolute",
		width: "60%",
		height: "110%",
		right: 0,
		zIndex: -1,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 100,
		borderWidth: 4,
		borderColor: "#FFF",
		overflow: "hidden",
	},
	listMain: {
		padding: 30,
		flex: 1,
	},
	list: {
		fontSize: 17,
		padding: 10,
		flexDirection: "row",
		alignItems: "center",
	},
	iconImg: {
		width: 25,
		height: 25,
		marginRight: 10,
		resizeMode: "contain",
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		profiledata: state.auth.profiledata,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getProfile: (id) => dispatch(GetProfile(id)),
		save: (dataToSend) => dispatch(SaveProfile(dataToSend)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
