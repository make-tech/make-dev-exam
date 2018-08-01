'use strict';
// const AWS = require('aws-sdk');
require('dotenv').config();
const dynamo = require('dynamodb');
    dynamo.AWS.config.loadFromPath('credentials.json');
const joi = require('joi');
// const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();
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

router.get('/:athlete', function(req, res) {
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
            result: data,
            params: req.params,
            date: date
        })
    });
});

module.exports = router;
