'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} = React;
class TitleNavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#1d3256"
        onPress={this.props.onPress}>
        <Text style={styles.icon}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var BpTitle = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.string,
    tabs: React.PropTypes.array
  },
  tabs:['activity','members','groups'],
  selectedTabIcons: [],
  unselectedTabIcons: [],
  getInitialState: function() {
    var activeTab  = (this.props.title) ? this.props.title.toString().toLowerCase() :'activity';
    return {
      activeTab: activeTab,
    };
  },
  renderTabOption(name, page) {

    var style = [];
    if( this.state.activeTab === name ){
      style = styles.active;
    }
    return this.renderItem(name, page, style);
  },

  renderItem : function(name, page, style){
    return (
      <View style={style} key={name + page}>
        <TitleNavButton
          onPress={() => {
            this.props.navigator.push({
              id: name,
            });
          }
        }
          text={name.toUpperCase()}
        />
      </View>
    );
  },

  render: function() {
      var items = [];
      var that = this;
      this.tabs.forEach(function(tab, i){
        items.push( that.renderTabOption(tab, i) );
      });

    return (
      <View style={styles.title}>
        {items}
      </View>
    );
  }
});


var styles = StyleSheet.create({
  title :{
    backgroundColor: '#1d3256',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon :{
    padding: 20,
    paddingBottom: 20,
    color: '#f6faff',
    flexDirection: 'column',
  },
  active:{
    borderBottomWidth: 5,
    borderColor: '#f6faff',
  }
});

module.exports = BpTitle;
