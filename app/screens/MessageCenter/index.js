import React, { useState } from "react";
import { StyleSheet,View,Image,FlatList} from "react-native";
import logoMsg from "@assets/images/logoMsg.png";
import Text from "@components/Text";
import {connect} from 'react-redux';
import {Getmessagebycustomerid} from '../../redux/action/auth';
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from 'moment';

const DATA = [
  {
        id: 1,
        title: 'XO TEAM',
      },
      {
        id: 2,
        title: 'NEW TEAM',
      },
      {
        id: 3,
        title: 'JHON DOE',
      },
    ];
  
export   class MessageCenter extends React.Component {
  state={
  }
  
  async componentDidMount(){
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      // if()
      if(!this.props.data){
        this.props.navigation.navigate("Login");
        return;
      }

    });
    if(!this.props.data){
      return;
    }

    const {id}=this.props.data;
    
    await this.props.getChat(id);
  }
  
  render(){
    const newArray = [];
    this.props.msg.forEach(obj => {
      if (!newArray.some(o => o.id_sender === obj.id_sender) && !newArray.some(o => o.id_sender === obj.id_receiver)) {
        newArray.push({ ...obj })
      }
 
    });

    const Item = ({item }) => (
      <TouchableOpacity style={styles.item} onPress={()=>{this.props.navigation.navigate('Chat',{id:item.id_receiver})}}>
        <Image source={logoMsg} style={styles.logo}/>
        <View style={styles.msgCont}>
    <Text style={styles.from}>{item.id_sender}</Text>
          <Text style={styles.msg}>{item.message}</Text>
        </View>
    <Text style={styles.date}>{moment(item.created_date).format('DD do YYYY')}</Text>
    
      </TouchableOpacity>
    );
  const renderItem = ({ item }) => (
      <Item item={item} />
    );

  return(<View style={styles.container}>
          <Text style={{color:'#FFF',padding:20,textAlign:'center',fontSize:22}}>MESSAGE CENTER</Text>
          <FlatList
                data={newArray}
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
    flexDirection:"row",
    alignItems:"center"
  },
  logo:{
    marginRight:10,
    width:50,
    height:50
  },
  from:{
    color:'#FFF',
    marginBottom:5
  },
  msg:{
    color:'#FFF',
    fontSize:11
  },
  date:{
    color:'#FFF'
  },
  msgCont:{
    paddingVertical:10,
    flex:1
  }
});



const mapStateToProps=state=>{
  return{
      msg:state.auth.msg ,
      data:state.auth.data ,
      
     }
}
const mapDispatchToProps = dispatch => {
  return{
     getChat:(id)=>dispatch(Getmessagebycustomerid(id)),
      
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MessageCenter);