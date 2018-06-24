const dotenv = require('dotenv').config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const inquirer = require('inquirer');


const spotify = new Spotify(keys.spotify);
const client = new Twitter(keys.twitter);

inquirer.prompt([
    {
        type: 'list',
        message: 'Hi, I\'m liri. Tell me what you want me to do.',
        choices: ['View my tweets', 'Spotify a song', 'Movie this', 'Do what it says'],
        name: 'command'
    }
]).then(function (response) {
    executeCommand(response.command);
});


function askLiri() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What else would you like me to do?',
            choices: ['View my tweets', 'Spotify a song', 'Movie this', 'Do what it says'],
            name: 'nextCommand'
        }
    ]).then(function (response) {
        executeCommand(response.nextCommand)
    });
}

function executeCommand(response) {
    switch (response) {
        case 'View my tweets':
            console.log('\nHere are your tweets\n');
            getTweets();
            console.log('\n----------------------\n');
            break;
        case 'Spotify a song':
            console.log('\nWhat song should I look for?\n');
            console.log('\n----------------------\n');
            break;
        case 'Movie this':
            console.log('\nWhat movie should I look for?\n');
            console.log('\n----------------------\n');
            break;
        case 'Do what it says':
        console.log('\nOkay, I will\n');
        console.log('\n----------------------\n');
            break;
        default:
            console.log('\nI\'m sorry, I didn\'t get that.\n');
            break;
    };
}

function getTweets () {
    client.get('statuses/home_timeline.json?screen_name=block_comment&count=2', function(err, tweets, response) {
        if(!err && response.statusCode === 200) {
            console.log(tweets);
        }else{
            console.log('Staus', response.statusCode);
            console.log(err);
        }
    });
}