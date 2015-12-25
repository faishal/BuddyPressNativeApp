/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Navigator,
} = React;
var BpNativeApp = React.createClass({
  renderScene: function(route, nav) {
    switch (route.id.toString().toLowerCase()) {
      case 'activity':
        var BpActivity = require('./Page/Activity');
        return <BpActivity navigator={nav} />;
      case 'members':
        var BpMembers = require('./Page/Members');
        return <BpMembers navigator={nav} />;
      case 'groups':
          var BpGroups = require('./Page/Groups');
          return <BpGroups navigator={nav} />;
      default:
        return (
          <View>
          </View>
        );
    }
  },
  render: function() {
    return (
      <Navigator
        initialRoute={ { id: 'activity' } }
        renderScene= { this.renderScene }
      />
    );
  }
});
AppRegistry.registerComponent('bpNativeApp', () => BpNativeApp);
