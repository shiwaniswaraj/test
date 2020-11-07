import React from "react";
import {
	KeyboardAvoidingView,
	StyleSheet,
	View,
	StatusBar,
	Image,
	Dimensions,
	ScrollView,
	FlatList,
	Platform,
	RefreshControl,
	ActivityIndicator,
	SafeAreaView,
	TouchableOpacity,
} from "react-native";
import Button from "@components/Button";
import Text from "@components/Text";
import Arrival from "@assets/images/arival.png";
import ArrivalDark from "@assets/images/arival-dark.png";
import Departure from "@assets/images/departure.png";
import DepartureDark from "@assets/images/departure-dark.png";
import { BottomSheet } from "react-native-btr";
import { Feather } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import iconFlight from "@assets/images/flight.png";
import flightDown from "@assets/images/flightDown.png";

import SearchInput from "@components/SearchBar";

import { connect } from "react-redux";
import {
	searchAirport,
	searchAirport2,
	getDealPrice,
} from "../../redux/action/flight";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Slider } from "react-native-elements";
import { requestPermissionsAsync } from "expo-notifications";

export class SearchFlight extends React.Component {
	state = {
		visible: false,
		search: "",
		visibleCal: false,
		key: 0,
		selectedAirPort: [{ key: 0 }],
	};

	addReturn = () => {
		const { selectedAirPort } = this.state;
		var returning;
		selectedAirPort.forEach((e) => {
			if (e.isreturning) {
				returning = true;
			} else {
				if (!e.departureData && !e.arrivalData) {
					returning = true;
				}
			}
		});
		if (returning) {
			return;
		}
		var c = selectedAirPort;
		var returningTicket = [...selectedAirPort];
		c.forEach((e) => {
			var temp = {
				departureData: e.arrivalData,
				arrivalData: e.departureData,
				key: e.key + 1,
				pax: e.pax,
				// time: e.time,
				time: "",
				// date: e.date,
				date: "",
				isreturning: true,
			};
			returningTicket.push(temp);

			// return e;
		});
		// c.push(returningTicket);

		console.log(c);
		this.setState(
			{
				selectedAirPort: returningTicket,
			},
			() => {
				console.log(JSON.stringify(this.state.selectedAirPort));
			}
		);
	};
	toggleOverlay = (mode, key) => {
		const { visible, selectedAirPort } = this.state;

		this.setState({
			visible: !visible,
			mode,
			search: "",
			key: key ? key : 0,
		});

		// if(this.state.departureData && this.state.arrivalData){

		this.setState({
			selectedAirPort: selectedAirPort.map((e) => {
				if (e.key == this.state.key) {
					if (e.departureData && e.arrivalData) {
						e.time = Date.now();
						e.pax = 1;
					}
				}
				return e;
			}),
			time: Date.now(),
			pax: 1,
		});
		// }
	};
	toggleOverlayCal = async (key) => {
		const {
			showCal,
			selectedAirPort,
			departureData,
			arrivalData,
			time,
		} = this.state;

		if (
			!selectedAirPort[key].departureData ||
			!selectedAirPort[key].arrivalData
		) {
			return;
		}

		this.setState({
			showPax: false,
			showTime: false,
			showCal: !showCal,
			key: key ? key : 0,
		});

		if (!showCal) {
			this.setState({
				issearching: true,
				shows: false,
			});
			await this.props.getDealPrice(
				departureData.icao,
				arrivalData.icao,
				moment(time).format("HH:mm")
			);
			this.setState({
				issearching: false,
				shows: true,
			});
		}
	};

	// handleTextChange = (id,value) => this.setState({ [id]:value });
	handleTextChange = async (id, value) => {
		this.setState(
			{
				[id]: value,
			},
			async () => {}
		);
		if (value.length > 2) {
			//await this.props.searchAirport(value, 1, 10);
			await this.props.searchAirport2(value);
		}

		//console.log(this.props.airport_list);
	};

	refresh = () => {
		this.setState({ refreshing: true, items: [] });
		setTimeout(() => this.setState({ refreshing: false }), 1000);
	};

	selectAirport = (item) => {
		const { mode, selectedAirPort, key } = this.state;
		if (mode == "departure") {
			this.setState(
				{
					selectedAirPort: selectedAirPort.map((e) => {
						if (e.key == key) {
							e.departureData = item;
						}
						return e;
					}),
					departureData: item,
				},
				() => {
					this.toggleOverlay(key);
				}
			);
		}
		if (mode == "arrival") {
			this.setState(
				{
					selectedAirPort: selectedAirPort.map((e) => {
						if (e.key == key) {
							e.arrivalData = item;
						}
						return e;
					}),
					arrivalData: item,
				},
				() => {
					this.toggleOverlay(key);
				}
			);
		}
	};

	dateSelect = (date, price) => {
		const { key, selectedAirPort } = this.state;
		this.setState(
			{
				date,
				price,
				selectedAirPort: selectedAirPort.map((e) => {
					if (e.key == key) {
						(e.date = date), (e.price = price);
					}
					return e;
				}),
			},
			() => {
				this.toggleOverlayCal();
			}
		);
	};

	onChangeDate = (date, selectedDate) => {
		// console.log(selectedDate);
		const { selectedAirPort, key } = this.state;

		this.setState({
			showCal: false,
			date: selectedDate,
			selectedAirPort: selectedAirPort.map((e) => {
				if (e.key == key) {
					e.date = selectedDate;
				}
				return e;
			}),
		});
	};

	onChangeTime = (time) => {
		// console.log(time.nativeEvent.timestamp);
		const { key, selectedAirPort } = this.state;
		this.setState({
			showTime: false,
			time: time.nativeEvent.timestamp,
			selectedAirPort: selectedAirPort.map((e) => {
				if (e.key == key) {
					e.time = time.nativeEvent.timestamp;
				}
				return e;
			}),
		});
	};

	onChangePax = (val) => {
		// console.log(time.nativeEvent.timestamp);
		const { key, selectedAirPort } = this.state;
		this.setState({
			selectedAirPort: selectedAirPort.map((e) => {
				if (e.key == key) {
					e.pax = val;
				}
				return e;
			}),
		});
	};

	searchData = () => {
		// console.log()
		const {
			departureData,
			time,
			date,
			arrivalData,
			price,
			selectedAirPort,
		} = this.state;
		// console.log(arrivalData)
		// console.log(departureData)
		var data = {
			segments: [],
		};
		var retEnd = true;
		for (var i = 0; i < selectedAirPort.length; i++) {
			if (
				!selectedAirPort[i].departureData ||
				!selectedAirPort[i].arrivalData ||
				!selectedAirPort[i].date ||
				!selectedAirPort[i].time ||
				!selectedAirPort[i].pax
			) {
				return (retEnd = false);
			}
		}

		selectedAirPort.forEach((e) => {
			data.segments.push({
				startAirport: {
					icao: e.departureData.icao,
					id: e.departureData.id,
					name: e.departureData.name,
					longitute: e.departureData.longitute,
					latitude: e.departureData.latitude,
				},
				endAirport: {
					icao: e.arrivalData.icao,
					id: e.arrivalData.id,
					name: e.arrivalData.name,
					longitute: e.arrivalData.longitute,
					latitude: e.arrivalData.latitude,
				},
				dateTime: {
					date: moment(e.date).format("YYYY-MM-DD"),
					time: moment(e.time).format("HH:mm"),
					departure: true,
					local: true,
				},
				paxCount: e.pax,
				paxSegment: true,
				price: "100",
				outputCurrencies: ["USD"]
			});
		});

		this.props.navigation.navigate("Deals", {
			title: "Search Result",
			data: JSON.stringify(data),
		});
	};
	showTime = (key) => {
		const { selectedAirPort, showTime } = this.state;
		var retEnd = true;

		if (
			!selectedAirPort[key].departureData ||
			!selectedAirPort[key].arrivalData
		) {
			return;
		}

		this.setState({
			showCal: false,
			showPax: false,
			showTime: !showTime,

			key: key ? key : 0,
		});
	};

	showPax = (key) => {
		const { showPax, selectedAirPort } = this.state;

		var retEnd = true;

		if (
			!selectedAirPort[key].departureData ||
			!selectedAirPort[key].arrivalData
		) {
			return;
		}

		this.setState({
			key: key ? key : 0,
			showPax: !showPax,
			showCal: false,
			showTime: false,
		});
	};
	addLeg = () => {
		const { selectedAirPort, key } = this.state;
		var c = selectedAirPort;
		c.push({ key: c.length });

		this.setState({
			selectedAirPort: c,
			key: key + 1,
		});
	};

	clear = () => {
		const { selectedAirPort } = this.state;
		var c = selectedAirPort;
		if (c.length <= 1) {
			return;
		}
		c.pop();
		console.log(c);
		this.setState({
			selectedAirPort: c,
			key: c.length - 1,
		});
	};

	render() {
		const {
			visible,
			mode,
			departureData,
			arrivalData,
			date,
			time,
			pax,
		} = this.state;

		const Item = ({ item }) => (
			<Button
				normal
				onPress={() => {
					this.selectAirport(item);
				}}
				style={styles.item}
			>
				<View style={styles.itemLeft}>
					<Text style={styles.itmText}>
						{item.name},{item.city}
					</Text>
					<Text style={styles.itmHead}>{item.icao}</Text>
				</View>
				{/* <Image source={{ uri: item.country[0].flag }} style={styles.flag} /> */}
				<Image source={{ uri: item.flag }} style={styles.flag} />
			</Button>
		);
		const renderItem = ({ item }) => (
			<Item
				onStartShouldSetResponder={() => {
					this.selectAirport(item);
				}}
				item={item}
			/>
		);
		const { selectedAirPort, key } = this.state;

		let mydiableStyle = false;
		for (var i = 0; i < selectedAirPort.length; i++) {
			if (
				!selectedAirPort[i].departureData ||
				!selectedAirPort[i].arrivalData ||
				!selectedAirPort[i].date ||
				!selectedAirPort[i].time ||
				!selectedAirPort[i].pax
			) {
				mydiableStyle = true;
			}
		}

		return (
			<SafeAreaView
				style={[styles.container, { marginTop: StatusBar.currentHeight }]}
			>
				<View style={styles.mainBox}>
					<ScrollView
						contentContainerStyle={[
							this.state.selectedAirPort.length <= 1 && {
								flex: 1,
								justifyContent: "center",
							},
						]}
					>
						{this.state.selectedAirPort.map((e, i) => {
							return (
								<View key={i}>
									<View style={styles.boxInner}>
										<Button
											normal
											onPress={() => {
												this.toggleOverlay("departure", e.key);
											}}
											style={[styles.fbox, e.departureData && styles.newbox]}
										>
											<Text
												style={[
													styles.colortxt,
													e.departureData && { color: "#000" },
												]}
											>
												{e.departureData ? e.departureData.icao : "Departure"}
											</Text>
											<Image source={e.departureData ? DepartureDark : Departure} style={styles.sideIcon} />
											<Text
												style={[
													styles.neTxt,
													e.departureData && { color: "#000" },
												]}
											>
												{e.departureData
													? e.departureData.name
													: "TAP TO \nSELECT\nAIRPORT"}
											</Text>
											{e.departureData && (
												<Text
													style={[
														styles.neTxt,
														{ color: "#FFF" },
														e.departureData && { color: "#000" },
													]}
												>
													{e.departureData.city}
												</Text>
											)}
											{e.departureData && (
												<Text
													style={[
														styles.neTxt,
														{ color: "#FFF" },
														e.departureData && { color: "#000" },
													]}
												>
													{e.departureData.country}
												</Text>
											)}
										</Button>
										<Button
											normal
											onPress={() => {
												this.toggleOverlay("arrival", e.key);
											}}
											style={[styles.fbox, e.arrivalData && styles.newbox]}
										>
											<Text
												style={[
													styles.colortxt,
													e.arrivalData && { color: "#000" },
												]}
											>
												{e.arrivalData ? e.arrivalData.icao : "Arrival"}
											</Text>
											<Image source={e.arrivalData ? ArrivalDark : Arrival} style={styles.sideIcon} />
											<Text
												style={[
													styles.neTxt,
													e.arrivalData && { color: "#000" },
												]}
											>
												{e.arrivalData
													? e.arrivalData.name
													: "TAP TO\nSELECT\nAIRPORT"}
											</Text>
											{e.arrivalData && (
												<Text
													style={[
														styles.neTxt,
														{ color: "#FFF" },
														e.arrivalData && { color: "#000" },
													]}
												>
													{e.arrivalData.city}
													{/* {e.arrivalData
														? e.arrivalData.city
														: "TAP TO\nSELECT\nAIRPORT"} */}
												</Text>
											)}
											{e.arrivalData && (
												<Text
													style={[
														styles.neTxt,
														{ color: "#FFF" },
														e.arrivalData && { color: "#000" },
													]}
												>
													{e.arrivalData.country}
													{/* {e.arrivalData
														? e.arrivalData.country
														: "TAP TO\nSELECT\nAIRPORT"} */}
												</Text>
											)}
										</Button>
									</View>

									<View style={styles.boxInner}>
										<View
											style={[
												styles.fbox,
												styles.fboxIcon,
												e.date && { backgroundColor: "#FFF" },
											]}
											onStartShouldSetResponder={() => {
												this.toggleOverlayCal(e.key);
											}}
										>
											<View style={styles.iconHolder}>
												<Octicons
													name="calendar"
													size={24}
													color={e.date ? "black" : "white"}
												/>
												<Text
													style={[styles.iconText, e.date && { color: "#000" }]}
												>
													{e.date ? moment(e.date).format("MMM Do YY") : "DATE"}
												</Text>
											</View>
										</View>
										<View
											onStartShouldSetResponder={() => {
												this.showTime(e.key);
											}}
											style={[
												styles.fbox,
												styles.fboxIcon,
												e.time && { backgroundColor: "#FFF" },
											]}
										>
											<View style={styles.iconHolder}>
												<Feather
													name="clock"
													size={24}
													color={e.time ? "black" : "white"}
												/>
												<Text
													style={[styles.iconText, e.time && { color: "#000" }]}
												>
													{e.time ? moment(e.time).format("h:mm a") : "TIME"}
												</Text>
											</View>
										</View>
										<View
											onStartShouldSetResponder={() => {
												this.showPax(e.key);
											}}
											style={[
												styles.fbox,
												styles.fboxIcon,
												e.pax && { backgroundColor: "#FFF" },
											]}
										>
											<View style={styles.iconHolder}>
												<SimpleLineIcons
													name="printer"
													size={24}
													color={e.pax ? "black" : "white"}
												/>
												<Text
													style={[styles.iconText, e.pax && { color: "#000" }]}
												>
													{e.pax ? e.pax : "PAX"}
												</Text>
											</View>
										</View>
									</View>

									{this.state.showPax && this.state.key == e.key && (
										<View
											style={{ paddingHorizontal: 40, paddingVertical: 20 }}
										>
											<Slider
												maximumValue={15}
												minimumValue={1}
												step={1}
												trackStyle={{ height: 20, backgroundColor: "#FFF" }}
												thumbStyle={{
													height: 30,
													width: 30,
													backgroundColor: "#FFF",
												}}
												value={e.pax}
												maximumTrackTintColor="red"
												minimumTrackTintColor="#FFF"
												onValueChange={(val) => {
													this.onChangePax(val);
												}}
											/>
											<Text style={{ alignSelf: "center", color: "#FFF" }}>
												PAX: {e.pax}
											</Text>
										</View>
									)}
								</View>
							);
						})}
						<View style={styles.boxInner}>
							<View style={[styles.fbox, styles.fboxIcon]}>
								<View style={[styles.icontwo, styles.iconHolder]}>
									<TouchableOpacity
										onPress={this.addReturn}
										style={{ flex: 1, alignItems: "center" }}
									>
										<Text style={styles.iconText}>
											Return{" "}
											<FontAwesome
												style={styles.inconNew}
												name="undo"
												size={14}
												color="white"
											/>
										</Text>
									</TouchableOpacity>
									{/* <View
									onStartShouldSetResponder={() => {
										this.addLeg();
									}}
									style={{ flex: 1, alignItems: "center" }}
								>
									<Text style={styles.iconText}>
										Add Leg{" "}
										<AntDesign
											style={styles.inconNew}
											name="plus"
											size={14}
											color="white"
										/>
									</Text>
								</View> */}
									<TouchableOpacity
										onPress={() => {
											this.clear();
										}}
										style={{ flex: 1, alignItems: "center" }}
									>
										<Text style={styles.iconText}>
											Clear{" "}
											<AntDesign
												name="close"
												style={styles.inconNew}
												size={14}
												color="white"
											/>
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</ScrollView>
				</View>

				<View style={[styles.botButton]}>
					<Button
						color={mydiableStyle ? "#DDD" : "red"}
						onPress={() => {
							this.searchData();
						}}
						title="SEARCH AIRCRAFT"
					/>
				</View>

				{this.state.showTime && (
					<DateTimePicker
						testID="dateTimePicker"
						value={new Date()}
						mode="time"
						is24Hour={true}
						textColor="white"
						display="default"
						onChange={this.onChangeTime}
					/>
				)}
				{this.state.showCal && (
					<DateTimePicker
						testID="dateTimePicker2"
						value={this.state.date ? new Date(this.state.date) : new Date()}
						textColor="white"
						mode="date"
						display="default"
						minimumDate={new Date()}
						onChange={this.onChangeDate}
					/>
				)}
				<BottomSheet
					visible={visible}
					//setting the visibility state of the bottom shee
					onBackButtonPress={this.toggleOverlay}
					//Toggling the visibility state on the click of the back botton
					onBackdropPress={this.toggleOverlay}
					//Toggling the visibility state on the clicking out side of the sheet
				>
					<KeyboardAvoidingView
						behavior={Platform.OS == "ios" ? "padding" : "height"}
						style={styles.botnav}
					>
						<TouchableOpacity
							onPress={this.toggleOverlay}
							style={{
								padding: 10,
								alignSelf: "flex-end",
								zIndex: 99999,
								paddingBottom: 0,
							}}
						>
							<AntDesign
								name="close"
								style={styles.inconNew}
								size={25}
								color="white"
							/>
						</TouchableOpacity>

						{mode == "departure" && (
							<SearchInput
								label="Search Departure"
								value={this.state.search}
								icon={iconFlight}
								//editable={!this.props.isSearching}
								editable={true}
								onChangeText={(val) => {
									this.handleTextChange("search", val);
								}}
							/>
						)}

						{mode == "arrival" && (
							<SearchInput
								label="Search Arrival"
								icon={flightDown}
								//editable={!this.props.isSearching}
								editable={true}
								value={this.state.search}
								onChangeText={(val) => {
									this.handleTextChange("search", val);
								}}
							/>
						)}

						{this.props.isSearching && (
							<ActivityIndicator
								style={{ marginTop: 20 }}
								size="large"
								color="#FFF"
							/>
						)}
						<FlatList
							data={this.props.airport_list ? this.props.airport_list : []}
							style={{ marginTop: 20, zIndex: 99 }}
							renderItem={renderItem}
							/* refreshControl={
									<RefreshControl
										refreshing={this.state.refresh}
										title="Test"
									/>
								} */
							keyExtractor={(item) => item.id}
						/>
					</KeyboardAvoidingView>
				</BottomSheet>

				{/* <BottomSheet
          visible={this.state.showCal}
          //setting the visibility state of the bottom shee
          onBackButtonPress={this.toggleOverlayCal}
          //Toggling the visibility state on the click of the back botton
          onBackdropPress={this.toggleOverlayCal}
          //Toggling the visibility state on the clicking out side of the sheet
        >
            
            <View style={[styles.botnav,{padding:0}]}>
            <TouchableOpacity onPress={this.toggleOverlayCal} style={{padding:10,alignSelf:'flex-end',zIndex:99999,}}>
                        <AntDesign name="close"  style={styles.inconNew} size={25} color="white" />
                    </TouchableOpacity>

            <View style={[styles.flightBox,{backgroundColor:'#FFF'}]}>
    <View style={styles.flightTextBox}>
            {
                this.state.selectedAirPort.map((e)=>{
                    return e.key==this.state.key? <Text style={{flex:1}}>{this.state.selectedAirPort  && (e["departureData"]?e["departureData"]["city"]:'')}</Text>:<Text></Text>
                })
            }
             {
                this.state.selectedAirPort.map((e)=>{
                    return e.key==this.state.key? <Text >{this.state.selectedAirPort  && (e["arrivalData"]?e["arrivalData"]["city"]:'')}</Text>:<Text></Text>
                })
            } 

    </View>
      <Image style={styles.returnImg} source={returnImg}/>
      <View style={styles.flightboxImg}>
      <Image style={styles.flightImgBox} source={leftFlightBox}/>
      <Image style={styles.flightImgBox} source={rightFlightBox}/>
    </View>
    </View>
        {
            this.state.issearching && 
            <ActivityIndicator size="large" color="#FFF" style={{marginTop:50}}/>
          }
          {
              this.state.shows && 
              <BasicUsageDemo price_cal={this.props.price_cal} toggleOverlayCal={this.dateSelect}/>
              }

            </View>

        </BottomSheet> */}
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#3d3d3d",
	},
	mainBox: {
		flex: 1,
		justifyContent: "center",
	},
	boxInner: {
		flexDirection: "row",
	},
	fbox: {
		flex: 1,
		backgroundColor: "#DDD",
		padding: 10,
		margin: 1,
		borderRadius: 5,
		backgroundColor: "#8B8B8B",
	},
	botButton: {
		padding: 20,
		flexDirection: "row",
	},
	colortxt: {
		color: "#FFF",
		fontSize: 19,
		fontWeight: "700",
		textTransform: "uppercase",
		marginBottom: 5,
	},
	sideIcon: {
		position: "absolute",
		right: 5,
		width: 35,
		top: 5,
		height: 35,
	},
	smImg: {
		fontSize: 12,
		marginTop: 10,
		marginBottom: 10,
		width: 60,
		color: "#FFF",
		lineHeight: 17,
	},
	botnav: {
		backgroundColor: "#3d3d3d",
		width: "100%",
		height: Dimensions.get("window").height - 20,
		padding: 10,
	},
	fboxIcon: {
		alignItems: "center",
		justifyContent: "center",
	},
	iconMy: {
		width: 21,
		height: 21,
	},
	iconText: {
		color: "#FFF",
		paddingVertical: 5,
		alignItems: "center",
		justifyContent: "center",
	},
	iconHolder: {
		alignItems: "center",
	},
	icontwo: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	inconNew: {},
	item: {
		flexDirection: "row",
		alignItems: "center",
		zIndex: 99,
	},
	itemLeft: {
		flex: 1,
		padding: 10,
	},
	itmText: {
		fontSize: 11,
		color: "#FFF",
		marginBottom: 2,
	},
	itmHead: {
		fontSize: 21,
		color: "#FFF",
	},
	flag: {
		width: 40,
		height: 40,
	},

	barBottom: {
		backgroundColor: "#AF9A63",
		padding: 10,
		alignItems: "center",
	},
	returnImg: {
		width: 62,
		height: 32,
		alignSelf: "center",
		marginTop: -16,
	},
	flightBox: {
		padding: 10,
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
	newbox: {
		backgroundColor: "#FFF",
	},
	neTxt: {
		fontSize: 10,
		marginTop: 2,
		color: "#FFF",
		marginBottom: 0,
		width: 100,
		fontWeight: "500",
	},
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		airport_list: state.flight.airport_list,
		isSearching: state.flight.isSearching,
		price_cal: state.flight.price_cal,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		searchAirport: (filter, pgNo, perPage) =>
			dispatch(searchAirport(filter, pgNo, perPage)),
		searchAirport2: (search) => dispatch(searchAirport2(search)),
		getDealPrice: (startposition, endposition, time) =>
			dispatch(getDealPrice(startposition, endposition, time)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchFlight);
