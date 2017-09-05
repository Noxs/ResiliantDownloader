var aws = require("aws-sdk");

function ResiliantDownloader() {
    var that = this;
    var checkFiles = function (files) {
        if (Array.isArray(files) === false) {
            return "invalid data, files must be an array.";
        }
        if (files.length === 0) {
            return "empty array files.";
        }
        for (var i = 0, length = files.length; i < length; i++) {
            if (typeof files[i] !== "object") {
                return "invalid content, each item of files array must bean object.";
            }
            if (!files[i].bucket || typeof files[i].bucket !== "string") {
                return "invalid bucket var, it must be an string.";
            }
            if (!files[i].region || typeof files[i].region !== "string") {
                return "invalid region var, it must be an string.";
            }
            if (!files[i].key || typeof files[i].key !== "string") {
                return "invalid key var, it must be an string.";
            }
        }
        return true;
    };
    var downloadInMemory = function (files) {
        return new Promise(function (resolve, reject) {
            var checkResult = checkFiles(files);
            if (checkResult !== true) {
                reject(new Error("Failed to validate files: " + checkResult));
            }
            var errors = [];
            var download = function (files) {
                if (files.length <= 0) {
                    var error = new Error("Failed to download files.");
                    error.errors = errors;
                    reject(error);
                } else {
                    var file = files.shift();
                    var s3 = new aws.S3({region: file.region});
                    s3.getObject({Bucket: file.bucket, Key: file.key}, function (err, data) {
                        if (err) {
                            err.targetBucket = file.bucket;
                            err.targetKey = file.key;
                            err.targetRegion = file.region;
                            errors.push(err);
                            download(files);
                        } else {
                            resolve(data.Body);
                        }
                    });
                }
            };
            download(files);
        });
    };
    that.downloadInMemory = function (files, callback) {
        if (callback) {
            downloadInMemory(files).then(function (data) {
                callback(null, data);
            }, function (error) {
                callback(error);
            });
            return null;
        } else {
            return new Promise(function (resolve, reject) {
                downloadInMemory(files).then(function (data) {
                    resolve(data);
                }, function (error) {
                    reject(error);
                });
            });
        }
    };
}

module.exports = new ResiliantDownloader();