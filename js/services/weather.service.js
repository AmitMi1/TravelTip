import { utilService } from './util.service.js'
import { locService } from './loc.service.js'

export const weatherService = {
    getWeatherForLocation,
    setWeatherForAll
}

const KEY = '5a14a6a860e9d68fa91c90933c51e1e3'

function getWeatherForLocation(location) {
    return axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${KEY}`)
        .then(res => res.data.weather[0])
        .then(LocWeather => {
            location.weather = {
                status: LocWeather.main,
                temp: utilService.tempConvert(LocWeather.temp),
                icon: LocWeather.icon
            }
            return location
        })
        .catch(console.log('Doesnt work'))
}

function setWeatherForAll() {
    locService.getLocs()
        .then(locs => {
            locs.forEach(loc => getWeatherForLocation(loc))
                .then(locs => {
                    locService.saveToLocationDb(locs)
                    return locs
                })
        }

        )
}

//WEATHER API 404 DOESNT WORK PLEASE HELP