'use strict';

var React = require('react-native');
var {
  ScrollView,
  StyleSheet,
  View,Text,
} = React;

var BpTitle = require('./component/Title');

var BpPage = React.createClass({

  propTypes: {
    keyboardShouldPersistTaps: React.PropTypes.bool,
    noScroll: React.PropTypes.bool,
    noSpacer: React.PropTypes.bool,
  },

  render: function() {
    var ContentWrapper;
    var wrapperProps = {};
    if (this.props.noScroll) {
      ContentWrapper = (View: ReactClass<any, any, any>);
    } else {
      ContentWrapper = (ScrollView: ReactClass<any, any, any>);
      wrapperProps.automaticallyAdjustContentInsets = !this.props.title;
      wrapperProps.keyboardShouldPersistTaps = true;
      wrapperProps.keyboardDismissMode = 'interactive';
    }
    var title = this.props.title ?
      <BpTitle title={this.props.title} navigator={this.props.navigator} /> :
      null;
    var spacer = this.props.noSpacer ? null : <View style={styles.spacer} />;
    return (
      <View style={styles.container}>
        {title}
        <ContentWrapper
          style={styles.wrapper}
          {...wrapperProps}>
            {this.props.children}
            {spacer}
        </ContentWrapper>
      </View>
    );
  },
});

var styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6faff',
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingTop: 10,
  },
});

module.exports = BpPage;
