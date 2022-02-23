import { storageService } from "./storage.service.js";
export const locService = {
    getLocs,
    getLocationByName
}
const KEY = 'locationsDb'
const locs = storageService.load(KEY) || {}

// const locs = [
//     { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//     { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
// ]

function getLocs() {
    return Promise.resolve(locs);
}

function getLocationByName(input) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${GEOCODE_API}`)
        .then(res => res.data)
        .then(location => ({
            id: location.place_id,
            name: input,
            lat: location.location.lat,
            lng: location.location.lng,
            createdAt: Date.now(),
            updatedAt: createdAt
        })).then(location => {
            locs[location.id] = location;
            storageService.save(KEY, locs);
            return location;
        })
}