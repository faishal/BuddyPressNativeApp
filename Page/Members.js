/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var TimerMixin = require('react-timer-mixin');

var invariant = require('invariant');
var React = require('react-native');
var {
  ActivityIndicatorIOS,
  ListView,
  Platform,
  ProgressBarAndroid,
	ScrollView,
	AppRegistry,
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
} = React;
/** @todo move it to wp-config.json **/
// The URL for the `posts` endpoint provided by WP JSON API
var REQUEST_URL = 'http://localhost/wp-json/bp/v1/groups';
var BpPage = require('../Page');
var BpActivityCell = require('./ActivityCell');
var TimerMixin = require('react-timer-mixin');

var invariant = require('invariant');
var dismissKeyboard = require('dismissKeyboard');

// Results should be cached keyed by the query
// with values of null meaning "being fetched"
// and anything besides null and undefined
// as the result of a valid query
var resultsCache = {
	dataForQuery: {},
	nextPageNumberForQuery: {},
	totalForQuery: {},
};

var LOADING = {};

var BpMembers = React.createClass({
  mixins: [TimerMixin],

  timeoutID: (null: any),

	getInitialState: function() {
		return {
      isLoading: false,
      isLoadingTail: false,
      hasMore : false,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      filter: '',
      queryNumber: 0,
		};
	},
	// Automatically called by react when this component has finished mounting.
	componentDidMount: function() {
		this.fetchData();
	},
  _urlForQueryAndPage: function(query: string, pageNumber: number): string {
    return ( REQUEST_URL + '?page=' + pageNumber );
  },
	// This is where the magic happens! Fetches the data from our API and updates the application state.
	fetchData: function() {
    var query = 'public';
    this.timeoutID = null;

    this.setState({filter: query});
    var cachedResultsForQuery = resultsCache.dataForQuery[query];
    if (cachedResultsForQuery) {
      if (!LOADING[query]) {
        this.setState({
          dataSource: this.getDataSource(cachedResultsForQuery),
          isLoading: false
        });
      } else {
        this.setState({isLoading: true});
      }
      return;
    }

    LOADING[query] = true;
    resultsCache.dataForQuery[query] = null;
    this.setState({
      isLoading: true,
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: false,
    });

    fetch(this._urlForQueryAndPage(query, 1))
      .then((response) => response.json())
      .catch((error) => {
        LOADING[query] = false;
        resultsCache.dataForQuery[query] = undefined;

        this.setState({
          dataSource: this.getDataSource([]),
          isLoading: false,
        });
      })
      .then((responseData) => {
        LOADING[query] = false;

        resultsCache.totalForQuery[query] = responseData.activity.length;
        resultsCache.dataForQuery[query] = responseData.activity;
        resultsCache.nextPageNumberForQuery[query] = 2;

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          hasMore: responseData.has_more_items,
          isLoading: false,
          dataSource: this.getDataSource(responseData.activity),
        });
      })
      .done();
	},
  hasMore: function(): boolean {
    return this.state.hasMore;
  },
	makeItems: function(): Array<any> {
		var items = [];
		var dateItems = this.state.data ;
		var that = this;
		dateItems.activity.forEach(function( single_activity, index	) {
			items.push( that.makeSingleItem( single_activity, index ) );
		})

		return items;
	},
  onEndReached: function() {
    var query = this.state.filter;
    if (!this.hasMore() || this.state.isLoadingTail) {
      // We're already fetching or have all the elements so noop
      return;
    }


    if (LOADING[query]) {
      return;
    }
    if (this.state.isLoadingTail) {
           // We're already fetching
           return;
      }
    LOADING[query] = true;
    this.setState({
      queryNumber: this.state.queryNumber + 1,
      isLoadingTail: true,
    });
    var page = resultsCache.nextPageNumberForQuery[query];
    invariant(page != null, 'Next page number for "%s" is missing', query);
    fetch(this._urlForQueryAndPage(query, page))
      .then((response) => response.json())
      .catch((error) => {
        LOADING[query] = false;
        this.setState({
          isLoadingTail: false,
        });
      })
      .then((responseData) => {
        var moviesForQuery = resultsCache.dataForQuery[query].slice();

        LOADING[query] = false;
        // We reached the end of the list before the expected number of results
        if (!responseData.activity) {
          resultsCache.totalForQuery[query] = moviesForQuery.length;
        } else {
          for (var i in responseData.activity) {
            moviesForQuery.push(responseData.activity[i]);
          }
          resultsCache.dataForQuery[query] = moviesForQuery;
          resultsCache.nextPageNumberForQuery[query] += 1;
        }

        if (this.state.filter !== query) {
          // do not update state if the query is stale
          return;
        }

        this.setState({
          hasMore: responseData.has_more_items,
          isLoadingTail: false,
          dataSource: this.getDataSource(resultsCache.dataForQuery[query]),
        });
      })
      .done();
  },
  getDataSource: function(movies: Array<any>): ListView.DataSource {
    return this.state.dataSource.cloneWithRows(movies);
  },
  selectActivity: function(activity: Object) {
    if (Platform.OS === 'ios') {
      this.props.navigator.push({
        title: activity.title,
        component: MovieScreen,
        passProps: {movie},
      });
    } else {
      dismissKeyboard();
      this.props.navigator.push({
        title: movie.title,
        name: 'movie',
        movie: movie,
      });
    }
  },
  renderFooter: function() {
    if (!this.hasMore() || !this.state.isLoadingTail) {
      return <View style={styles.scrollSpinner} />;
    }
    if (Platform.OS === 'ios') {
      return <ActivityIndicatorIOS style={styles.scrollSpinner} />;
    } else {
      return (
        <View  style={{alignItems: 'center'}}>
          <ProgressBarAndroid styleAttr="Large"/>
        </View>
      );
    }
  },
  renderSeparator: function(
    sectionID: number | string,
    rowID: number | string,
    adjacentRowHighlighted: boolean
  ) {
    var style = styles.rowSeparator;
    if (adjacentRowHighlighted) {
        style = [style, styles.rowSeparatorHide];
    }
    return (
      <View key={'SEP_' + sectionID + '_' + rowID}  style={style}/>
    );
  },

	// the loading view template just shows the message "Thinking thoughts..."
	renderLoadingView: function() {
		return (
			<BpPage title={this.props.navigator ? null : 'Activity'}>
				<View style={styles.container}>
					<Text style={styles.loading}>Loading...</Text>
				</View>
			</BpPage>
		);
	},
  // the loading view template just shows the message "Thinking thoughts..."
	renderNoInternetView: function() {
		return (
			<BpPage title={this.props.navigator ? null : 'Activity'}>
				<View style={styles.container}>
					<Text style={styles.loading}>No Internet..</Text>
				</View>
			</BpPage>
		);
	},
	renderNoActivityView : function(){
		<BpPage title={this.props.navigator ? null : 'Activity'}>
			<View style={styles.container}>
				<Text>
					No Activity...
				</Text>
			</View>
		</BpPage>
	},

  renderRow: function(
    activity: Object,
    sectionID: number | string,
    rowID: number | string,
    highlightRowFunc: (sectionID: ?number | string, rowID: ?number | string) => void,
  ) {
    return (
      <BpActivityCell
        key={activity.id}
        onSelect={() => this.selectActivity(activity)}
        onHighlight={() => highlightRowFunc(sectionID, rowID)}
        onUnhighlight={() => highlightRowFunc(null, null)}
        activity={activity}
      />
    );
  },
	render: function() {
    var content = this.state.dataSource.getRowCount() === 0 ?
      <NoActivity
        filter={this.state.filter}
        isLoading={this.state.isLoading}
      /> :
      <ListView
        ref="listview"
        renderSeparator={this.renderSeparator}
        dataSource={this.state.dataSource}
        renderFooter={this.renderFooter}
        renderRow={this.renderRow}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={400}
        pageSize={10}
        automaticallyAdjustContentInsets={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps={true}
        showsVerticalScrollIndicator={false}
      />;

    return (
      <BpPage title={this.props.navigator ? null : 'Activity'}>
        <View style={styles.container}>
          <View style={styles.separator} />
          {content}
        </View>
      </BpPage>
    );
  }
});

var styles = StyleSheet.create({
	loading:{
		textAlign:'center',
		fontSize: 20,
		margin:20
	},
	verticalScrollView: {
		margin: 0,
	},
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
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centerText: {
    alignItems: 'center',
  },
  noMoviesText: {
    marginTop: 80,
    color: '#888888',
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});

var NoActivity = React.createClass({
  render: function() {
    var text = '';
    if (this.props.filter) {
      text = `No Activity`;
    } else if (!this.props.isLoading) {
      // If we're looking at the latest movies, aren't currently loading, and
      // still have no results, show a message
      text = 'No Activity found';
    }

    return (
      <View style={[styles.container, styles.centerText]}>
        <Text style={styles.noMoviesText}>{text}</Text>
      </View>
    );
  }
});


module.exports = BpMembers;
