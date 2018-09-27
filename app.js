var express = require('express')
var request = require('request')
var cors = require('cors')
var querystring = require('querystring')
var cookieParser = require('cookie-parser')
var admin = require("firebase-admin")
var serviceAccount = require("./PrivateKeys/party-haus-firebase-adminsdk-hx192-126100e80c.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://party-haus.firebaseio.com/"
})
var db = admin.database();
var ref = db.ref();

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
console.log("hell0")
app.use(express.static(__dirname+"/"))
    .use(cors())
    .use(cookieParser())
console.log("hello")
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
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState)
    {
        console.log("uh oh")
    }
    else
    {
        console.log("hel110");
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        console.log("pop");
        request.post(authOptions, function(error, response, body) {
            console.log(!error);
            console.log(response.statusCode)
            if (!error && response.statusCode === 200) {
                console.log(body)
                let access_token = body.access_token;
                let refresh_token = body.refresh_token;
                let accessCode = cookieGenerator(6);
                ref.update({
                     [accessCode]: {
                        access_token: access_token,
                        refresh_token: refresh_token
                    }
                }
                )
                console.log("hello")
                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };
                request.get(options, function(error, response, body) {
                    party = ref.child(accessCode);
                    party.update({
                        partyName : body.display_name.substr(0,body.display_name.indexOf(' ')) + "'s Banger" 
                    })
                });
                res.redirect('/host#' + querystring.stringify({
                    accessCode : accessCode
                }));

            }

        });
    }   
});

app.listen(8888)
