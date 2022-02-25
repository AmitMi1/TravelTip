import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'
export const cont = {
    getIcon,
    flashMsg
}


var gIcon = "images/default.png"
var gIsDark = false


window.onload = onInit
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.toggleModal = toggleModal
window.toggleScreen = toggleScreen
window.onCopyLink = onCopyLink
window.onDeleteLoc = onDeleteLoc
window.onGoLoc = onGoLoc
window.onIconClick = onIconClick
window.onShowWeather = onShowWeather
window.onDarkMode = onDarkMode



function onInit() {
    var result = loadByUrl();
    if (!result.lat || !result.lng) {
        getPosition()
            .then(pos => {
                mapService.initMap(pos.coords.latitude, pos.coords.longitude)
            })
            .catch(() => console.log('Error: cannot init map'))
    } else {
        mapService.initMap(+result.lat, +result.lng)
    }
}

function getIcon() {
    return gIcon
}

function onIconClick(elImg) {
    gIcon = elImg.id
    flashMsg('Marker picked')
}

function loadByUrl() {
    var hash = window.location.hash.substring(1);
    var result = hash.split('&').reduce(function (res, item) {
        var parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});
    return result
}
// http: //127.0.0.1:5500/index.html#lat=32.184781&lng=34.871326
function onCopyLink() {
    Promise.resolve(mapService.getMap().getCenter())
        .then(pos => {
            window.location.hash = `lat=${pos.lat()}&lng=${pos.lng()}`
            navigator.clipboard.writeText(window.location.href);
            flashMsg('Link copied to clipboard')
        })
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function onGetLocs() {
    var elModal = document.querySelector('.modal-container')
    elModal.classList.remove('weather')
    var strHTMLs = `
    <h2>Locations</h2>
    <ul class="clean-list loc-list">
    </ul>`
    locService.getLocs()
        .then(locs => {
            if (!locs.length) {
                elModal.innerHTML = `
                <h2>Locations</h2>
                <h4>No locations yet...</h4>`
                return
            }
            locs.forEach(loc => {
                var date = new Date(loc.createdAt)
                date.toDateString()
                strHTMLs += `
                <div class="loc-info">
                <div class="name">${loc.name}</div>
                <div>
                <span>Coords: ${loc.lat}</span>
                <span>${loc.lng}</span>
                </div>
                <span>Created At: ${moment(date).format("DD / MM / YYYY h:mm:ss")}</span>
                <div>
                <button onclick="onDeleteLoc('${loc.id}')"><i class="fa-solid fa-ban"></i></button>
                <button onclick="onGoLoc('${loc.id}');toggleScreen()"><i class="fa-solid fa-arrow-up-right-from-square"></i></button> 
                <button onclick="onShowWeather('${loc.id}');"><i class="fa-solid fa-cloud-sun-rain"></i></button> 
                </div>
                </div>
                `
            })
            elModal.innerHTML = strHTMLs
        })
}

function renderWeather(weather, locId) {
    // debugger
    var elModal = document.querySelector('.modal-container')
    elModal.classList.add('weather')
    elModal.innerHTML = ''
    var img = new Image
    img.onload = (() => {
        elModal.innerHTML = `
        <section class="weather-title">
        <h3>${weather.name}</h3>
    <br>
    <section class="weather-desc" flex align-center space-around">${weather.desc}
<img class="weather-img" src="${img.src}" width="100px" height="100px"></section>
    <div>${weather.main.temp}℃ 
    <span>(feels like: ${weather.main.feels_like})</span>
    </div>
    </section>

<section><div>Degrees from ${weather.main.temp_min} to ${weather.main.temp_max}</div>
<div>Wind ${weather.wind.speed}m/s</div>
</section>
<section>${weather.main.humidity}% humidity</section>
<div>
<button onclick="onGetLocs()" class="btn-back"><i class="fa-solid fa-angles-left"></i></button>
<button class="btn-go" onclick="onGoLoc('${locId}');toggleScreen()"><i class="fa-solid fa-arrow-up-right-from-square"></i></button> 
</div>
`})
    img.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`

}


function onDeleteLoc(locId) {
    locService.getLocs().then(locs => {
        var locIdx = locs.findIndex(loc => loc.id === locId)
        flashMsg(`Location ${locs[locIdx].name} deleted`)
        locs.splice(locIdx, 1)
        locService.saveToLocationDb(locs)
        onGetLocs()
        mapService.deleteMarker(locIdx)

    })
}

function onGoLoc(locId) {
    locService.getLocs().then(locs => {
        var locIdx = locs.findIndex(loc => loc.id === locId)
        mapService.panTo(locs[locIdx])
    })
}

function onShowWeather(locId) {
    locService.getLocs().then(locs => {
        var locIdx = locs.findIndex(loc => loc.id === locId)
        weatherService.getWeather(locs[locIdx]).then(weather => renderWeather(weather, locId))
    })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            var latlang = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude
            }
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
            flashMsg('Current location')
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onSearch(ev) {
    if (ev) ev.preventDefault()
    const elInputSearch = document.querySelector('input[name=search]')
    locService.getLocationByName(elInputSearch.value, gIcon)
        .then(location => {
            mapService.panTo(location.lat, location.lng)
            const pos = {
                lat: location.lat,
                lng: location.lng
            }
            mapService.addMarker(pos, elInputSearch.value, gIcon)
            flashMsg(`Location ${elInputSearch.value} added`)
            document.querySelector('input[name = search]').value = ''

        })
}

function toggleScreen() {
    toggleModal()
}

function toggleModal() {
    document.querySelector('.modal').classList.toggle('fade-out')
    document.querySelector('.modal').classList.toggle('fade-in')
    document.body.classList.toggle("modal-open")
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onDarkMode() {
    if (!gIsDark) {
        document.documentElement.style.setProperty('--clr4', '#d8d8d8d5')
        document.documentElement.style.setProperty('--clr2', '#d1d1d1')
        document.documentElement.style.setProperty('--clr1', '#1f1f1fcc')
        gIsDark = !gIsDark
        flashMsg('Dark mode off')
    } else {
        document.documentElement.style.setProperty('--clr4', '#3a3a3a')
        document.documentElement.style.setProperty('--clr2', '#313131')
        document.documentElement.style.setProperty('--clr1', '#cacaca')
        gIsDark = !gIsDark
        flashMsg('Dark mode on')
    }
}