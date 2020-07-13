import React, { Component } from 'react';
import './App.css';
import SpotifyWebApi from "spotify-web-api-js";
import TopBar from './TopBar';
const spot = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spot.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      topTracks: [],
      topArtists: [],
      user_id: ""
    }
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getTops() {
    spot.getMe()
      .then((user) => {
        this.setState({
          user_id: user.id
        });
      })
    spot.getMyTopTracks({
      limit: 50,
      time_range: "short_term"
    })
      .then((response) => {
        this.setState({
          topTracks: response.items
        });
      })
    console.log(this.state)
    spot.getMyTopArtists({
      limit: 50,
      time_range: "short_term"
    })
      .then((response) => {
        this.setState({
          topArtists: response.items
        });
      })
    console.log(this.state)
  }

  renderTracksTableData() {
    var rank = 0;
    return this.state.topTracks.map((track) => {
       rank++;
       const name = track.name;
       const artists = track.artists.map((x) => x.name).join(", ");
       const preview = track.preview_url;
       return (
          <tr key={name}>
             <td>{rank}</td>
             <td>{name}</td>
             <td>{artists}</td>
             <td><a href={preview}> Click to listen </a></td>
          </tr>
       )
    })
  }
//TODO: get album art
  renderTableHeader() {
    // let header = Object.keys(this.state.topTracks[0]);
    let header = ["Rank", "Name", "Artist(s)", "Preview"];
    return header.map((key) => {
       return <th key={key}>{key.toUpperCase()}</th>
    })
  }

  renderTrackTable() {
    this.getTops();
    return (
      <div>
         <h1 id='title'>Top Tracks</h1>
         <table id='tracks'>
            <tbody>
               <tr> {this.renderTracksTableHeader()} </tr>
               {this.renderTracksTableData()}
            </tbody>
         </table>
      </div>
   )
  }

  renderArtistsTableData() {
    var rank = 0;
    return this.state.topArtists.map((artist) => {
       const name = artist.name;
       rank++
       return (
          <tr key={name}>
             <td>{rank}</td>
             <td>{name}</td>
          </tr>
       )
    })
  }

  renderArtistsTableHeader() {
    let header = ["Rank", "Name"];
    return header.map((key) => {
       return <th key={key}>{key.toUpperCase()}</th>
    })
  }

  renderArtistTable() {
    // this.getTops();
    return (
      <div>
         <h1 id='title'>Artists</h1>
         <table id='tracks'>
            <tbody>
               <tr> {this.renderArtistsTableHeader()} </tr>
               {this.renderArtistsTableData()}
            </tbody>
         </table>
      </div>
   )
  }

  render() {
    return (
      <div>
        <TopBar />
        <div className="App">
          <div>
            { !this.state.loggedIn &&
              <div>
                <p>Do you even know a brother?</p>
                <a href='http://localhost:8888' > Login to Spotify </a>
              </div>
            }
          </div>
          <div>
            { this.state.loggedIn &&
              <div>
                { this.renderTrackTable() }
              </div>
            }
          </div>
          <div>
            { this.state.loggedIn &&
              <div>
                { this.renderArtistTable() }
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

export default App;
