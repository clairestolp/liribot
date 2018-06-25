const dotenv = require('dotenv').config();
const keys = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const fs = require('fs');
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
            spotifySong();            
            break;
        case 'Movie this':
            movieThis();
            break;
        case 'Do what it says':
            console.log('\nOkay, I will\n');
            fs.readFile('./random.txt', 'utf8', function (err, data) {
                if(!err) {
                    let commands = data.split(',');
                    let rng = Math.floor(Math.random()*commands.length);
                    console.log(commands[rng]);
                    //command(commands[rng]);
                }else{
                    console.log(err);
                }
            })
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
                console.log(`\n* ${chalk.cyan(tweet.created_at)}:`);
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
        getSpotify(response.song);
    });
}

function movieThis(response) {
    inquirer.prompt([
        {
            type: 'input', 
            message: 'What movie should I look for?',
            name: 'movie'
        }
    ]).then(function (response) {
        getImdb(response.movie);
    });
}

function command (order) {
    let arr = order.split(':');
    switch (arr[0]) {
        case 'spotify':
            console.log(chalk.bold.green(`Searching spotify for ${arr[1]}`));
            getSpotify(arr[1]);
            break;
    }
}


function getSpotify(query) {
    spotify.search({type: 'track', query: query, limit: 1}, function (err, data) {
        if(!err){
            let song = data.tracks.items[0];
            console.log(chalk.green('\nHere is what I found\n'));
            console.log(chalk.green('Artist: '), song.album.artists[0].name, '\n');
            console.log(chalk.green('Song: '), song.name, '\n');
            console.log(chalk.green('Preview: '), song.preview_url, '\n');
            console.log('\n----------------------\n');
        }else{
            if(!song) {
                console.log('I\'m sorry, I didn\'t get that. Could you say it again?');
                spotifySong();
            }else{
                console.log(err);
            }
        }
        askLiri();
    });
}

function getImdb(query) {
    let movie = query.replace(' ', '+');
        let url = `http://www.omdbapi.com/?t=${movie}&apikey=a9119e4b`;
        //console.log(url);
        request(url, function(err, response, body) {
            if(!err && response.statusCode === 200){
                let data = JSON.parse(body);
                console.log(chalk.red('\nThis is what I found...\n'));
                
                console.log(chalk.red('Title: '), data.Title, '\n');
                console.log(chalk.red('Released: '), data.Year, '\n');
                console.log(chalk.red('IMDB gave it: '), data.imdbRating, '\n');
                console.log(chalk.red('Rotton Tomatoes gave it: '), data.Ratings[1].Value, '\n');
                console.log(chalk.red('Created in: '), data.Country, '\n');
                console.log(chalk.red('Plot: '), wrapAnsi(data.Plot, 80), '\n');
                console.log(chalk.red('Actors: '), wrapAnsi(data.Actors, 80), '\n');

                console.log('\n----------------------\n');
                askLiri();
            }else{
                console.log('-------ERROR--------');
                console.log(err);
            }
        });
}