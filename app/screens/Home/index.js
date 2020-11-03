import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Image,
	FlatList,
	Dimensions,
	ActivityIndicator,
	SegmentedControlIOS,
	Linking,
} from "react-native";
import Text from "@components/Text";
import plane from "@assets/images/plane.png";
import logo from "@assets/images/logo-text.png";
import phone from "@assets/images/phone.png";
import returnImg from "@assets/images/returnImg.png";
import leftFlightBox from "@assets/images/leftFlightBox.png";
import rightFlightBox from "@assets/images/rightFlightBox.png";
import homeSlide from "@assets/images/homeSlide.png";
import { AntDesign } from "@expo/vector-icons";

import HomeSearch from "@components/HomeSearch";
import { connect } from "react-redux";
import {
	getDealHome,
	getDealPrice,
	resetAircraft,
} from "../../redux/action/flight";

import Carousel, { Pagination } from "react-native-snap-carousel"; // 3.6.0

import moment from "moment";

import { BottomSheet } from "react-native-btr";

import BasicUsageDemo from "@components/Calender";

const SCREEN_WIDTH = Dimensions.get("window").width;

export class Home extends React.Component {
	state = {
		activeTab: 0,
	};
	componentDidMount() {
		this.props.getDealHome();
	}

	selectDate = async (item, fromico, toico, time, from, to) => {
		await this.setState(
			{
				fromico,
				time,
				toico,
				from,
				to,
				item,
				id: item.id,
			},
			() => {
				this.toggleOverlayCal();
			}
		);
	};
	searchData = async () => {
		this.setState({
			issearching: true,
		});
		const { fromico, time, toico, price, from, to, item, date } = this.state;
		var data = {
			segments: [],
		};
		data.segments.push({
			startAirport: {
				icao: fromico,
				id: item.fromairportid,
				name: from,
				longitude: item.fromlongitude,
				latitude: item.fromlatitude,
			},
			endAirport: {
				icao: toico,
				id: item.toairportid,
				name: to,
				longitude: item.tolatitude,
				latitude: item.tolatitude,
			},
			dateTime: {
				//date: moment(Date.now()).format("YYYY-MM-DD"),
				date: moment(date).format("YYYY-MM-DD"),
				time: time,
				departure: true,
				local: true,
			},
			paxCount: "1",
			paxSegment: true,
			price: price,
		});
		//console.log(JSON.stringify(data));
		await this.props.resetAircraft();
		this.setState({
			issearching: false,
		});
		this.props.navigation.navigate("Deals", {
			title: "Search Result",
			to: from,
			from: to,
			time,
			//date: moment(Date.now()).format("YYYY-MM-DD"),
			date: moment(date).format("YYYY-MM-DD"),
			price: price,
			data: JSON.stringify(data),
		});
	};

	toggleOverlayCal = async () => {
		const { showCal, fromico, time, toico, id } = this.state;
		this.setState({
			showCal: !showCal,
		});
		console.log("show cal = ", showCal);
		if (!showCal) {
			this.setState({
				issearching: true,
				shows: false,
			});
			await this.props.getDealPrice(fromico, toico, time, id);
			this.setState({
				issearching: false,
				shows: true,
			});
		}

		return showCal;
	};

	dateSelect = (date, price) => {
		console.log("date select", date, price);
		this.setState(
			{
				date,
				price,
			},
			async () => {
				await this.toggleOverlayCal();
				this.searchData();
				/* setTimeout(() => {
				}, 1000); */
			}
		);
	};

	sliderAction = async (item) => {
		console.log("slider action =", item);
		let data = {
			segments: [],
		};
		data.segments.push({
			startAirport: {
				icao: item.fromicao,
			},
			endAirport: {
				icao: item.toicao,
			},
			dateTime: {
				date: moment(item.date).format("YYYY-MM-DD"),
				time: item.time,
				departure: true,
				local: true,
			},
			paxCount: "1",
			paxSegment: true,
			price: item.price,
		});
		await this.props.resetAircraft();
		this.props.navigation.navigate("Deals", {
			title: "Search Result",
			to: item.from,
			from: item.to,
			date: moment(item.date).format("YYYY-MM-DD"),
			price: item.price,
			data: JSON.stringify(data),
		});
	};

	render() {
		const { navigation } = this.props;

		const Item = ({ item }) => (
			<TouchableOpacity
				style={styles.flightBox}
				onPress={() => {
					this.selectDate(
						item,
						item.fromicao,
						item.toicao,
						item.time,
						item.from,
						item.to
					);
				}}
			>
				<View style={styles.flightTextBox}>
					<Text>{item.from}</Text>
					<Text>{item.to}</Text>
				</View>
				<Image style={styles.returnImg} source={returnImg} />
				<View style={styles.flightboxImg}>
					<Image style={styles.flightImgBox} source={{ uri: item.fromimage }} />
					<Image style={styles.flightImgBox} source={{ uri: item.toimage }} />
				</View>
			</TouchableOpacity>
		);
		const renderItem = ({ item }) => <Item item={item} />;

		const ItemCar = ({ item }) => {
			return (
				<View
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "center",
						paddingTop: 50,
					}}
				>
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<Text style={styles.smText}>
							{new Date(item.date).toDateString()}
						</Text>
						<View style={styles.mainBot}>
							<Text style={styles.headingText}>{item.from}</Text>
							<Image style={styles.planeImage} source={plane} />
							<Text style={styles.headingText}>{item.to}</Text>
						</View>
						<TouchableOpacity
							style={styles.button}
							onPress={() => this.sliderAction(item)}
						>
							<View style={styles.btnPrice}>
								<Text>${item.price}/SEAT</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
			);
		};

		return (
			<View style={styles.container}>
				<View style={styles.main}>
					<Image source={homeSlide} style={styles.image} />

					<View style={styles.header}>
						<Image
							source={logo}
							style={{ width: 50, height: 30 }}
							resizeMode="contain"
						/>
						<TouchableOpacity
							style={{zIndex: 99}}
							onPress={() => {
								Linking.openURL(`tel:+1123456789`);
							}}
						>
							<Image source={phone} style={{ width: 30, height: 30 }} />
						</TouchableOpacity>
					</View>

					{this.props.homedeal && (
						<Carousel
							ref={(ref) => (this.carouselRef = ref)}
							data={this.props.homedeal.slider}
							renderItem={({ item }) => <ItemCar item={item} />}
							onSnapToItem={(i) => this.setState({ activeTab: i })}
							sliderWidth={SCREEN_WIDTH}
							itemWidth={SCREEN_WIDTH}
							slideStyle={{ width: SCREEN_WIDTH }}
							inactiveSlideOpacity={1}
							inactiveSlideScale={1}
						/>
					)}
					<View style={{ flexDirection: "row" }}>
						{this.props.homedeal &&
							this.props.homedeal.slider.map((e, i) => {
								return (
									<View
										key={i}
										style={[
											styles.ww,
											this.state.activeTab == i && styles.wwActive,
										]}
									></View>
								);
							})}
					</View>

					{/* <View style={{width:'100%'}}>
      <View>
      <Text  style={{color:'#FFF',textAlign:'right'}} >All Deals</Text>
      </View>
      <HomeSearch/>
   
    </View> */}
				</View>

				{/* <View style={styles.barBottom}>
        <Text style={{color:"#FFF"}}>$1,695/SEAT</Text>
      </View>
   */}
				{this.props.homedeal && (
					<FlatList
						data={this.props.homedeal.deals}
						style={{ backgroundColor: "#3d3d3d" }}
						renderItem={renderItem}
						keyExtractor={(item) => item.id}
					/>
				)}

				<BottomSheet
					visible={this.state.showCal}
					//setting the visibility state of the bottom shee
					onBackButtonPress={this.toggleOverlayCal}
					//Toggling the visibility state on the click of the back botton
					onBackdropPress={this.toggleOverlayCal}
					//Toggling the visibility state on the clicking out side of the sheet
				>
					<View style={[styles.botnav, { padding: 0 }]}>
						<TouchableOpacity
							onPress={this.toggleOverlayCal}
							style={{ padding: 10, alignSelf: "flex-end", zIndex: 99999 }}
						>
							<AntDesign
								name="close"
								style={styles.inconNew}
								size={25}
								color="white"
							/>
						</TouchableOpacity>

						<View style={[styles.flightBox, { backgroundColor: "#FFF" }]}>
							<View style={styles.flightTextBox}>
								<Text>{this.state.from}</Text>
								<Text>{this.state.to}</Text>
							</View>
							<Image style={styles.returnImg} source={returnImg} />
							<View style={styles.flightboxImg}>
								<Image
									style={styles.flightImgBox}
									source={{
										uri: this.state.item ? this.state.item.fromimage : "",
									}}
								/>
								<Image
									style={styles.flightImgBox}
									source={{
										uri: this.state.item ? this.state.item.toimage : "",
									}}
								/>
							</View>
						</View>
						{this.state.issearching && (
							<ActivityIndicator
								size="large"
								color="#FFF"
								style={{ marginTop: 50 }}
							/>
						)}
						{this.state.shows && (
							<BasicUsageDemo
								price_cal={this.props.price_cal}
								toggleOverlayCal={this.dateSelect}
							/>
						)}
					</View>
				</BottomSheet>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
	},
	header: {
		position: "absolute",
		top: 20,
		padding: 10,
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
	},

	planeImage: {
		width: 20,
		height: 20,
		marginHorizontal: 10,
	},
	main: {
		backgroundColor: "#000",
		padding: 10,
		height: 300,
		alignItems: "center",
		justifyContent: "center",
	},
	smText: {
		color: "#FFF",
	},
	image: {
		flex: 1,
		resizeMode: "cover",
		justifyContent: "center",
		position: "absolute",
		width: "60%",
		height: "100%",
		right: 0,
		zIndex: -1,
	},
	botnav: {
		backgroundColor: "#3d3d3d",
		width: "100%",
		height: Dimensions.get("window").height - 20,
		padding: 20,
	},
	mainBot: {
		flexDirection: "row",
		marginVertical: 10,
		alignItems: "center",
	},
	headingText: {
		color: "#FFF",
		fontSize: 20,
	},
	btnPrice: {
		padding: 10,
		paddingHorizontal: 20,
		backgroundColor: "#FFF",
		borderRadius: 30,
	},
	barBottom: {
		backgroundColor: "#AF9A63",
		padding: 10,
		alignItems: "center",
	},
	returnImg: {
		width: 38,
		height: 25,
		alignSelf: "center",
		marginTop: -14,
		borderRadius: 10,
	},
	flightBox: {
		paddingHorizontal: 10,
		marginVertical: 1,
		marginHorizontal: 2,
		backgroundColor: "#fff",
		borderRadius: 5,
	},
	flightImgBox: {
		width: 134,
		height: 34,
	},
	flightboxImg: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	flightTextBox: {
		flexDirection: "row",
		justifyContent: "space-between",
		borderBottomWidth: 1,
		borderBottomColor: "#D8343B",
		padding: 10,
	},
	ww: {
		width: 10,
		height: 10,
		borderRadius: 10,
		marginHorizontal: 5,
		backgroundColor: "rgba(255, 255, 255, 0.5)",
	},
	wwActive: {
		backgroundColor: "rgba(255, 255, 255, 1)",
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		homedeal: state.flight.homedeal,
		price_cal: state.flight.price_cal,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		getDealHome: () => dispatch(getDealHome()),
		resetAircraft: () => dispatch(resetAircraft()),
		getDealPrice: (startposition, endposition, time, id) =>
			dispatch(getDealPrice(startposition, endposition, time, id)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);
