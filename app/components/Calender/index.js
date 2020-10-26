import React, { Component } from "react";
import  {DraggableCalendar} from '../react-native-draggable-calendar';
import  {View,TouchableOpacity,Text,StyleSheet} from 'react-native';

export default class BasicUsageDemo extends Component {

    constructor(props) {
      super(props);
    }
  
    onGetTime = () => {
      // you can get the selected time.
      // console.log('onGetTime: ', this._calendar.getSelection());
    };
  
    onSelectionChange = (newSelection) => {
      // when selected time changes, this func will be called.
      // console.log('onSelectionChange', newSelection);
    };

    _genStyles() {
        return {
          style: styles.draggableContainer,
          headerTextStyle: styles.dayText,
          monthHeaderTextStyle: styles.dayText,
          dayTextStyle: styles.dayText,
          selectedDayTextStyle: styles.selectedDayText,
          singleDayContainerStyle: styles.selectedDayContainer,
          beginDayContainerStyle: styles.selectedDayContainer,
          middleDayContainerStyle: styles.selectedDayContainer,
          endDayContainerStyle: styles.selectedDayContainer
        };
      }

      yourRenderDay=(data)=>{
        console.log("m",data);
        return (<Text>{new Date(data.date).toLocaleString()}</Text>)
      }
      
      yourRenderMonthHeader=(data)=>{
        console.log("month",data);
        return (<Text style={{fontSize:21,color:'#FFF'}}>{data}</Text>)
      }
      
  
    render() {
      return (
        <View style={{flex: 1}}>
          <DraggableCalendar
            ref={_ => this._calendar = _}
            {...this._genStyles()}
            onSelectionChange={this.onSelectionChange}
           {...this.props}
          />
         
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    draggableContainer: {
      backgroundColor: '#3d3d3d'
    },
    dayText: {
      color: '#FFF'
    },
    
    selectedDayText: {
      color: '#FFF'
    },
    selectedDayContainer: {
      backgroundColor: '#EAC351'
    }
  });
  