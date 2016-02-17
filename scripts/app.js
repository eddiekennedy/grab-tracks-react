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
	generatePlayerURL: function() {

	},
	render: function() {
		return (
			<li className="track">
				<div className="track-artwork">
					<img src={this.props.data.artwork_url} />
				</div>
				<div className="track-info">
					<h3>
						<span className="track-title">
							{this.props.data.title}
						</span>
						<span className="artist-name">
							<a href="#">{this.props.data.user.username}</a>
						</span>
					</h3>
				</div>
				<div className="player">
					<iframe width="100%" height="166" scrolling="no" src={"http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + this.props.data.id + "&auto_play=false&show_artwork=false&&show_comments=false&show_playcount=false&buying=false"} frameBorder="0" ></iframe>
				</div>
			</li>
		)
	}
});

// Render the ReactDOM
ReactDOM.render(
  <GrabTracks url={ app.apiEndpoint() } />,
  document.getElementById('app')
);

