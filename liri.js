// ------------------------
// Required Packages
// ------------------------

// Load the NPM Package inquirer
var inquirer = require("inquirer");
// Load the NPM Package moment
var moment = require("moment")

// fs is a core Node package for reading and writing files
var fs = require("fs");

// Load the NPM Package request for OMDB
var request = require("request");
// Load the NPM Package for Twitter
var Twitter = require('twitter');

// Load the Twitter Key Object from keys.js
var twitterKeys = require("./keys.js");
var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
});

// Load the NPM Package for Spotify
var Spotify = require('node-spotify-api');
//initiallize and set the ID and Secret for spotify 
var spotify = new Spotify({
    id: 'd221e7df6bbd4de49a8fdc79241b9300',
    secret: '8bbc9fa90d524501b8d48bdb0cca4a8e'
});


var firstLine = "/-----------------------------------------------";
var lastLine = "\\-----------------------------------------------";

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
            choices: ["View Tweets", "Spotify This Song", "Get Movie Details", "Not Sure, Let the computer choose"],
            name: "command"
        }
    ])


    .then(function(inquirerResponse) {
        // ------------------------
        // Parse The Input 
        // ------------------------

        var command = inquirerResponse.command;
        console.log(command);

        runCommand(command);
    });

// ------------------------
// Helper Functions
// ------------------------

function runCommand(command) {
    console.log('runCommand', 'command:', command);

    switch (command) {
        case "View Tweets":
            displayMyTweets();
            break;
        case "Spotify This Song":
            getSongDetails();
            break;
        case "Get Movie Details":
            getMovieDetails();
            break;
        case "Not Sure, Let the computer choose":
            doWhatItSays();
            break;
        default:
            getSongDetails();
            break;
    }
}

function getSongDetails() {
    // Create a "Prompt" with a series of questions.
    inquirer
        .prompt([
            // Get the users name
            {
                type: "input",
                message: "What is the name of the song?",
                name: "song"
            }
        ])
        .then(function(inquirerResponse) {
            var title = encodeURI(inquirerResponse.song);

            spotify.search({ type: 'track', query: title }, function(err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                var songInfo = data.tracks.items[0];
                console.log(firstLine)
                console.log()
                console.log()
                console.log()
                console.log()
                console.log(lastLine);

                logResult(firstLine + "\n");
                logResult("|  Artist     : ", songInfo.artists[0].name + "\n");
                logResult("|  Song Name  : ", songInfo.name + "\n");
                logResult("|  Album      : ", songInfo.album.name + "\n");
                logResult("|  Preview URL: ", songInfo.preview_url + "\n");
                logResult(lastLine);
                logResult("\n\n\n");

            });

        });
}

function getMovieDetails(movieTitle) {
    // Create a "Prompt" with a series of questions.
    inquirer
        .prompt([
            // Here we create a basic text prompt.
            // Get the users name
            {
                type: "input",
                message: "What is the name of the movie?",
                name: "movie"
            }
        ])
        .then(function(inquirerResponse) {
            var movieTitle = encodeURI(inquirerResponse.movie);
            console.log('getMovieDetails', 'movieTitle:', movieTitle);
            // Then run a request to the OMDB API with the movie specified
            var queryUrl = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

            // This line is just to help us debug against the actual URL.
            console.log(queryUrl);

            // Then run a request to the OMDB API with the movie specified
            request(queryUrl, function(error, response, body) {

                // If the request is successful (i.e. if the response status code is 200)
                if (!error && response.statusCode === 200) {


                    console.log(firstLine);
                    console.log("|  Movie        : ", JSON.parse(body).Title)
                    console.log("|  Year         : ", JSON.parse(body).Year)
                    console.log("|  Rating (IMDB): ", JSON.parse(body).imdbRating)
                    console.log("|  Country      : ", JSON.parse(body).Country)
                    console.log("|  Language     : ", JSON.parse(body).Language)
                    console.log("|  Plot.        : ", JSON.parse(body).Plot)
                    console.log("|  Actors.      : ", JSON.parse(body).Actors)
                    console.log(lastLine);

                    logResult(firstLine);
                    logResult("\n|  Movie        : " + JSON.parse(body).Title + "\n");
                    logResult("|  Year         : " + JSON.parse(body).Year + "\n");
                    logResult("|  Rating (IMDB): " + JSON.parse(body).imdbRating + "\n");
                    logResult("|  Country      : " + JSON.parse(body).Country + "\n");
                    logResult("|  Language     : " + JSON.parse(body).Language + "\n");
                    logResult("|  Plot.        : " + JSON.parse(body).Plot + "\n");
                    logResult("|  Actors.      : " + JSON.parse(body).Actors + "\n");
                    logResult(lastLine);
                    logResult("\n\n\n");
                }
            });
        });



}

function doWhatItSays() {
    //read random.txt and run 
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        // Then split it by commas (to make it more readable)
        var [command, argument] = data.split(",");
        console.log('command:', command);

        runCommand(command.trim());

    });



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
                console.log("\\---------------------" + "-" + "-----------------------\n");

                logResult("/---------------------" + i + "-----------------------\n");
                logResult("|  Tweet: " + tweets[i].text + "\n");
                logResult("|  Created at: " + tweets[i].created_at + "\n");
                logResult(lastLine);
                logResult("\n\n");






            }

        }
    });
}


function logResult(resultString) {

    fs.appendFile("log.txt", resultString, function(err) {

        // If an error was experienced we say it.
        if (err) {
            console.log(err);
        } else {

        }
    });

}







//