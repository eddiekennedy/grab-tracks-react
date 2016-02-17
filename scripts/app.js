var app = {};
app.apiRoot = 'https://api.soundcloud.com';
app.clientId = 'f652822b93b6a6799336b4a729d50de8';

var GrabTracks = React.createClass({

	render: function() {
		return (
			<div className="grab-tracks">
				<h1>Grab Tracks</h1>
			</div>
		)
	}

});

ReactDOM.render(
  <GrabTracks />,
  document.getElementById('app')
);

