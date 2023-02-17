//jshint esversion: 6

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    //console.log(req);
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    //console.log("Post request recieved.");
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //console.log(firstName, lastName, email);

    const data = {
        members: [
            {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    
        const jsonData = JSON.stringify(data);

        const url = "https://us10.api.mailchimp.com/3.0/lists/43807ccec1";

        const options = {
            method: "POST",
            auth: "testing:5734c8a00011cea344aa418af4df05fd-us10"
        }

        const request = https.request(url, options, function(response) {
            response.on("data", function(data){
                console.log(JSON.parse(data));
                
                const statusCode = response.statusCode;

                if(statusCode === 200){
                    res.sendFile(__dirname + "/success.html");
                } else {
                    res.sendFile(__dirname + "/failure.html");
                }
            })
        });

        request.write(jsonData);
        request.end();


    
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

// process.env.PORT for deployed server and 3000 for local testing
app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000.");
});

// list id: 43807ccec1
// apikey: 5734c8a00011cea344aa418af4df05fd-us10