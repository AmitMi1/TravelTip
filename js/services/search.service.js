import locService from 'loc.service.js'

export const searchService = {
    getPosByName: getLocationByName,
}
const GEOCODE_API = 'AIzaSyC5hMbe-8DIFINoWf3CRnTZNAmbd07NxVs'

function getLocationByName(input) {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${GEOCODE_API}`)
        .then(res => res.data.location)
}

//id,name,lat,lng,createdAt,updatedAt



// https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY