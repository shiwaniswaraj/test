import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	ScrollView,
	KeyboardAvoidingView,
} from "react-native";
import Text from "@components/Text";
import ChatInput from "@components/ChatInput";
import { connect } from "react-redux";
import { Getmessagebycustomerid, addMessage } from "../../redux/action/auth";
import { Toast } from "native-base";
import moment from "moment";

export class Chat extends React.Component {
	state = {
		msg: "",
	};
	handleTextChange = (id, value) => this.setState({ [id]: value });
	async componentDidMount() {
		const { id } = this.props.data;
		await this.props.getChat(id);
		// this.setState({
		//   item
		// })
	}
	notify = (message, type) => {
		Toast.show({
			text: message,
			buttonText: "Okay",
			duration: 2000,
			position: "top",
			type,
		});
	};
	sendMessage = async () => {
		if (!this.state.msg) {
			this.notify("Please enter your message!", "danger");

			return;
		}
		await this.props.addMessage(this.props.data.id, this.state.msg);
		await this.props.getChat(this.props.data.id);
		this.setState({
			msg: "",
		});
	};
	onMessageChange = (msg) => {
		this.setState({
			msg,
		});
	};
	render() {
		const { route } = this.props;
		const { id, otherParam } = route.params;
		console.log(id);
		const msgData = this.props.msg.filter((e) => {
			return e.id_receiver === id || e.id_sender === id;
		});

		return (
			<KeyboardAvoidingView
				style={styles.container}
				behavior={Platform.OS == "ios" ? "padding" : "height"}
				enabled
				keyboardVerticalOffset={80}
			>
				<ScrollView style={{ flex: 1, padding: 20 }}>
					{msgData &&
						msgData.map((e) => {
							if (e.id_sender != this.props.data.id) {
								return (
									<View style={styles.chat}>
										<Text style={{ color: "#FFF", fontSize: 19 }}>
											{e.message}
										</Text>
										<Text
											style={{ color: "#FFF", fontSize: 14, marginTop: 10 }}
										>
											{moment(e.created_date).format("HH:mm a")}
										</Text>
									</View>
								);
							} else {
								return (
									<View style={[styles.chat, styles.me]}>
										<Text style={{ color: "#FFF", fontSize: 19 }}>
											{e.message}
										</Text>
										<Text
											style={{
												color: "#FFF",
												fontSize: 14,
												marginTop: 10,
												alignSelf: "flex-end",
											}}
										>
											{moment(e.created_date).format("HH:mm a")}
										</Text>
									</View>
								);
							}
						})}
				</ScrollView>
				<View style={{ paddingHorizontal: 10, paddingBottom: 15 }}>
					<ChatInput
						val={this.state.msg}
						onMessageChange={this.onMessageChange}
						sendMessage={this.sendMessage}
					/>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#3d3d3d",
	},
	me: {
		backgroundColor: "#007EF4",
		alignSelf: "flex-end",
		width: "80%",
	},
	chat: {
		backgroundColor: "#8B8B8B",
		padding: 20,
		borderRadius: 10,
		borderBottomLeftRadius: 0,
		width: "90%",
		marginVertical: 10,
	},
});

const mapStateToProps = (state) => {
	return {
		msg: state.auth.msg,
		data: state.auth.data,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getChat: (id) => dispatch(Getmessagebycustomerid(id)),
		addMessage: (id, msg) => dispatch(addMessage(id, msg)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Chat);
