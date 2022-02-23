import { storageService } from "./storage.service.js";
export const locService = {
    getLocs,
    getLocationByName
}
const GEOCODE_API = 'AIzaSyCylbi9G13oxtzsUPHKLrXG_cDvKX1jjFU'
const KEY = 'locationsDb'
const locs = storageService.load(KEY) || {}

function getLocs() {
    return Promise.resolve(locs);
}


function createLoc(location, input) {
    console.log(location)
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
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${GEOCODE_API}`)
        .then(res => res.data.results[0])
        .then(location => {
            console.log(location)
            return createLoc(location, input)
        })
        .then(location => {
            console.log(location)
            locs[location.id] = location;
            storageService.save(KEY, locs);
            return location;
        })
}