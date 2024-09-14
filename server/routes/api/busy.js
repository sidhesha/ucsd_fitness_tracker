const express = require('express');
const router = express.Router();
const cache = require('memory-cache');
const axios = require('axios');

const LIVE_DATA_URL = 'https://waitz.io/live/ucsd';
const LIVE_DATA_STALE = 3*60*1000;  // 3 minutes
const COMPARE_DATA_URL = 'https://waitz.io/compare/ucsd';
const COMPARE_DATA_STALE = 60*60*1000; // 1 hour
const REQUEST_TIMEOUT = 8000; // 8 seconds

const dataKey = 'data';

// Filter out only the fields we care about 
function filterData(data) {
    if (data.comparison) {
        return {
            "name": data.name,
            "busyness": data.busyness,
            "isOpen": data.isOpen,
            "comparison": {
                // next hour/day is less (value=-1), equal (value=0), or more (value=1) busy
                "hour" : data.comparison.find(comparison => comparison.trend == "hour").value, 
                "day": data.comparison.find(comparison => comparison.trend == "day").value
            },
            "peak": data.comparison.find(comparison => comparison.trend == "peak").value
        }
    } else {
        return {
            "name": data.name,
            "busyness": data.busyness,
            "isOpen": data.isOpen
        }
    }
}

// Enum mapping URL query to location
const Location = Object.freeze({
    RIMAC: "rimac",
    MAIN_GYM: "main",
})

// Map from enum to data source IDs
const locationIDs = new Map()
    .set(Location.RIMAC, 12)
    .set(Location.MAIN_GYM, 13)

// Filter out relevant locations from the JSONs returned by the resource URLs
function parseData(data) {
    return data
        .filter(location => Array.from(locationIDs.values()).some(locationID => locationID == location.id)) // Filter out the relevant locations
        .reduce((acc, location) => { // Combine into one object keyed by id
            acc[location.id] = location;
            return acc;
        }, {})
}

async function populateCaches() {
    // Cache live data
    if (cache.get(COMPARE_DATA_URL) === null) {
        await axios.get(COMPARE_DATA_URL, {
            timeout: REQUEST_TIMEOUT
        }).then(res => {
            if (res.data) {
                cache.put(COMPARE_DATA_URL, parseData(res.data.data), COMPARE_DATA_STALE)
            } else {
                throw new Error("Retrieved data was invalid")
            }
        }).catch(err => {
            console.log(err)
        })
    } 
    
    // Cache compare data
    if (cache.get(LIVE_DATA_URL) === null) {
        await axios.get(LIVE_DATA_URL, {
            timeout: REQUEST_TIMEOUT
        }).then(res => {
            if (res.data) {
                cache.put(LIVE_DATA_URL, parseData(res.data.data), LIVE_DATA_STALE)
            } else {
                throw new Error("Retrieved data was invalid")
            }
        }).catch(err => {
            console.log(err)
        })
    } 

    if (cache.get(dataKey) === null) {
        let data = Array.from(locationIDs.entries()).reduce((acc, [location, locationID]) => {
            acc[location] = filterData({
                ...cache.get(LIVE_DATA_URL)[locationID],
                ...cache.get(COMPARE_DATA_URL)[locationID]
            })
            return acc;
        }, {})
        cache.put(dataKey, data, LIVE_DATA_STALE);
    }
}

/* /api/busy/* endpoint controllers */
router.get('/:location', async (req, res) => { // Return the busyness data of the specified location
    switch(req.params.location) {
        case Location.RIMAC: 
        case Location.MAIN_GYM:
            await populateCaches();
            let data = cache.get(dataKey)[req.params.location];
            if (data) {
                res.status(200).json(data)
                break
            }
        default:
            res.status(404).json({success: false, message: "Invalid location"})
    }
});

router.get('/', async (req, res) => { // Return the busyness data of all locations
    await populateCaches();
    res.status(200).json(Object.values(cache.get(dataKey)))
})

module.exports = router;
