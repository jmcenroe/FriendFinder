var friendData = require('../data/friends.js');
var path = require('path');

// Routing
module.exports = function(app) {

    // user submits form
    // API GET Requests
    // When users "visit" a page. 
    // In each of the below cases when a user visits a link, 
    // (ex: localhost:PORT/api/admin... they are shown a JSON of the data in the table) 
    // ---------------------------------------------------------------------------

    app.get('/api/friends', function(req, res) {
        res.json(friends);
    });

    // API POST Requests
    // When a user submits a form (submits data) to the server.
    // In each of the below cases, when a user submits form data (a JSON object)
    // the JSON is pushed to the appropriate Javascript array
    // ---------------------------------------------------------------------------

    app.post('/api/friends', function(req, res) {

        // "Server" will respond to a user's survey result
        // Then compare those results against every user in the database
        // It will then calculate the difference between each of the numbers 
        // and the user's numbers.It will then choose the user with the fewest 
        // differences as the "best friend match."
        // In the case of multiple users with the same result, it will choose the first match.
        // After the test, it will push the user to the database. 

        // This object to holds the "best match". It will constantly update as  
        // loop continues through all of the options 
        var bestMatch = {
            name: "",
            photo: "",
            friendDifference: 1000
        };

        // Parse result of the user's survey POST 
        var userData = req.body;
        var userName = userData.name;
        var userPhoto = userData.photo;
        var userScores = userData.scores;

        // Calculate the difference between the user's scores and the scores of
        // each user in the database
        var totalDifference = 0;

        // Loop through all the friend possibilities in the database
        for (var i = 0; i < friends.length; i++) {

            console.log(friends[i].name);
            totalDifference = 0;

            // Loop through all the scores of each friend
            for (var j = 0; j < friends[i].scores[j]; j++) {

                // Calculate the difference between the scores and sum them into 
                // the totalDifference
                totalDifference += Math.abs(parseInt(userScores[j]) -
                    parseInt(friends[i].scores[j]));

                // If the sum of differences is less then the differences of the 
                // current "best match"
                if (totalDifference <= bestMatch.friendDifference) {

                    // Reset the bestMatch to be the new friend 
                    bestMatch.name = friends[i].name;
                    bestMatch.photo = friends[i].photo;
                    bestMatch.friendDifference = totalDifference;
                }
            }
        }

        // Save the user's data to the database (happens AFTER the check; otherwise,
        // the database will always return that the user is the user's best friend).
        friends.push(userData);

        // Return a JSON with the user's bestMatch. This will be used by the HTML 
        // in the next page. 
        res.json(bestMatch);

    });
}