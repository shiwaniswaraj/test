import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	FlatList,
	Dimensions,
	TouchableOpacity,
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
import clockBlack from "@assets/images/clockBlack.png";
import MapView from "react-native-maps";
import moment from "moment";
import Navigation from "../../../navigation";
import { connect } from "react-redux";
import { flightDetails, book } from "../../redux/action/flight";
import Carousel, { Pagination } from "react-native-snap-carousel"; // 3.6.0
import { AntDesign } from "@expo/vector-icons";
import {
	PagerTabIndicator,
	IndicatorViewPager,
	PagerTitleIndicator,
	PagerDotIndicator,
} from "@shankarmorwal/rn-viewpager";
import { BottomSheet } from "react-native-btr";
import { color } from "react-native-reanimated";
const SCREEN_WIDTH = Dimensions.get("window").width;

export class DealsInner extends React.Component {
	state = {
        visible: false,
        currentMap: "DEPARTURE"
	};
	componentDidMount() {
		const { route } = this.props;
		const { id, from, to, time, date, item, data, price } = route.params;
		this.setState({
			id,
			from,
			to,
			time,
			date,
			item,
			price,
			data: JSON.parse(data),
		});
		console.log(data);
		this.props.flightDetails(id);
		//this.toggle();
	}
	toggle = (mapType) => {
        console.log("maptype = ", mapType);
        this.setState({currentMap: mapType});
        this.setState({ visible: !this.state.visible });
    }

	componentDidUpdate() {
		console.log("details = ", this.props);
	}

	book = async () => {
		const { id, from, to, time, date, item, price } = this.state;
		const { route } = this.props;

		if (!this.props.data) {
			this.props.navigation.navigate("Login", {
				from: "DealsInner",
				...route.params,
			});
		}
		var data = {
			action: "addbooking",
			id_customer: this.props.data.id,
			aircraftid: this.props.aircarft_detail.id,
			sellercompany: this.props.aircarft_detail.sellerCompany.displayName,
			selleremail: this.props.aircarft_detail.sellerCompany.contactInfo
				.emails[0],
			sellerphone: this.props.aircarft_detail.sellerCompany.contactInfo.phone,
			selleraddress: this.props.aircarft_detail.sellerCompany.contactInfo
				.address,
			sellerpostcode: this.props.aircarft_detail.sellerCompany.contactInfo
				.detailedAddress.postCode,
			sellercity: this.props.aircarft_detail.sellerCompany.contactInfo
				.detailedAddress.city,
			sellercountry: this.props.aircarft_detail.sellerCompany.contactInfo
				.detailedAddress.country.name,
			aircraftcategory: this.props.aircarft_detail.lift.aircraftCategory,
			aircrafttype: this.props.aircarft_detail.lift.aircraftType,
			aircraftsupertype: this.props.aircarft_detail.lift.aircraftSuperType,
			yearofmake: this.props.aircarft_detail.lift.aircraftTailDetails
				.yearOfMake,
			routes: [],
		};

		this.state.data.segments.map((e) => {
			data.routes.push({
				startposition: e.startAirport.icao,
				endposition: e.endAirport.icao,
				amount: item.sellerprice.price,
				currency: item.sellerprice.currency,
				datetime: e.dateTime.date,
			});
		});

		await this.props.book(JSON.stringify(data));
		setTimeout(() => {
			this.props.navigation.navigate("Trips");
		}, 2000);
	};

	render() {
		const { aircarft_detail } = this.props;
		const { id, from, to, time, date, item, data } = this.state;

		const ItemCar = ({ item }) => (
			<Image source={{ uri: item.image }} style={styles.banner} />
		);

		const Item = ({ title }) => (
			<View style={styles.item}>
				<Carousel
					ref={(ref) => (this.carouselRef = ref)}
					data={title.lift.photos}
					renderItem={({ item }) => <ItemCar item={item} />}
					sliderWidth={SCREEN_WIDTH}
					itemWidth={SCREEN_WIDTH}
					slideStyle={{ width: SCREEN_WIDTH }}
					inactiveSlideOpacity={1}
					inactiveSlideScale={1}
				/>

				<View
					style={[
						styles.whiteBottom,
						{ borderBottomWidth: 1, borderBottomColor: "#000" },
					]}
				>
					{data.segments.map((e) => {
						return (
							<View style={styles.whiteBottomInner}>
								<Image style={styles.pin} source={pin} />
								<Text>{e.startAirport.icao}</Text>

								<Image style={[styles.pin, styles.arrow]} source={arrowAngle} />
								<Image style={styles.pin} source={pin} />
								<Text>{e.endAirport.icao}</Text>
							</View>
						);
					})}
					<View style={styles.whiteBottomInner}>
						<Image style={styles.pin} source={iconPlane} />
						<Text>{title.lift.aircraftCategory} </Text>
						<Text style={{ fontSize: 11, marginLeft: 30 }}>
							UP TO {item.lift.maxPax} SEATS
						</Text>
					</View>

					{data.segments.map((e) => {
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
									<Text>
										{e.dateTime.date} {e.dateTime.time}
									</Text>
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
										{item && (
											<Text style={{ color: "red", textAlign: "right" }}>
												{e.paxCount}
											</Text>
										)}
									</View>
									<View style={{ flexDirection: "row", alignItems: "center" }}>
										{item && (
											<Text style={{ color: "red" }}>
												{item.sellerprice.currency} {item.sellerprice.price}
											</Text>
										)}
									</View>
								</View>
							</View>
						);
					})}
				</View>

				<View
					style={[
						styles.whiteBottom,
						{ borderBottomWidth: 1, borderBottomColor: "#000" },
					]}
				>
					{data.segments.map((e) => {
						return (
							<View style={[styles.whiteBottomInner]}>
								<View style={styles.botwrap}>
									<View style={styles.lefbot}>
										<Text style={{ color: "red", fontSize: 19 }}>
											{e.startAirport.icao}
										</Text>
										<Text style={{ fontSize: 10 }}>{e.startAirport.name}</Text>
									</View>
									<Image source={iconPlane} style={styles.incoPLane} />
									<View style={styles.rightbot}>
										<Text style={{ color: "red", fontSize: 19 }}>
											{e.endAirport.icao}
										</Text>
										<Text style={{ fontSize: 10 }}>{e.endAirport.name}</Text>
									</View>
								</View>
							</View>
						);
					})}

					{data.segments.map((e) => {
						return (
							<View style={[styles.whiteBottomInner]}>
								<View style={styles.botwrap}>
									<View style={styles.lefbot}>
										<Text style={{ color: "red", fontSize: 19 }}>
											{e.dateTime.time}
										</Text>
										<Text style={{ fontSize: 10 }}>
											{moment(e.dateTime.date).format("MMM Do YY")}
										</Text>
									</View>
									<Image source={iconPlane} style={styles.incoPLane} />
									<View style={styles.rightbot}>
										<Text style={{ color: "red", fontSize: 19 }}>
											{e.dateTime.time}
										</Text>
										<Text style={{ fontSize: 10 }}>
											{moment(e.dateTime.date).format("MMM Do YY")}
										</Text>
									</View>
								</View>
							</View>
						);
					})}
				</View>

				{data.segments.map((e) => {
					return (
						<View
							style={[
								styles.whiteBottom,
								{
									borderBottomWidth: 1,
									borderBottomColor: "#000",
									flexDirection: "row",
									padding: 0,
									paddingVertical: 0,
								},
							]}
						>
                            {/* <TouchableOpacity onPress={(e) => this.toggle('DEPARTURE')}> */}
							<View
								style={[
									styles.whiteBottomInner,
									{
										flex: 1,
										flexDirection: "column",
										paddingVertical: 0,
										paddingBottom: 0,
										borderRightColor: "#000",
										borderRightWidth: 1,
									},
								]}
							>
								<View style={{ flexDirection: "row", padding: 10 }}>
									<Image style={styles.pin} source={pin} />
									<Text>DEPARTURE</Text>
								</View>
								<MapView
									initialRegion={{
										latitude: e.startAirport.latitude,
										longitude: e.startAirport.longitude,
										latitudeDelta: 0.0922,
										longitudeDelta: 0.0421,
									}}
									style={styles.mapStyle}
								/>
							</View>
                            {/* </TouchableOpacity>
                            <TouchableOpacity onPress={(e) => this.toggle('ARRIVAL')}> */}
							<View
								style={[
									styles.whiteBottomInner,
									{
										flex: 1,
										flexDirection: "column",
										paddingVertical: 0,
										paddingBottom: 0,
									},
								]}
							>
								<View style={{ flexDirection: "row", padding: 10 }}>
									<Image style={styles.pin} source={pin} />
									<Text>ARRIVAL</Text>
								</View>
								<MapView
									initialRegion={{
										latitude: e.endAirport.latitude,
										longitude: e.endAirport.longitude,
										latitudeDelta: 0.0922,
										longitudeDelta: 0.0421,
									}}
									style={styles.mapStyle}
								/>
							</View>
                            {/* </TouchableOpacity> */}
						</View>
					);
				})}

				{data.segments.map((e) => {
					return (
						<View
							style={[
								styles.whiteBottom,
								{ borderBottomWidth: 1, borderBottomColor: "#000" },
							]}
						>
							<View style={[styles.whiteBottomInner, { flexDirection: "row" }]}>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<Text style={{ textTransform: "uppercase" }}>
										seats selected
									</Text>
									<View style={{ flexDirection: "row", marginTop: 10 }}>
										<Image source={chair} style={styles.chair} />
										<Text style={{ color: "red" }}>{e.paxCount}</Text>
									</View>
								</View>
								<View
									style={{
										justifyContent: "center",
										alignItems: "center",
										flex: 1,
									}}
								>
									<Text style={{ textTransform: "uppercase" }}>
										FLIGHT TIME
									</Text>
									<View style={{ flexDirection: "row", marginTop: 10 }}>
										<Image source={clockBlack} style={styles.chair} />
										<Text style={{ color: "red" }}>{e.dateTime.time}</Text>
									</View>
								</View>
							</View>
						</View>
					);
				})}

				<View style={[styles.barBottom, { backgroundColor: "#000" }]}>
					<Text style={{ color: "#FFF", textAlign: "left" }}>
						AIRCRAFT DETAILS
					</Text>
				</View>
				<View style={[styles.whiteBottom]}>
					<View style={[styles.whiteBottomInner, { flexDirection: "column" }]}>
						<View style={styles.det}>
							<Text style={styles.dettl}>Model:</Text>
							<Text style={styles.dettr}>{title.lift.aircraftCategory}</Text>
						</View>
						<View style={styles.det}>
							<Text style={styles.dettl}>Class:</Text>
							<Text style={styles.dettr}>{title.lift.aircraftSuperType}</Text>
						</View>
						<View style={styles.det}>
							<Text style={styles.dettl}>Max. Passengers:</Text>
							<Text style={styles.dettr}>{item.lift.maxPax}</Text>
						</View>
						<View style={styles.det}>
							<Text style={styles.dettl}>Year of make:</Text>
							<Text style={styles.dettr}>
								{title.lift.aircraftTailDetails.yearOfMake}
							</Text>
						</View>
					</View>
					<View
						style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
					>
						<Button
							onPress={() => {
								this.book();
							}}
							title="BOOK NOW"
							filled
						/>
					</View>
				</View>
			</View>
		);
		const renderItem = ({ item }) => <Item title={item} />;

		return (
			<View style={styles.container}>
				{aircarft_detail && data && (
					<>
						<FlatList
							data={[this.props.aircarft_detail]}
							renderItem={renderItem}
							keyExtractor={(item) => item.id}
						/>
						<BottomSheet
							visible={this.state.visible}
							onBackButtonPress={this.toggle}
							onBackdropPress={this.toggle}
						>
							<View style={[styles.botnav, { padding: 0 }]}>
								<TouchableOpacity
									onPress={this.toggle}
									style={{ padding: 10, alignSelf: "flex-end", zIndex: 99999 }}
								>
									<AntDesign
										name="close"
										style={styles.inconNew}
										size={25}
										color="black"
									/>
								</TouchableOpacity>
							</View>
						</BottomSheet>
					</>
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
		padding: 20,
		paddingVertical: 10,
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
	botwrap: {
		flexDirection: "row",
		width: "100%",
	},
	lefbot: {
		flex: 1,
		alignItems: "flex-end",
		paddingHorizontal: 10,
	},
	rightbot: {
		flex: 1,
		paddingHorizontal: 10,
	},
	incoPLane: {
		width: 20,
		height: 20,
		paddingHorizontal: 10,
		resizeMode: "contain",
		transform: [{ rotateY: "45deg" }, { rotateZ: "45deg" }],
	},
	dettr: {
		color: "red",
	},
	dettl: {
		flex: 1,
	},
	det: {
		flex: 1,
		flexDirection: "row",
		paddingVertical: 5,
		width: "100%",
	},
	chair: {
		width: 20,
		height: 20,
		resizeMode: "contain",
		marginRight: 10,
	},
	mapStyle: {
		width: "100%",
		height: 150,
	},
	viewPager: {
		flex: 1,
		width: "100%",
		height: 200,
	},
	ww: {
		width: 10,
		height: 10,
		borderRadius: 10,
		marginHorizontal: 5,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	wwActive: {
		backgroundColor: "rgba(0, 0, 0, 1)",
	},
	botnav: {
		backgroundColor: "#ffffff",
		width: "100%",
		height: Dimensions.get("window").height - 40,
		padding: 20,
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		airport_list: state.flight.airport_list,
		aircarft_detail: state.flight.aircarft_detail,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		flightDetails: (id) => dispatch(flightDetails(id)),
		book: (data) => dispatch(book(data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(DealsInner);
