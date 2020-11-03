import React, { Component } from "react";
import { View, TextInput, Animated, Image } from "react-native";

const defaultStyles = {
	labelStyle: {
		position: "absolute",
		left: 5,
		color: "#FFF",
		fontFamily: "Helvetica-Neue",
	},
	textInput: {
		height: 40,
		fontSize: 15,
		color: "#FFF",
		borderBottomWidth: 1,
		borderBottomColor: "#707070",
		borderRadius: 10,
		padding: 10,
		paddingLeft: 35,
	},
	flightIcon: {
		width: 19,
		height: 14,
		position: "absolute",
		top: 30,
		left: 8,
	},
	focusedTextInput: {},
	selectionColor: "#FFF",
};

export default class SearchInput extends Component {
	state = {
		isFocused: false,
	};

	UNSAFE_componentWillMount() {
		this._animatedIsFocused = new Animated.Value(
			this.props.value === "" ? 0 : 1
		);
	}

	handleFocus = () => this.setState({ isFocused: true });
	handleBlur = () => this.setState({ isFocused: false });

	componentDidUpdate() {
		Animated.timing(this._animatedIsFocused, {
			toValue: this.state.isFocused || this.props.value !== "" ? 1 : 0,
			duration: 200,
			useNativeDriver: false,
		}).start();
	}

	render() {
		const { label, colorLablel, icon, ...props } = this.props;
		const { isFocused } = this.state;
		const style = defaultStyles;
		const animatedLabelStyle = {
			top: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [18, 7],
			}),
			fontSize: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: [15, 12],
			}),
			color: this._animatedIsFocused.interpolate({
				inputRange: [0, 1],
				outputRange: ["#FFF", "#FFF"],
			}),
		};
		return (
			<View style={{ paddingTop: 18 }}>
				<Image source={icon} style={style.flightIcon} />
				<TextInput
					{...props}
					style={[style.textInput, isFocused && style.focusedTextInput]}
					placeholderTextColor="#FFF"
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
					placeholder={label}
					blurOnSubmit
					selectionColor={style.selectionColor}
					underlineColorAndroid="transparent"
				/>
			</View>
		);
	}
}
 