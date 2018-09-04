# Liri Bot

### Description
Liri is a CLI program that fetches information for you. Liri has four different commands she can perform: get your 20 most recent tweets, spotify a song, get the imdb information about a movie, and do something randomly.


### Overview

Liri can do the following commants 

 * `node liri.js my-tweets` : Displays the user's last 20 tweets and when they were created
 
 <img width="75%" src="https://github.com/clairestolp/liribot/blob/master/demos/demo-tweets.gif?raw=true">
 
 * `node liri.js spotify-this-song '<song name here>'` : Gets song data from spotify and displays the Name, Artist(s), and a spotify preview link
 
  <img width="75%" src="https://github.com/clairestolp/liribot/blob/master/demos/demo-spotify.gif?raw=true">
 
 * `node liri.js movie-this '<movie name here>'` : Gets movie data from OMDB API and displays the title, year, IMBD rating, Rotton Tomatoes rating, country, language, plot, and actors.
 
  <img width="75%" src="https://github.com/clairestolp/liribot/blob/master/demos/demo-imdb.gif?raw=true">
 
 * `node liri.js do-what-it-says` : Grabs a command from `random.txt` and executes it.
 
  <img width="75%" src="https://github.com/clairestolp/liribot/blob/master/demos/demo-random.gif?raw=true">


### Technology

* JavaScript
* NodeJS
* Modules used: 
    * envdot
    * twitter
    * node-spotify-api
    * fs
    * request
    * inquirer
    * chalk
    * wrap-ansi

### Goals 

This small web app was created to fulfill the requirements of the UNC Chapel Hill Coding Bootcamp and demonstrates the ability to Use NodeJS to take commands from the terminal, make secure calls to various APIs and display data in the terminal. Envdot was used to store API tokens in process.env so that an individual's tokens cannot be seen by others, and so that every user uses their personal token. An additional goal of this assignment was to use NodeJS's built-in fs module to save log data. One personal goal was to create funtion that chooses a random command to run.

   
