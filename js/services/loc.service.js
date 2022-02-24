import { storageService } from "./storage.service.js";
export const locService = {
    getLocs,
    getLocByLatLng,
    getLocationByName,
    createLoc,
    saveToLocationDb
}
const GEOCODE_API = 'AIzaSyCylbi9G13oxtzsUPHKLrXG_cDvKX1jjFU'
const KEY = 'locationsDb'


function saveToLocationDb(locs) {
    storageService.save(KEY, locs)
}

function loadLocations() {
    return storageService.load(KEY)
}


function getLocs() {
    const locs = storageService.load(KEY) || []
    return Promise.resolve(locs)
}


function createLoc(location, input, lat, lng, name, icon) {
    var time = Date.now()
    if (lat && lng) {
        return Promise.resolve({
            id: location.place_id,
            lat,
            lng,
            name,
            createdAt: time,
            updatedAt: time,
            icon
        })
    }

    return Promise.resolve({
        id: location.place_id,
        lat: location.geometry.location.lat,
        lng: location.geometry.location.lng,
        name: input,
        createdAt: time,
        updatedAt: time,
        icon
    })
}

function getLocByLatLng(lat, lng, name, icon) {
    const locs = storageService.load(KEY) || []
    if (locs.length) {
        var idx = locs.findIndex(location => (location.lat === lat && location.lng === lng))
        if (idx >= 0) return Promise.resolve(locs[idx])
    }
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEOCODE_API}`)
        .then(res => res.data.results[0])
        .then(location => {
            return createLoc(location, null, lat, lng, name, icon)
        })
        .then(location => {
            locs.push(location)
            saveToLocationDb(locs)
        })
}

function getLocationByName(input, icon) {
    const locs = storageService.load(KEY) || []
    if (locs.length) {
        var idx = locs.findIndex(location => location.name === input)
        if (idx >= 0) return Promise.resolve(locs[idx])
    }
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${GEOCODE_API}`)
        .then(res => res.data.results[0])
        .then(location => {
            return createLoc(location, input, null, null, null, icon)
        })
        .then(location => {
            locs.push(location)
            saveToLocationDb(locs)
            return location
        })
}