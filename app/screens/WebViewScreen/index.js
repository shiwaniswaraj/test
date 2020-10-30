import React, { Component } from "react";
import { WebView } from "react-native-webview";
import { StatusBar } from "react-native";

export default class WebViewScreen extends Component {
	componentDidMount() {
		console.log("webview = ",this.props);
	}

	render() {
		return (
			<>
			<StatusBar barStyle={'light-content'} />
			<WebView
        source={{ uri: this.props.route.params.uri }}
      />
			</>
		);
	}
}
