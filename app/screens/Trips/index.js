import React from "react";
import { StyleSheet, View, Image, FlatList } from "react-native";
import Text from "@components/Text";
import { connect } from "react-redux";
import { getTrip } from "../../redux/action/flight";
import moment from "moment";
import NoTrips from "../../../assets/images/no-travelling.png";

export class Trips extends React.Component {
	state = {};

	async componentDidMount() {
		this._unsubscribe = this.props.navigation.addListener("focus", async () => {
			if (!this.props.data) {
				this.props.navigation.navigate("Login");
				return;
			}
			await this.props.getTrip(this.props.data.id);
		});
		if (!this.props.data) {
			return;
		}
		await this.props.getTrip(this.props.data.id);
	}

	componentWillUnmount() {
		this._unsubscribe();
	}

	render() {
		const Item = ({ item }) => (
			<View style={styles.item}>
				{item.routedetails.map((e, indx) => {
					return (
						<View key={indx} style={styles.half}>
							<View style={styles.box}>
								<Text style={{ color: "#FFF", marginBottom: 10 }}>
									DEPARTURE
								</Text>
								<Text style={{ color: "red", fontSize: 22, marginBottom: 10 }}>
									{e.startposition}
								</Text>
								<Text style={{ color: "#FFF", fontSize: 11, marginBottom: 10 }}>
									DATE: {moment(e.datetime).format("MMM Do YY")} TIME:{" "}
									{moment(e.datetime).format("HH:mm")}{" "}
								</Text>
							</View>
							<View style={styles.line} />

							<View style={styles.box}>
								<Text style={{ color: "#FFF", marginBottom: 10 }}>ARRIVAL</Text>
								<Text style={{ color: "red", fontSize: 22, marginBottom: 10 }}>
									{e.endposition}
								</Text>
								<Text style={{ color: "#FFF", fontSize: 11, marginBottom: 10 }}>
									DATE: {moment(e.datetime).format("MMM Do YY")} TIME:{" "}
									{moment(e.datetime).format("HH:mm")}{" "}
								</Text>
							</View>
						</View>
					);
				})}

				<View>
					<Text style={{ color: "#000", marginTop: 10 }}>
						Booking : #{item.bookingnumber}
					</Text>
				</View>
			</View>
		);
		const renderItem = ({ item }) => <Item item={item} />;

		return (
			<View style={styles.container}>
				<Text
					style={{
						color: "#FFF",
						paddingTop: 40,
						paddingBottom: 20,
						textAlign: "center",
						fontSize: 22,
					}}
				>
					TRIPS
				</Text>
				{this.props.trips && this.props.trips.length > 0 ? (
					<FlatList
						data={this.props.trips}
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
						<Image source={NoTrips} style={{ height: 200, width: 200 }} />
						<Text style={{ color: "#FFF", fontSize: 18, paddingTop: 30 }}>
							No Trips Found
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
		backgroundColor: "#3d3d3d",
	},
	item: {
		padding: 10,
		backgroundColor: "#8B8B8B",
		marginVertical: 5,
		flexDirection: "column",
		alignItems: "center",
		borderRadius: 10,
	},
	half: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
	box: {
		padding: 10,
		alignItems: "center",
	},
	line: {
		width: 2,
		height: 100,
		backgroundColor: "#FFF",
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		trips: state.flight.trips,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getTrip: (id) => dispatch(getTrip(id)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Trips);
