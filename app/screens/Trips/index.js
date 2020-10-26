import React, { useState } from "react";
import { StyleSheet,View,Image,FlatList} from "react-native";
import logoMsg from "@assets/images/logoMsg.png";
import Text from "@components/Text";
import {connect} from 'react-redux';
import {getTrip} from '../../redux/action/flight';
import moment from 'moment'
  
export   class Trips extends React.Component {
  state={
  }
  
async  componentDidMount(){
  const unsubscribe = this.props.navigation.addListener('focus', () => {
    if(!this.props.data){
      this.props.navigation.navigate("Login");
      return;
    }

  });
  if(!this.props.data){
    return;
  }
    await this.props.getTrip(this.props.data.id);
  }
  render(){
    console.log(this.props.trips)

    const Item = ({ item }) => (
      <View style={styles.item} >
        
        {
          item.routedetails.map((e)=>{
            return(
        <View style={styles.half}>
        <View style={styles.box}>
              <Text style={{color:'#FFF',marginBottom:10}}>DEPARTURE</Text>
              <Text style={{color:'red',fontSize:22,marginBottom:10}}>{e.startposition}</Text>
              <Text style={{color:'#FFF',fontSize:11,marginBottom:10}}>DATE: {moment(e.datetime).format("MMM Do YY")}   TIME: {moment(e.datetime).format("HH:mm")} </Text>
        </View>
        <View style={styles.line}/>
        
        <View style={styles.box}>
            <Text style={{color:'#FFF',marginBottom:10}}>ARRIVAL</Text>
              <Text style={{color:'red',fontSize:22,marginBottom:10}}>{e.endposition}</Text>
              <Text style={{color:'#FFF',fontSize:11,marginBottom:10}}>DATE: {moment(e.datetime).format("MMM Do YY")}   TIME: {moment(e.datetime).format("HH:mm")} </Text>
      
        </View>
        </View>)


})
}

        <View>
    <Text style={{color:'#000',marginTop:10}}>Booking : #{item.bookingnumber}</Text>
        </View>
        
      </View>
    );
  const renderItem = ({ item }) => (
      <Item item={item} />
    );

  return(<View style={styles.container}>
          <Text style={{color:'#FFF',padding:20,textAlign:'center',fontSize:22}}>TRIPS</Text>
          <FlatList
                data={this.props.trips}
                style={{marginTop:0}}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
  </View>
  )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3d3d3d"
  },  
  item:{
    padding:10,
    backgroundColor:'#8B8B8B',
    marginVertical:5,
    flexDirection:"column",
    alignItems:"center",
    borderRadius:10
  },
  half:{
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  box:{
    padding:10,
    alignItems:"center",
  },
  line:{
    width:2,
    height:100,
    backgroundColor:'#FFF'
  }
});



const mapStateToProps=state=>{
    return{
        data:state.auth.data, 
        trips:state.flight.trips, 
     }
  }
  const mapDispatchToProps = dispatch => {
    return{
       getTrip:(id)=>dispatch(getTrip(id))
      }
  }
  export default connect(mapStateToProps,mapDispatchToProps)(Trips);
  