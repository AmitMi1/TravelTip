import { utilService } from './util.service.js'
import { locService } from './loc.service.js'

export const weatherService = {
    getWeather: getWeatherForLocation,
    // setWeatherForAll
}

const KEY = '5a14a6a860e9d68fa91c90933c51e1e3'

function getWeatherForLocation(location) {
    return axios
        .get(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&units=metric&APPID=${KEY}`)
        .then((res) => {
            return res.data
        })
        .then((res) => ({
            main: res.main,
            name: res.name,
            desc: res.weather[0].description,
            icon: res.weather[0].icon,
            wind: res.wind,
        }))
        .catch('Problem with API')
}

// function setWeatherForAll() {
//     locService.getLocs()
//         .then(locs => {
//             locs.forEach(loc => getWeatherForLocation(loc))
//                 .then(locs => {
//                     locService.saveToLocationDb(locs)
//                     return locs
//                 })
//         }

//         )
// }

//WEATHER API 404 DOESNT WORK PLEASE HELP