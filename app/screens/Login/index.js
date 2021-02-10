import React from "react";
import { StyleSheet, View, Image, TouchableOpacity,SafeAreaView } from "react-native";
import backgroundLogin from "@assets/images/backgroundlogin.jpg";
import logo from "@assets/images/logo.png";
import Button from "@components/Button";
import Text from "@components/Text";
import Link from "@components/Link";
import { connect } from "react-redux";
import { changeData } from "../../redux/action/auth";
import AsyncStorage from "@react-native-community/async-storage";

import AppIntroSlider from 'react-native-app-intro-slider';

import intro4 from "../../../assets/images/intro4.png";


const slides = [
	{
	  key: 1,
	  title: 'Flying private has never been easier',
	  text: "Whether it's your first time or you're a private aviation aficionado, EMCJET makes it easy to access the options that you need",
	  image: require('../../../assets/images/intro1.png'),
	  backgroundColor: '#FFF',
	},
	{
		key: 2,
		title: 'Book the whole plane or just the seats you need',
		text: "EMCJETS offers multiple ways to buy including private charter, individual seats on private jet and flexible options in between.",
		image: require('../../../assets/images/intro2.png'),

		backgroundColor: '#FFF',
	  },
	  {
		key: 3,
		title: "The power of choice in your hands",
		text: "Choose where, when and how you want to fly and EMCJET take care of the rest. See prices on existing options or create the one that's right for you.",
		image: require('../../../assets/images/intro3.png'),

		backgroundColor: '#FFF',
	  }
	  
		 
  ];
  
class Login extends React.Component {

	constructor(props){
		super(props);
		this.state={
			showRealApp:false,
			currindex:0
		}
			this.slider = React.createRef();

	}

	async componentDidMount() {
		const unsubscribe = this.props.navigation.addListener("focus", () => {

			if (this.props.isLoggedin) {
				this.props.navigation.navigate("Home");
				return;
			}
    });
    
    const data = await this.getData("data");

		if (data) {
			await this.props.changeData(data);
    }

		if (this.props.isLoggedin) {
			this.props.navigation.navigate("Home");
			return;
		}
	}
	getData = async (storage_Key) => {
		const value = await AsyncStorage.getItem(storage_Key);
		if (storage_Key == "data") {
			return value ? JSON.parse(value) : null;
		}
		return value ? true : false;
	};
	_renderItem = ({ item }) => {
		return (
			<SafeAreaView style={{flex:1,padding:20,paddingVertical:50}}>
		  <View style={styles.slide}>
			<Text style={styles.title}>{item.title}</Text>
			<Text style={styles.text}>{item.text}</Text>
		
			<TouchableOpacity
			style={{
				flex: 1,
				backgroundColor: "#B49A5A",
				width:'100%',
				padding:25,
				borderRadius:10,
				justifyContent:"center",
				alignItems:"center",
				marginTop:7,
				shadowOpacity: 0.5,
				shadowRadius: 10,
				shadowOffset: {
					height: 5,
					width: 5
				},
				elevation: 5,
				marginBottom:7,
			}}
			onPress={() => {
				if(this.state.currindex<slides.length-1){
					this.setState({
						currindex:this.state.currindex+1
					},()=>{
					this.slider.current.goToSlide(this.state.currindex)
					})
				}else{
					this._onDone();
				}
			}}
			>
				<Text> {this.state.currindex==2?"DONE":"NEXT"}  </Text>
		 </TouchableOpacity>




		  </View>
		  <Image resizeMode="contain" style={styles.imagebg} source={item.image}/>
		  </SafeAreaView>
		);
	  }
	  _onDone = () => {
		// User finished the introduction. Show real app through
		// navigation or simply by controlling state
		this.setState({ showRealApp: true });
	  }
	  onSlideChange=(ind,lasind)=>{
		console.log(ind);
		this.setState({
			currindex:ind
		})
	  }

	 
	
		
	render() {
		const { navigation } = this.props;
		const { route } = this.props;
		// const { from} = route.params;

		if (!this.state.showRealApp) {
			
			return <AppIntroSlider 
			showNextButton={false}
			ref={this.slider} 
			onSlideChange={this.onSlideChange}
			showDoneButton={false}
			renderItem={this._renderItem} data={slides} onDone={this._onDone}/>;
		  }
	  
		return (
			<View style={styles.container}>

			 
			 
				 
				 
		  <Image resizeMode="contain" style={styles.imagebg} source={intro4}/>
			 
				 	<View style={styles.btnBase}>
					<Button
						onPress={() => {
							navigation.navigate("Register");
						}}
						filled
						title="CREATE ACCOUNT"
					/>
					{!route.params && (
						<Button
							onPress={() => {
								navigation.navigate("LoginForm");
							}}
							title="LOGIN"
						/>
					)}
					{route.params && route.params.from && (
						<Button
							onPress={() => {
								navigation.navigate("LoginForm", {
									from: route.params.from,
									...route.params,
								});
							}}
							title="LOGIN"
						/>
					)}

					<Text style={[styles.textCommon, { marginTop: 10 }]}>
						EMCJET is an Indirect Air Carrier and does not own, maintain, or
						operate aircraft.{" "}
					</Text>
					<View style={[ {flexDirection: "row", justifyContent: "center", alignItems: "center"}]}>
						<Text style={styles.textCommon}>
							The{" "}
						</Text>
						<TouchableOpacity
								onPress={() => {
									this.props.navigation.navigate("WebView", {
										title: "Terms of Use",
										uri: "https://app.emcjet.com/cmspage/terms.php",
									});
								}}
							>
								<Text style={{ color: "#B49A5A" }}>Terms of Use</Text>
						</TouchableOpacity>
						<Text style={styles.textCommon}>
							{` and `}
						</Text>
						<TouchableOpacity
							onPress={() => {
								this.props.navigation.navigate("WebView", {
									title: "Privacy Policy",
									uri: "https://app.emcjet.com/cmspage/privacy.php",
								});
							}}
						>
							<Text style={{ color: "#B49A5A" }}>Privacy Policy</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFF",
	},
	logo: {
		width: 185,
		height: 43,
		alignSelf: "center",
	},
	logoContainer: {
		position: "absolute",
		top: 60,
		zIndex: 9,
		alignSelf: "center",
	},
	skip: {
		position: "absolute",
		right: 30,
		top: 40,
		zIndex: 10,
		color: "#FFF",
	},
	btnBase: {
		position: "absolute",
		alignSelf: "center",
		top:'25%',
		
		zIndex: 9,
		padding: 10,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",
	},
	textCommon: {
		padding: 5,
		color: "#000",
		textAlign: "center",
	},
	nextBtn:{
		padding:15,
		textAlign:'center',
		backgroundColor:'#b49a5a'
	},
	slide:{
		width:'100%',
		
	},
	text:{
		marginBottom:20,
		marginTop:10
	},
	title:{
		fontSize:18
	},
	imagebg:{
		position:'absolute',
		bottom:-50,
		right:0,
		maxWidth:250
	}
});

const mapStateToProps = (state) => {
	return {
		data: state.auth.data,
		isLoggedin: state.auth.isLoggedin,
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		//doLogin: (em, pass) => dispatch(LoginAction(em, pass)),
		changeData: (data) => dispatch(changeData(data)),
	};
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);
