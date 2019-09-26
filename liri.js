require("dotenv").config();


var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
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
}

function showConcertInfo(artist) {
    console.log(artist);
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, body) {
        // console.log(response.body[0]);

        var concerts = JSON.parse(body);
        // console.log(concerts[0]);
        for (var i = 0; i < concerts.length; i++) {

            console.log("Name of the venue: " + concerts[0].venue.name + "\n");
            console.log("Venue location: " + concerts[0].venue.location + "\n");
            console.log("Date of the Event (use moment to format this as 'MM/DD/YYYY': " + concerts[0].datetime.slice(0, 10) + "\n");
        }
    })
}
// console.log("Error.")


function showSongInfo(song) {
    if (song === undefined) {
        song = (" ")
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songs = data.tracks.items;
        console.log(data.tracks.items[0].album.artists);
        for (var i = 0; i < songs.length; i++) {

            console.log("Artist(s): " + songs[i].artists[0].name);
            console.log("The song's name: " + songs[i].name);
            console.log("A preview link of the song from Spotify: " + songs[i].preview_url); // The album that the song is from

        }
    });
}

function showMovieInfo(movie)
if (movie === undefined) {
    movie = ("Mr. Nobody")
    console.log(("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/ "))
    console.log("It's on Netflix!")
}
var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
request(queryUrl, function(err, response, body) {
        var movies = JSON.parse(body);

        console.log("Title of the movie: " + movies.Title);
        console.log("Year the movie came out: " + movies.Year);
        console.log("IMDB Rating of the movie: " + movies.imbdRating);
        console.log("Rotten Tomatoes Rating of the movie: " + getRottenTomatoesRatingValue(movies));
        console.log("Country where the movie was produced: " + movies.Country);
        console.log("Language of the movie: " + movies.Language);
        console.log("Plot of the movie: " + movies.Plot);
        console.log("Actors in the movie: " + movies.Actors);
    })
    // console.log("Error.")

function getRottenTomatoesRatingObject(data) {
    return data.Ratings.find(function(item) {
        return item.Source === "Rotten Tomatoes";
    })
}

function getRottenTomatoesRatingValue(data) {
    return getRottenTomatoesRatingObject(data).Value;
}

function showSomeInfo() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        UserInputs(dataArr[0], dataArr[1]);
    })
}