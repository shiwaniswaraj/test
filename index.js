import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import Navigation from "./navigation";
import Spinner from 'react-native-loading-spinner-overlay';
import {connect} from 'react-redux';



export   function Application(props) { 
    return (
    <View style={styles.container}>
        <Spinner
          visible={props.loading}
          textContent=""
          textStyle={styles.spinnerTextStyle}
        />
             <Navigation />
       </View>
    );
}
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});




const mapStateToProps=state=>{
    return{
        loading:state.flight.loading,
         
     }
  }
  const mapDispatchToProps = dispatch => {
    return{
      }
  }
  export default connect(mapStateToProps,mapDispatchToProps)(Application);
  