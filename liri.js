const dotenv = require('dotenv').config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const inquirer = require('inquirer');
const chalk = require('chalk');
const wrapAnsi = require('wrap-ansi');


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
            console.log(chalk.cyan('\nHere are your tweets\n'));
            getTweets();
            break;
        case 'Spotify a song':
            console.log('\nWhat song should I look for?\n');
            console.log('this is a string')
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
    client.get('statuses/home_timeline.json?screen_name=block_comment&count=20', function(err, tweets, response) {
        if(!err && response.statusCode === 200) {
            tweets.forEach(function(tweet) {
                console.log(`\n* ${chalk.magenta(tweet.created_at)}:`);
                console.log(`\n${wrapAnsi(tweet.text, 80)}`);
            });
            console.log('\n----------------------\n');
            askLiri();
        }else{
            console.log('Status', response.statusCode);
            console.log(err);
        }
    });
}

function spotifySong () {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What song should I look for?',
            name: 'song'
        }
    ]).then(function (response) {
        spotify.search({type: 'track', query: response.song}, function (err, data) {
            if(!err){
                console.log(data);
            }else{
                console.log(err);
            }
        });
    });
}
