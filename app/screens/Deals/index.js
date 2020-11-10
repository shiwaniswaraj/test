import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	FlatList,
	Platform,
	SafeAreaView,
	ActivityIndicator,
} from "react-native";
import Input from "@components/Input";
import Button from "@components/Button";
import Text from "@components/Text";
import banner from "@assets/images/banner.png";
import pin from "@assets/images/pin.png";
import iconPlane from "@assets/images/iconPlane.png";
import iconCalendar from "@assets/images/iconCalendar.png";
import arrowAngle from "@assets/images/arrowAngle.png";
import chair from "@assets/images/chair.png";
import { TouchableOpacity } from "react-native-gesture-handler";
import { connect } from "react-redux";
import { searchFlight } from "../../redux/action/flight";
import NoImage from "../../../assets/images/image-not-found.jpg";

export class Deals extends React.Component {
	state = {};
	async componentDidMount() {
		const { route } = this.props;
		const { data } = route.params;

		this.unsubscribe = this.props.navigation.addListener("focus", async () => {
			await this.props.searchFlight(data);
		});
		this.setState({
			data,
			endAirport: JSON.parse(data).segments[0].endAirport,
			startAirport: JSON.parse(data).segments[0].startAirport,
			date: JSON.parse(data).segments[0].dateTime.date,
		});

		// console.log(JSON.parse(data).segments[0].endAirport)
	}

	componentDidUpdate() {
		console.log("state = ", this.props.flightLoading);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const { data, endAirport, startAirport, time, date, price } = this.state;
		const Item = ({ item }) => (
			<TouchableOpacity
				style={styles.item}
				onPress={() => {
					this.props.navigation.navigate("DealsInner", {
						title: item.startPosition.city,
						id: item.lift.id,
						item: item,
						data,
						to: endAirport,
						from: startAirport,
						date,
						flighttimes: item.flighttimes,
					});
				}}
			>
				{item.lift.photo.image ? (
					<Image
						source={{ uri: item.lift.photo.image }}
						style={styles.banner}
					/>
				) : (
					<Image source={NoImage} style={styles.banner} />
				)}

				<View style={styles.whiteBottom}>
					<View style={styles.whiteBottomInner}>
						<Image style={styles.pin} source={pin} />
						<Text style={{ flex: 1, flexWrap: "wrap" }}>
							{item.startPosition.city}
						</Text>
						<Image style={styles.pin} source={iconPlane} />
						<Text>{item.lift.aircraftCategory}</Text>

						{/* <Image style={[styles.pin, styles.arrow]} source={arrowAngle} />
						<Image style={styles.pin} source={pin} />
						<Text style={{ flex: 1, flexWrap: "wrap" }}>
							{endAirport && endAirport.name}
						</Text> */}
					</View>
					{/* <View style={styles.whiteBottomInner}>
						<Image style={styles.pin} source={iconPlane} />
						<Text>{item.lift.aircraftCategory}</Text>
						<Text style={{ fontSize: 11, marginLeft: 30 }}>
							UP TO {item.lift.maxPax} SEATS
						</Text>
					</View> */}
					{/* {data &&
						JSON.parse(data).segments.map((e) => {
							return (
								<View style={styles.whiteBottomInner}>
									<View
										style={{
											flex: 1,
											flexDirection: "row",
											alignItems: "center",
										}}
									>
										<Image style={styles.pin} source={iconCalendar} />
										<Text>{e.dateTime.date}</Text>
									</View>
									<View style={{ marginTop: -13 }}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "flex-end",
												marginBottom: 3,
											}}
										>
											<Image
												source={chair}
												style={{ width: 15, height: 15, marginRight: 10 }}
												resizeMode="contain"
											/>
											<Text style={{ color: "red", textAlign: "right" }}>
												{e.paxCount}
											</Text>
										</View>
									</View>
								</View>
							);
						})} */}

					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							alignSelf: "flex-end",
						}}
					>
						{/* <Text style={{fontSize:11,marginRight:10}}>WHOLE AIRCRAFT</Text> */}
						<Text style={{ color: "red", fontSize: 24 }}>
							${item.sellerprice.price}/
							<Text style={{ fontSize: 16 }}>SEAT</Text>
						</Text>
					</View>
				</View>
			</TouchableOpacity>
		);
		const renderItem = ({ item }) => <Item item={item} />;
		const { aircraft_list } = this.props;
		return (
			<View style={styles.container}>
				{aircraft_list && aircraft_list.length <= 0 && (
					<View
						style={{
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Text style={{ color: "#FFF", fontSize: 18 }}>No Result Found</Text>
					</View>
				)}
				{this.props.flightLoading ? (
					<ActivityIndicator
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							top: 0,
							bottom: 0,
							alignItems: "center",
							justifyContent: "center",
						}}
						size="large"
						color="#fff"
						//animating={this.props.flightLoading}
						animating={true}
					/>
				) : (
					<SafeAreaView style={{ flex: 1 }}>
						<FlatList
							data={this.props.aircraft_list}
							renderItem={renderItem}
							keyExtractor={(item) => item.id}
						/>
					</SafeAreaView>
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
	btnBase: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 20,
	},
	barBottom: {
		backgroundColor: "#AF9A63",
		padding: 10,
		alignItems: "flex-start",
	},
	banner: {
		width: "100%",
		resizeMode: "cover",
		height: 250,
	},
	whiteBottom: {
		paddingHorizontal: 10,
		paddingBottom: 10,
		backgroundColor: "#FFF",
	},
	whiteBottomInner: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	pin: {
		width: 20,
		height: 20,
		resizeMode: "contain",
		marginRight: 10,
	},
	arrow: {
		marginLeft: 20,
		marginRight: 20,
	},
});

const mapStateToProps = (state) => {
	return {
		airport_list: state.flight.airport_list,
		aircraft_list: state.flight.aircraft_list,
		flightLoading: state.flight.flightLoading,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		searchFlight: (data) => dispatch(searchFlight(data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Deals);
