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


        const time2 = '1.30';
        const [hours1, minutes1] = req.body.time.split('.');
        const [hours2, minutes2] = time2.split('.');
        const totalMinutes = Number(minutes1) + Number(minutes2);
        const totalHours = Number(hours1) + Number(hours2) + Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        const newHours = totalHours % 24;
        const Maxtime = `${newHours}.${newMinutes}`;

        console.log(Maxtime)

        const filteredStations = jresponse.data.map(obj => ({
            source_stn_name: obj.source_stn_name,
            depart: obj.depart
        })).filter(obj => Number(obj.depart) > Number(Maxtime));

        res.status(200).json(filteredStations)

    } catch (err) {
        console.log(err);
        res.status(500).send('Internal server error');
    }
});



module.exports = stationsRouter