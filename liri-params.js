// ------------------------
// Required Packages
// ------------------------

// Load the NPM Package inquirer
var inquirer = require("inquirer");
// Load the NPM Package moment
var moment = require("moment")
// Load the NPM Package request for OMDB
var request = require("request");
// Load the NPM Package for Twitter
var Twitter = require('twitter');
// Load the Twitter Key Object from keys.js
var twitterKeys = require("./keys.js");
// Load the NPM Package for Spotify
var Spotify = require('node-spotify-api');
//initiallize and set the ID and Secret for spotify 
var spotify = new Spotify({
    id: 'd221e7df6bbd4de49a8fdc79241b9300',
    secret: '8bbc9fa90d524501b8d48bdb0cca4a8e'
});



var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
});

// ------------------------
// Createa a Prompt for The User 
// ------------------------
if (process.argv.length > 2) {
    console.log("Welcome to Liri - We don't need no arguments here.");
} else {
    console.log("Welcome to Liri");
}

// Create a "Prompt" with a series of questions.
inquirer
    .prompt([
        // Here we create a basic text prompt.
        // Get the users name
        {
            type: "input",
            message: "What is your name?",
            name: "username"
        },
        // Ask what they want to do
        {
            type: "list",
            message: "What function do you want to do?",
            choices: ["View Tweets", "Get Song Details", "Get Movie Details", "Not Sure, Let the computer choose"],
            name: "command"
        }
    ])


    .then(function(inquirerResponse) {
        // ------------------------
        // Parse The Input 
        // ------------------------

        //check user has entered correct parameters
        //if only one parameter entered check if it is my-tweets
        if (process.argv.length === 3) {
            if (process.argv[2] === "my-tweets") {
                displayMyTweets();
            } else if (process.argv[2] === "do-what-it-says") {
                doWhatItSays();
            } else {
                incorrectUsage();
            }
        }
        //if more than two parameter check it matches the required format
        else if (process.argv.length > 3) {
            //check if second parameter is spotify-this-song
            if (process.argv[2] === "spotify-this-song") {

                var songTitle = "";

                //check for multiple word song titles
                for (var i = 3; i < process.argv.length; i++) {
                    songTitle += " " + process.argv[i];
                }
                getSongDetails(songTitle);

                //check if second parameter is spotify-this-song
            } else if (process.argv[2] === "movie-this") {
                var movieTitle = "";
                //check for multiple word movie titles
                for (var i = 3; i < process.argv.length; i++) {
                    movieTitle += " " + process.argv[i];
                }
                getMovieDetails(movieTitle);
            } else {
                incorrectUsage();
            }

        } else {
            incorrectUsage();
        }

    });


// ------------------------
// Helper Functions
// ------------------------

function getSongDetails(songTitle) {

    var title = encodeURI(songTitle);

    spotify.search({ type: 'track', query: title }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        var songInfo = data.tracks.items[0];
        console.log("/-----------------------------------------------");
        console.log("|  Artist     : ", songInfo.artists[0].name)
        console.log("|  Song Name  : ", songInfo.name)
        console.log("|  Album      : ", songInfo.album.name)
        console.log("|  Preview URL: ", songInfo.preview_url)
        console.log("\\-----------------------------------------------");
    });

}

function getMovieDetails(movieTitle) {
    console.log('getMovieDetails', 'movieTitle:', movieTitle);
    // Then run a request to the OMDB API with the movie specified
    var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

    // This line is just to help us debug against the actual URL.
    console.log(queryUrl);

    // Then run a request to the OMDB API with the movie specified
    request(queryUrl, function(error, response, body) {

        // If the request is successful (i.e. if the response status code is 200)
        if (!error && response.statusCode === 200) {

            console.log("/-----------------------------------------------");
            console.log("|  Movie        : ", JSON.parse(body).Title)
            console.log("|  Year         : ", JSON.parse(body).Year)
            console.log("|  Rating (IMDB): ", JSON.parse(body).imdbRating)
            console.log("|  Country      : ", JSON.parse(body).Country)
            console.log("|  Language     : ", JSON.parse(body).Language)
            console.log("|  Plot.        : ", JSON.parse(body).Plot)
            console.log("|  Actors.      : ", JSON.parse(body).Actors)
            console.log("\\-----------------------------------------------");

        }
    });

}

function doWhatItSays() {
    //read random.txt and run 
}

function displayMyTweets() {
    console.log('displayMyTweets');
    var params = { screen_name: 'barackobama', count: '20' };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            console.log("---- Tweets from Barack Obama ----")
            for (var i = 0; i < tweets.length; i++) {
                console.log("/---------------------" + i + "-----------------------");
                console.log("|  Tweet: ", tweets[i].text);
                console.log("|  Created at: ", tweets[i].created_at);
                console.log("|  moment", moment().format());
                if (i < 10) {
                    console.log("\\---------------------" + "-" + "-----------------------\n");
                } else {
                    console.log("\\---------------------" + "--" + "-----------------------\n");
                }

            }

        }
    });
}

function incorrectUsage() {
    console.log("***Incorrect Parameters. Try:");
    console.log("   node liri.js my-tweets");
    console.log("   node liri.js spotify-this-song '<song name here>'");
    console.log("   node liri.js movie-this '<movie name here>'");
}





//