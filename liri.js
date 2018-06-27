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
        name: 'firstCommand'
    }
]).then(function (response) {
    executeCommand(response.firstCommand);
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
        executeCommand(response.nextCommand);
    });
}

function executeCommand(response) {
    log(response);
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

                    command(commands[rng]);
                }else{
                    console.log(err);
                }
            });
            break;
        default:
            console.log('\nI\'m sorry, I didn\'t get that.\n');
            askLiri();
            break;
    };
}

function getTweets () {
    client.get('statuses/home_timeline.json?screen_name=block_comment&count=20', function(err, tweets, response) {
        if(!err && response.statusCode === 200) {
            console.log(response.body);
            tweets.forEach(function(tweet) {
                console.log(`\n* ${chalk.cyan(tweet.created_at)}:`);
                console.log(`\n${wrapAnsi(tweet.text, 80)}`);
                log(tweet.created_at);
                log(tweet.tweet);
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
        log(response.song);
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
        log(response.movie);
        getImdb(response.movie);
    });
}

function command (order) {
    let arr = order.split(':');
    log(arr[0] + ', ' + arr[1]);
    switch (arr[0]) {
        case 'spotify':
            console.log(chalk.bold.green(`Searching spotify for ${arr[1]}`));
            getSpotify(arr[1]);
            break;
        case 'tweets':
            console.log(chalk.bold.cyan('Getting your most recent tweets'));
            getTweets();
            break;
        case 'imdb':
            console.log(chalk.bold.red(`Searching Imdb for ${arr[1]}`));
            getImdb(arr[1]);
            break;
    }
}


function getSpotify(query) {
    if (!query){
        query = 'The Sign Ace of Base';
    }
    spotify.search({type: 'track', query: query, limit: 1}, function (err, data) {
        let song = data.tracks.items[0];
        if(!err){

            if(!song) {
                console.log('\nI\'m sorry, I didn\'t get that. Could you say it again?\n');
                return spotifySong();
            }

            console.log(chalk.green('\nHere is what I found\n'));
            console.log(chalk.green('Artist: '), song.album.artists[0].name, '\n');
            console.log(chalk.green('Song: '), song.name, '\n');
            console.log(chalk.green('Preview: '), song.preview_url, '\n');
            console.log('\n----------------------\n');
            log(song.album.artists[0]);
            log(song.name);
            log(song.preview_url);
        }else{
            console.log('-------ERROR--------');
            console.log(err);
        }
        askLiri();
    });
}

function getImdb(query) {
    if(!query) {
        query = 'Mr.Nobody'
    }
    let movie = query.replace(' ', '+');
        let url = `http://www.omdbapi.com/?t=${movie}&apikey=a9119e4b`;
        request(url, function(err, response, body) {
            if(!err && response.statusCode === 200){
                let data = JSON.parse(body);
                
                if(!data.Title) {
                    console.log('\nI\'m sorry, I didn\'t get that. Could you say it again?\n');
                    return movieThis();
                }

                let tomatoesRating = 'N/A';
                
                if(data.Rating) {
                    tomatoesRating = data.Rating[1].Value;
                }

                console.log(chalk.red('\nThis is what I found...\n'));
                
                console.log(chalk.red('Title: '), data.Title, '\n');
                console.log(chalk.red('Released: '), data.Year, '\n');
                console.log(chalk.red('IMDB gave it: '), data.imdbRating, '\n');
                console.log(chalk.red('Rotton Tomatoes gave it: '), tomatoesRating, '\n');
                console.log(chalk.red('Created in: '), data.Country, '\n');
                console.log(chalk.red('Plot: '), wrapAnsi(data.Plot, 80), '\n');
                console.log(chalk.red('Actors: '), wrapAnsi(data.Actors, 80), '\n');

                console.log('\n----------------------\n');
                askLiri();

                log(data.Title);
                log(data.Year);
                log(data.imdbRating);
                log(tomatoesRating);
                log(data.Country);
                log(data.Plot);
                log(data.Actors);
            }else{
                console.log('-------ERROR--------');
                console.log(err);
            }
        });
}

function log (item) {
    item += '\n';
    fs.appendFile('log.txt', item, function (err) {
        if(err) {
            console.log(err);
        }
    });
}