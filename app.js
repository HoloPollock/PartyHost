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
var db = admin.database

