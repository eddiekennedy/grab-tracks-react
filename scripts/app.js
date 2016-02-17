/**
 * Application Settings
 */
var app = {};
app.apiRoot = 'https://api.soundcloud.com';
app.clientId = 'f652822b93b6a6799336b4a729d50de8';
app.query = 'diplo';

app.apiEndpoint = function() {
	return [
		app.apiRoot,
		'/tracks.json',
		'?client_id=' + app.clientId,
		'&q=' + app.query,
		'&filter=downloadable',
		//"&duration[" + toOrFrom + "]=600000",
		'&limit=10',
		//"&offset=" + this.offset
	].join('');
};

/**
 * Grab Tracks
 */
var GrabTracks = React.createClass({
	loadTracksFromSoundCloud: function() {
		var request = new XMLHttpRequest();
		request.open('GET', this.props.url, true);

		// Success
		request.onload = function() {
			if ( request.status >= 200 && request.status < 400 ) {
				console.log("RESPONSE", JSON.parse( request.responseText ) );
				this.setState({ data: JSON.parse( request.responseText ) });
			} else {
				console.error('Server error. Status: ' + request.status);
			}
		}.bind(this);

		// Error
		request.onerror = function() {
			console.error('Connection error.');
		}.bind(this);

		request.send();
	},
	componentDidMount: function() {
		this.loadTracksFromSoundCloud();
	},
	getInitialState: function() {
		return { data: [] }
	},
	render: function() {
		return (
			<div className="grab-tracks">
				<h1>Grab Tracks</h1>
				<TrackList data={this.state.data} />
			</div>
		)
	}
});

/**
 * Track List
 */
var TrackList = React.createClass({
	render: function() {

    var trackNodes = this.props.data.map(function(track) {
      return (
        <Track key={track.id} data={track} />
      )
    });

		return (
			<ul className="track-list">
				{trackNodes}
			</ul>
		)
	}
});

/**
 * Single Track
 */
var Track = React.createClass({
	render: function() {
		return (
			<li className="track">
				{this.props.data.title}
			</li>
		)
	}
});

// Render the ReactDOM
ReactDOM.render(
  <GrabTracks url={ app.apiEndpoint() } />,
  document.getElementById('app')
);

