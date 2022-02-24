import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'
import { storageService } from './services/storage.service.js'
export const cont = {
    getIcon,
    flashMsg
}


var gIcon = "images/default.png"


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
    var elLocList = document.querySelector('.loc-list')
    locService.getLocs()
        .then(locs => {
            if (!locs.length) {
                elLocList.innerHTML = `<h4>No locations yet...</h4>`
                return
            }
            var strHTMLs = ''
            locs.forEach(loc => {
                var date = new Date(loc.createdAt)
                date.toDateString()
                strHTMLs += `
                <div class="loc-info">
                <div class="name">${loc.name}</div>
                <div>
                <span>${loc.lat}</span>
                <span>${loc.lng}</span>
                </div>
                <span>${date}</span>
                <div>
                <button onclick="onDeleteLoc('${loc.id}')"><i class="fa-solid fa-ban"></i></button>
                <button onclick="onGoLoc('${loc.id}');toggleScreen()"><i class="fa-solid fa-arrow-up-right-from-square"></i></button> 
                </div>
                </div>
                `
            })
            elLocList.innerHTML = strHTMLs
        })
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