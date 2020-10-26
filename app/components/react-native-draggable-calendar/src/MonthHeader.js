import React, {PureComponent} from 'react';

import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export class MonthHeader extends PureComponent {
  render() {
    const {identifier, monthHeaderTextStyle, renderMonthHeader} = this.props;
    const [year, month] = identifier.split('-');
    var monthList= ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
    return (
      <View>
        {renderMonthHeader ?
          renderMonthHeader(identifier) :
          <Text style={[styles.monthHeaderText, monthHeaderTextStyle]}>
            {` ${monthList[parseInt(month-1)]} ${parseInt(year)}`}
          </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  monthHeaderText: {
    marginLeft: 10,
    marginVertical: 15,
    fontSize: 18,
    color: '#333'
  }
});