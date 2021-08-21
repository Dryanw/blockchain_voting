// Importing modules
const url = require('url');
const express = require('express');
const path = require('path');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

// Mongo Link
const MONGO_LINK = require('./mongo_link.js')

// Schemas for login info
const LoginInfo = require('./model/LoginInfo');
const Events = require('./model/Event');

// Set up mongodb connection
const connectionString = MONGO_LINK;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true})
        .then (()=> {console.log('Mongoose connected successfully');},
               error => {console.log('Mongoose could not connect to db: ' + error)});

// Express Router
var app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', cors(), function(req, res) {
    let params = new URLSearchParams(url.parse(req.url).query);
    let address = params.get('address');
    let hash = params.get('hash');
    console.log(`GET /login: address=${address} hash=${hash}`);
    LoginInfo.find(
        {$and: [{address: address},
                {pwHash: hash}]},
        (error, documents) => {
            if (error) console.log('Error occurred on LoginInfo.find(): ' + error);
            else {
                res.status(200);
                if (documents.length > 0){
                    res.json(true);
                } else {
                    res.json(false);
                };
            };
        });
});

app.get('/register', cors(), function(req, res){
    let params = new URLSearchParams(url.parse(req.url).query);
    let address = params.get('address');
    let hash = params.get('hash');
    console.log(`GET /register: address=${address} hash=${hash}`);
    LoginInfo.find(
        {$and: [{address: address}]},
        (error, documents) => {
            if (error) {
                console.log('Error occurred on LoginInfo.find(): ' + error);
                res.json({success: false, msg: error})
            } else {
                if (documents.length > 0){
                    res.json({success: false, msg: "Already registered"});
                } else {
                    LoginInfo.create({'address': address, 'pwHash': hash});
                    res.json({success: true, msg: ''});
                };
            };
        });
});

app.get('/getAllEvents', cors(), function(req, res){
    console.log('GET /getAllEvents');
    Events.find({}, (error, documents) => {
        if (error) {
            console.log('Error occurred on Events.find(): ' + error);
            res.json({success: false, msg: error});
        } else {
            res.json({success: true, msg: documents});
        }
    });
});

app.get('/findEvent', cors(), function(req, res){
    let params = new URLSearchParams(url.parse(req.url).query);
    let name = params.get('name');
    let owner = params.get('owner');
    let address = params.get('address');
    let findCriteria = [];
    if (name) findCriteria.push({name: name});
    if (owner) findCriteria.push({owner: owner});
    if (address) findCriteria.push({address: address});
    console.log(`GET /findEvent: name=${name} owner=${owner} address=${address}`);
    Events.find(
        {$and: findCriteria},
        (error, documents) => {
            if (error) {
                console.log('Error occurred on Events.find(): ' + error);
                res.json({success: false, msg: error});
            } else {
                if (documents.length > 0){
                    res.json({success: true, msg: documents[0]});
                } else {
                    res.json({success: false, msg: ''});
                };
            };
        });
});

app.get('/newEvent', cors(), function(req, res){
    let params = new URLSearchParams(url.parse(req.url).query);
    let name = params.get('name');
    let address = params.get('address');
    let owner = params.get('owner');
    let choicesStr = params.get('choices');
    let choices = choicesStr.split('|');
    console.log(`GET /newEvent: name=${name} address=${address} owner=${owner} choices=${choices}`);
    let result = Events.find(
        {$and: [{name: name}, {address: address}]},
        (error, documents) => {
            if (error) {
                console.log('Error occurred on Events.find(): ' + error);
                res.json({success: false, msg: error});
            } else {
                if (documents.length > 0) {
                    res.json({success: false, msg: 'Event with the same name and address already created'});
                } else {
                    Events.create({'name': name, 'address': address, 'owner': owner, 'choices': choices});
                    res.json({success: true, msg: ''});
                }
            }
        }
    )
});


const httpServer = http.createServer(app);
httpServer.listen(3001);