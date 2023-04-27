const jwt = require('jsonwebtoken')
const axios = require('axios')

const stationsRouter = require('express').Router()
const User = require('../models/user')
require('dotenv').config()

stationsRouter.get('/stations', async (req, res) => {
    try {
        const trainNo = req.body.trainNo;

        const response = await fetch(`https://indian-railway-api.cyclic.app/trains/getRoute?trainNo=${trainNo}`);
        jresponse = await response.json();
        const stations = jresponse.data.map(obj => ({
            source_stn_name: obj.source_stn_name,
            depart: obj.depart
        }))

        res.status(200).json(stations)

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});



module.exports = stationsRouter