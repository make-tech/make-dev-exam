'use strict';
// const AWS = require('aws-sdk');
require('dotenv').config();
const dynamo = require('dynamodb');
    dynamo.AWS.config.loadFromPath('credentials.json');
const joi = require('joi');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const app = express();
    app.use(cors());
    app.use(bodyParser.json({ strict: false }));
const date = new Date();

const gymBuddy = dynamo.define(process.env.DYNAMODB_NAME, {
    hashKey : 'id',
    rangeKey: 'athlete',
    timestamps : true, // add the timestamp attributes (updatedAt, createdAt)
    schema : {
        id: dynamo.types.uuid(),
        athlete: joi.strict(),
        programName: joi.strict(),
        programDuration: joi.date(),
        programDurationRaw: joi.object(),
        programSchedule: joi.object(),
        programExercises: joi.array()
    },
    tableName: process.env.DYNAMODB_NAME
});

app.get('/getUserData/:athlete', function(req, res) {
    gymBuddy
    .scan()
    .where('athlete').equals(req.params.athlete)
    .where('programDuration').gt(date) // Don't include expired programs
    .exec((err, data) => {
        if (err) {
            res.send({
                result: err
            })
        }
        res.send({
            result: data
        })
    });
});

module.exports.getUserData = serverless(app);
