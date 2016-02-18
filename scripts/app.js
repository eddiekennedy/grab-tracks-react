/**
 * Application Settings
 */
var app = {};
app.apiRoot = 'https://api.soundcloud.com';
app.clientId = 'f652822b93b6a6799336b4a729d50de8';

app.APIEndpoint = function( query ) {
  return [
    app.apiRoot,
    '/tracks.json',
    '?client_id=' + app.clientId,
    '&q=' + query.query,
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
  loadTracksFromSoundCloud: function(query) {
    var request = new XMLHttpRequest();
    request.open('GET', app.APIEndpoint( query ), true);

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
  handleQuerySubmit: function(query) {
    this.loadTracksFromSoundCloud(query);
  },
  getInitialState: function() {
    return { data: [] }
  },
  render: function() {
    return (
      <div className="grab-tracks">
        <h1>Grab Tracks</h1>
        <SearchForm onQuerySubmit={this.handleQuerySubmit} />
        <TrackList data={this.state.data} />
        <Pagination />
      </div>
    )
  }
});

/**
 * Search Form
 */
 var SearchForm = React.createClass({
  getInitialState: function() {
    return { query: '' };
  },
  handleQueryChange: function(event) {
    this.setState({ query: event.target.value });
  },
  handleSubmit: function(event) {
    event.preventDefault();
    var query = this.state.query.trim();
    if ( !query ) {
      return;
    }
    this.props.onQuerySubmit({ query: query });
  },
  render: function() {
    return (
      <form className="search-form" onSubmit={this.handleSubmit}>
        <input 
          type="text"
          placeholder="Search"
          value={this.state.query}
          onChange={this.handleQueryChange}
        />
        <input type="submit" value="Post" />
      </form>
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
        <div className="player">
          <iframe 
            width="100%"
            height="166"
            scrolling="no"
            src={"http://w.soundcloud.com/player/?url=http%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F" + this.props.data.id + "&auto_play=false"} 
            frameBorder="0" >
          </iframe>
        </div>
      </li>
    )
  }
});

/**
 * Pagination
 */
var Pagination = React.createClass({
  getInitialState: function() {
    return { offset: 0 }
  },
  render: function() {
    return (
      <div className="pagination">
        <a href="#" className="paginaton-next">More Results</a>
      </div>
    )
  }

});

// Render the ReactDOM
ReactDOM.render(
  <GrabTracks />,
  document.getElementById('app')
);

