const twitter = require('twitter');
const nodeSpotifyApi = require('node-spotify-api');
const request = require('request');
const dotenv = require('dotenv').config();
const inquirer = require('inquirer');

const spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);