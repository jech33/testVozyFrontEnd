import React, { Component } from "react";
import DiscoverBlock from "./DiscoverBlock/components/DiscoverBlock";
import "../styles/_discover.scss";
import config from "../../../config";
import axios from "axios";

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      token: "",
      newReleases: [],
      playlists: [],
      categories: [],
      visibility: true,
    };
  }

  componentDidMount() {
    const spotify = config.api;
    axios(spotify.authUrl, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(spotify.clientId + ":" + spotify.clientSecret),
      },
      data: "grant_type=client_credentials",
      method: "POST",
    }).then((tokenResponse) => {
      console.log(tokenResponse.data.access_token);
      this.setState({ token: tokenResponse.data.access_token });

      axios("https://api.spotify.com/v1/browse/new-releases?country=US", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((releasedResponse) => {
        this.setState({ newReleases: releasedResponse.data.albums.items });
        console.log(releasedResponse.data.albums.items);
      });

      axios("https://api.spotify.com/v1/browse/featured-playlists?country=US", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((featuredResponse) => {
        this.setState({ playlists: featuredResponse.data.playlists.items });
        console.log(featuredResponse.data.playlists.items);
      });

      axios("https://api.spotify.com/v1/browse/categories", {
        method: "GET",
        headers: { Authorization: "Bearer " + tokenResponse.data.access_token },
      }).then((genresResponse) => {
        this.setState({ categories: genresResponse.data.categories.items });
        console.log(genresResponse.data.categories.items);
      });
    });
  }

  render() {
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        <DiscoverBlock
          text="RELEASED THIS WEEK"
          id="released"
          data={newReleases}
        />
        <DiscoverBlock
          text="FEATURED PLAYLISTS"
          id="featured"
          data={playlists}
        />
        <DiscoverBlock
          text="BROWSE"
          id="browse"
          data={categories}
          imagesKey="icons"
        />
      </div>
    );
  }
}
