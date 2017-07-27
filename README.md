# ResiliantDownloader
 npm install resilient-downloader

# How it works

This module provide a simple way to download a file in memory from AWS S3.
This is not downloading all the files. It stop at the first download success.

# Usage

var downloader = require('resilient-downloader');

var files = [
    {bucket: "my-bucket", region: "us-east-1", key: ""foobar},
    {bucket: "my-other-bucket", region: "us-east-2", key: ""foobar}
    /* as many as you want*/
];

downloader.downloadInMemory(files, function(err, data){
    /*data*/
    /*"file content foo bar"*/
});

 OR

downloader.downloadInMemory(files).then(function(data) {
    /*data*/
    /*"file content foo bar"*/
}, function(error){
    /*error*/
    /*"Error reason"*/
});

// TODO
unit testing