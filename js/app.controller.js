import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { weatherService } from './services/weather.service.js'
import { storageService } from './services/storage.service.js'
export const cont = {
    getIcon
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
    // console.log(typeof(elImg.id))
    gIcon = elImg.id
}

function loadByUrl() {
    var hash = window.location.hash.substring(1);
    var result = hash.split('&').reduce(function(res, item) {
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
        // .then(locs => weatherService.setWeatherForAll())
        .then(locs => {
            if (!locs.length) {
                elLocList.innerHTML = `<h4>No locations yet...</h4>`
                return
            }
            var strHTMLs = ''
            locs.forEach(loc => {
                console.log(loc)
                strHTMLs += `
                <div class="loc-info">
                <span>${loc.name}</span>
                <span>${loc.lat}</span>
                <span>${loc.lng}</span>
                <span>${loc.createdAt}</span>
                <button onclick="onDeleteLoc('${loc.id}')">Del</button>
                <button onclick="onGoLoc('${loc.id}');toggleScreen()">Go</button> 
                </div>
                `
            })
            elLocList.innerHTML = strHTMLs
        })
}


function onDeleteLoc(locId) {
    console.log(locId)
    locService.getLocs().then(locs => {
        var locIdx = locs.findIndex(loc => loc.id === locId)
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
            // console.log('User position is:', pos.coords);
            mapService.panTo(pos.coords.latitude, pos.coords.longitude)
            var latlang = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude
                }
                // mapService.addMarker(latlang)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

// function onPanTo() {
//     console.log('Panning the Map');
//     mapService.panTo(35.6895, 139.6917);
// }

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