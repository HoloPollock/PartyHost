var express = require('express')
var request = require('request')
var cors = require('cors')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')
var admin = require("firebase-admin")
var serviceAccount = require("./PrivateKeys/party-haus-217716-555c9903fe9d.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://party-haus.firebaseio.com/"
})
var db = admin.database();
var client_id = 'f779e8c79de344eeb0200c198c6c0b8e';
var client_secret = 'b47d5f992e4545fcb09bdd7b4e529046';
var redirect_uri = 'http://localhost:8888/callback';

let cookieGenerator = function(length) 
{
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) 
    {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

let stateKey = 'spotify_auth_state';

var app = express()

app.use(cors()).use(cookieParser())

app.get('/login', function(req,res) {
    let state = cookieGenerator(16);
    res.cookie(stateKey, state);

    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function(req,res) {
    let code = req.query.code || null;
    let state = req.query.state || null;
    let storedState = req.cookies ? req.cookies(stateKey) : null;

    if (state === null || state !== storedState)
    {
        console.log("uh oh")
    }
    else
    {
        res.clearCookie(stateKey);
        var authOptions = 
        {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authprization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                let access_token = body.access_token;
                let refresh_token = body.refresh_token;
                
            }

        }
        


    }
        
}








