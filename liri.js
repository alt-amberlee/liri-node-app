require("dotenv").config();


var fs = require("fs");
var keys = require("./keys.js");
var moment = require('moment');
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var userOption = process.argv[2];
var inputParameter = process.argv.slice(3).join(" ");

UserInputs(userOption, inputParameter);

function UserInputs(userOption, inputParameter) {
    switch (userOption) {
        case 'concert-this':
            showConcertInfo(inputParameter);
            break;
        case 'spotify-this-song':
            showSongInfo(inputParameter);
            break;
        case 'movie-this':
            showMovieInfo(inputParameter);
            break;
        case 'do-what-it-says':
            showSomeInfo();
            break;
        default:
            console.log("Invalid Command. Please try again.")
    }
};

function showConcertInfo(artist) {
    console.log(artist);
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    axios.get(queryUrl).then(

        function(response) {
            if (response.data[0].venue != undefined) {
                console.log("Name of the venue: " + response.data[0].venue.name + "\n");
                console.log("Venue location: " + response.data[0].venue.city + "\n");
                var eventDateTime = moment(response.data[0].datetime).format('MM/DD/YYYY');
                console.log("Date of the Event: " + eventDateTime + "\n");
            } else {
                console.log("No results.");
            }
        }
    ).catch(function(error) {
        console.log(error);
    })
};


function showSongInfo(song) {
    spotify.search({ type: 'track', query: song })
        .then(function(response) {
            if (response.tracks.total === 0) {
                errorForSpotify();
            } else {
                console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
                console.log("The song's name: " + response.tracks.items[0].name);
                console.log("A preview link: " + response.tracks.items[0].preview_url);
            }
        }).catch(function(error) {
            console.log(error);
            console.log("No results for song request. Default results for 'The Sign' by Ace of Base");
        })
};

function errorForSpotify() {
    spotify.search({ type: 'track', query: 'The Sign' })
        .then(function(response) {
            for (var i = o; i < response.tracks.items.length; i++) {
                if (response.tracks.items[i].artists[0].name === "Ace of Base") {
                    console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
                    console.log("The song's name: " + response.tracks.items[0].name);
                    console.log("A preview link: " + response.tracks.items[0].preview_url);
                    i = response.tracks.items.length;
                }
            }
        }).catch(function(error) {
            console.log(error);
            console.log("No results found.");
        })
};

function showMovieInfo(movie) {
    axios.get("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy")
        .then(function(response) {
            if (response.data.Title != undefined) {
                console.log("Title of the movie: " + response.data.Title);
                console.log("Year the movie came out: " + response.data.Year);
                console.log("IMDB Rating of the movie: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating of the movie: " + response.data.tomatoRating);
                console.log("Country where the movie was produced: " + response.data.Country);
                console.log("Language of the movie: " + response.data.Language);
                console.log("Plot of the movie: " + response.data.Plot);
                console.log("Actors in the movie: " + response.data.Actors);

            } else {
                showMovieInfo("Mr. Nobody");
            }
        }).catch(function(error) {
            console.log(error);
            console.log("No results found.")
        })
};

function showSomeInfo() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        var dataArr = data.split(',');
        showMovieInfo(dataArr[0], dataArr[1]);
        if (error) {
            return console.log(error);
        }
    })
};