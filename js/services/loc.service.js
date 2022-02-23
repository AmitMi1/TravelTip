import { storageService } from "./storage.service.js";
export const locService = {
    getLocs,
    getLocationByName,
    getLocationByName,
    createLoc
}
const GEOCODE_API = 'AIzaSyCylbi9G13oxtzsUPHKLrXG_cDvKX1jjFU'
const KEY = 'locationsDb'
var locs = storageService.load(KEY) || []

function getLocs() {
    locs = storageService.load(KEY) || []
    return Promise.resolve(locs)
}


function createLoc(location, input) {
    var time = Date.now()
    return Promise.resolve({
        id: location.place_id,
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
        name: input,
        createdAt: time,
        updatedAt: time
    })
}

function getLocationByName(input) {
    locs = storageService.load(KEY) || []
    if (locs.length <= 0) {
        var idx = locs.findIndex(location => location.name === input)
        if (idx >= 0) return Promise.resolve(locs[idx])
    } else return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${GEOCODE_API}`)
        .then(res => res.data.results[0])
        .then(location => {
            return createLoc(location, input)
        })
        .then(location => {
            locs.push(location)
            storageService.save(KEY, locs)
            return location
        })
}