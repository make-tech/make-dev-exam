'use strict';
// const AWS = require('aws-sdk');
require('dotenv').config();
const dynamo = require('dynamodb');
    dynamo.AWS.config.loadFromPath('credentials.json');
const joi = require('joi');
// const moment = require('moment-timezone');
const express = require('express');
const router = express.Router();

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

router.post('/', function(req, res) {
    gymBuddy.create({
        athlete: req.body.athlete,
        programName: req.body.programName,
        programDuration: req.body.programDuration,
        programDurationRaw: req.body.programDurationRaw,
        programSchedule: req.body.programSchedule,
        programExercises: req.body.programExercises
        },function (err, data) {
            if (err) {
                res.send({
                    result: err
                });
            }
            res.send({
                msg: 'Created ' + req.body.programName + ' program'
            });
        }
    );
});

module.exports = router;
