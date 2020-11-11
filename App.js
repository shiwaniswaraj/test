import { AppLoading } from "expo";
import { useFonts } from 'expo-font';
import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Provider } from 'react-redux';
import store from './app/redux/';
import Application from './index'
import { Root } from "native-base";

export default function App() {
  
  let [fontsLoaded] = useFonts({
    "Helvetica-Neue": require("./assets/fonts/HelveticaNeue.ttf"),
    'Roboto': require('native-base/Fonts/Roboto.ttf'),
    'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
	});
	
	return (
		<Root>
		<Provider  store={store}>
		<View style={styles.container}>
			{Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
			<Application/>
		 </View>
		 </Provider>
		 </Root>
	);
  /* if (!fontsLoaded) {
    return (
      <AppLoading/>
    );
  } else {
    return (
      <Root>
      <Provider  store={store}>
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="light-content" />}
        <Application/>
       </View>
       </Provider>
       </Root>
    );
  } */
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
