/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
} = React;
var BpActivity = require('./Page/Activity');
var BpPage = require('./Page');

var BpNativeApp = React.createClass({
  render: function() {
    return ( <Navigator
      initialRoute={{name: 'My First Scene', index: 0}}
      renderScene={(route, navigator) =>
      <BpActivity
        name={route.name}
        onForward={() => {
          var nextIndex = route.index + 1;
          navigator.push({
            name: 'Scene ' + nextIndex,
            index: nextIndex,
          });
        }}
        onBack={() => {
          if (route.index > 0) {
            navigator.pop();
          }
        }}
      />
    }
    />
    );
  }
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});

AppRegistry.registerComponent('bpNativeApp', () => BpNativeApp);
