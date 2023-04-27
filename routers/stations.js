const jwt = require('jsonwebtoken')
const axios = require('axios')

const stationsRouter = require('express').Router()
const User = require('../models/user')
require('dotenv').config()

const https = require('https');
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.API_KEY,
  Promise: Promise
});

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

stationsRouter.get('/station', (req, res) => {
    const stationName = req.query.name;

    if (!stationName) {
        return res.status(400).send('Missing required parameter: name');
    }

    const options = {
        hostname: 'maps.googleapis.com',
        port: 443,
        path: `/maps/api/geocode/json?address=${encodeURIComponent(stationName)}&key=${process.env.API_KEY}`,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const location = JSON.parse(data).results[0].geometry.location;

            // Get the top 5 nearest restaurants
            googleMapsClient.placesNearby({
                    location: `${location.lat},${location.lng}`,
                    rankby: 'distance',
                    type: 'restaurant'
                }).asPromise()
                .then((response) => {
                    const results = response.json.results.slice(0, 5); // get the top 5 results
                    const restaurants = results.map((result) => ({
                        name: result.name,
                        address: result.vicinity,
                        rating: result.rating,
                        location: result.geometry.location
                    }));

                    // Combine the station location and the restaurant information into one object
                    const data = {
                        station: {
                            name: stationName,
                            location: location
                        },
                        restaurants: restaurants
                    };

                    res.json(data.restaurants);
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).send('Internal Server Error');
                });
        });
    });

    request.on('error', (error) => {
        console.error(error);
        res.status(500).send('Internal Server Error');
    });

    request.end();
});




module.exports = stationsRouter