/*
Primary file for the homework assignment # 1
Author: Hamza Shujaat
7/28/2018
*/

//Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const config = require('./config');
const stringDecoder = require('string_decoder').StringDecoder;

// Instantiating the http server
let httpServer = http.createServer(function(req, res) {
    serverFunctionality(req, res);
});

httpServer.listen(config.httpPort, function() {
    console.log('Server listening on port', config.httpPort);
});
let counter = 0;
let serverFunctionality = function(req, res) {
    // Get the Url and parse it , the get the path, trim it get query string and http method
    let parsedUrl = url.parse(req.url, true);
    let path = parsedUrl.pathname;
    let trimmedPath = path.replace(/^\/+|\/+$/g, '');
    var queryStringObject = parsedUrl.query;
    let method = req.method.toLowerCase();
    // Get the Headers as an object
    let headers = req.headers;
    // Get the paylod, if any
    let decoder = new stringDecoder('utf-8');
    let buffer = '';
    req.on('data', function(data) {
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();
        // Choose the handler this request goes to 
        let chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        // Construct the data object to send to the handler
        let data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }
        chosenHandler(data, function(statusCode, payload) {
            // Use the status code called back by the handler or default to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            // Use the payload defined by the handler or default to empty object
            payload = typeof(payload) === 'object' ? payload : {};
            // convet the payload to a string
            let payloadString = JSON.stringify(payload);

            //Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeContinue(statusCode);
            res.end(payloadString)

            // Log the request
            console.log('returning ', statusCode, payloadString);
        })

    });
}

// Define handlers
var handlers = {}

// Ping handler
handlers.hello = function(data, callback) {
    callback(200, { 'msg': 'Hello to you too!' });
}


// Not Found handler
handlers.notFound = function(data, callback) {
    callback(404);
}

let router = {
    'helloWorld': handlers.hello,
}