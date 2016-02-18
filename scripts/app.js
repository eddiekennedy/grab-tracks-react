/**
 * Grab Tracks
 */
var GrabTracks = React.createClass({

  clientId: 'f652822b93b6a6799336b4a729d50de8',
  apiRoot: 'https://api.soundcloud.com',

  apiEndpoint: function() {
    return [
      this.apiRoot,
      '/tracks.json',
      '?client_id=' + this.clientId,
      '&q=' + this.state.query,
      '&filter=downloadable',
      //"&duration[" + toOrFrom + "]=600000",
      '&limit=10',
      '&offset=' + this.state.offset
    ].join('');
  },
  loadTracksFromSoundCloud: function() {
    var request = new XMLHttpRequest();
    request.open('GET', this.apiEndpoint(), true);

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
  handleQuerySubmit: function( query ) {
    this.setState({ query: query.query, offset: 0 }, function() {
      this.loadTracksFromSoundCloud();
    });
  },
  handlePaginate( offset ) {
    this.setState({ offset: offset.offset }, function() {
      this.loadTracksFromSoundCloud();
    });
  },
  getInitialState: function() {
    return { data: [], query: '', offset: 0 };
  },
  render: function() {
    return (
      <div className="grab-tracks">
        <h1>Grab Tracks</h1>
        <SearchForm onQuerySubmit={this.handleQuerySubmit} parentState={this.state} />
        <TrackList data={this.state.data} />
        <Pagination onPaginate={this.handlePaginate} parentState={this.state}/>
      </div>
    )
  }
});

/**
 * Search Form
 */
var SearchForm = React.createClass({
  getInitialState: function() {
    return { query: this.props.parentState.query };
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
  componentDidUpdate: function() {
    window.scrollTo( 0, 0 );
  },
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
    return { offset: this.props.parentState.offset }
  },
  handlePaginate( event ) {
    event.preventDefault();
    var offset = this.state.offset + 10;
    this.setState({ offset: offset });
    this.props.onPaginate({ offset: offset });
  },
  render: function() {
    return (
      <div className="pagination">
        <a href="#" className="paginaton-next" onClick={this.handlePaginate}>More Results</a>
      </div>
    )
  }

});

// Render the ReactDOM
ReactDOM.render(
  <GrabTracks />,
  document.getElementById('app')
);