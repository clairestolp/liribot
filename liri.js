const twitter = require('twitter');
const nodeSpotifyApi = require('node-spotify-api');
const request = require('request');
const dotenv = require('dotenv').config();

const spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);