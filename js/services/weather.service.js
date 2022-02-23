import { utilService } from './util.service.js'
import { locService } from './loc.service.js'

export const { weatherService } = {
    locationWeather: getWeatherForLocation,
    setWeatherForAll
}

const KEY = '5a14a6a860e9d68fa91c90933c51e1e3'

function getWeatherForLocation(location) {
    return axios.get(`api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&appid=${KEY}`)
        .then(res => res.data.weather)
        .then(LocWeather => {
            location.weather = {
                status: LocWeather.main,
                temp: utilService(LocWeather.temp),
                icon: LocWeather.icon
            }
            return location
        })
}

function setWeatherForAll() {
    const locs = locService.getLocs()
        .then(locs => {
                locs.forEach(loc => getWeatherForLocation(loc))
                locService.saveToLocationDb(locs)
            }

        )
}