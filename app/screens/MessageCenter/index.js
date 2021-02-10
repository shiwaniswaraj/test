import React, { useState } from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";
import logoMsg from "@assets/icon.png";
import Text from "@components/Text";
import { connect } from "react-redux";
import { Getmessagebycustomerid } from "../../redux/action/auth";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";

const DATA = [
	{
		id: 1,
		title: "XO TEAM",
	},
	{
		id: 2,
		title: "NEW TEAM",
	},
	{
		id: 3,
		title: "JHON DOE",
	},
];

export class MessageCenter extends React.Component {
	state = {};

	async componentDidMount() {
		this.unsubscribe = this.props.navigation.addListener("focus", async () => {
			// The screen is focused
			// Call any action
			// if()
			if (!this.props.data) {
				this.props.navigation.navigate("Login");
				return;
			}
			await this.props.getChat(id);
		});
		if (!this.props.data) {
			return;
		}

		const { id } = this.props.data;

		await this.props.getChat(id);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const newArray = [];
		this.props.msg.forEach((obj) => {
			if (
				!newArray.some((o) => o.id_sender === obj.id_sender) &&
				!newArray.some((o) => o.id_sender === obj.id_receiver)
			) {
				newArray.push({ ...obj });
			}
		});

		const Item = ({ item }) => (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					this.props.navigation.navigate("Chat", { id: item.id_receiver });
				}}
			>
				<Image source={logoMsg} style={styles.logo} />
				<View style={styles.msgCont}>
					<Text style={styles.from}>{item.name}</Text>
					<Text style={styles.msg}>{item.message}</Text>
				</View>
				<Text style={styles.date}>
					{moment(item.created_date).format("DD-MM-YYYY")}
				</Text>
			</TouchableOpacity>
		);
		const renderItem = ({ item }) => <Item item={item} />;

		return (
			<View style={styles.container}>
				<Text
					style={{
						color: "#000",
						paddingTop: 40,
						paddingBottom: 20,
						textAlign: "center",
						fontSize: 22,
					}}
				>
					MESSAGE CENTER
				</Text>
				{(newArray && newArray.length > 0) ? (
					<FlatList
						data={newArray}
						style={{ marginTop: 0 }}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				) : (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ color: "#FFF", fontSize: 18, paddingTop: 30 }}>
							No Messages Found
						</Text>
					</View>
				)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#e4e4e4",
	},
	item: {
		padding: 10,
		backgroundColor: "#98989c",
		marginVertical: 5,
		flexDirection: "row",
		alignItems: "center",
	},
	logo: {
		marginRight: 10,
		width: 50,
		height: 50,
	},
	from: {
		color: "#FFF",
		marginBottom: 5,
	},
	msg: {
		color: "#FFF",
		fontSize: 11,
	},
	date: {
		color: "#FFF",
	},
	msgCont: {
		paddingVertical: 10,
		flex: 1,
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
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageCenter);
