/**
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react-native');
var {
  Image,
  PixelRatio,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} = React;

var BpGroupCell = React.createClass({
  render: function() {
    var TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    return (
      <View>
        <TouchableElement
          onPress={this.props.onSelect}
          onShowUnderlay={this.props.onHighlight}
          onHideUnderlay={this.props.onUnhighlight}>
          <View style={styles.itemWrapper}>
            <View style={styles.row}>
              <Image style={styles.thumb} source={{uri: 'http:' +this.props.group.avatar}}/>
                <View style={styles.rightPane}>
                  <Text style={styles.userTitle}>{this.props.group.name}</Text>
                  <Text style={styles.lastActive}>{this.props.group.member_count}{ ' - ' }{this.props.group.last_active}</Text>
                  <Text>{this.props.group.description}</Text>
                </View>
             </View>
           </View>
        </TouchableElement>
      </View>
    );
  }
});

var styles = StyleSheet.create({
  itemWrapper: {
    backgroundColor: '#FFF',
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#a52a2a',
    padding: 10,
    margin: 5,
  },
  row : {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  thumb:{
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginRight: 10,
  },

  rightPane: {
    justifyContent: 'space-around',
    flexDirection: 'column',
    flex: 1,
  },
  userTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  lastActive:{
    fontSize: 12,
    color: 'grey',
  }
});

module.exports = BpGroupCell;
