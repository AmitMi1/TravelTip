import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'


window.onload = onInit
window.onAddMarker = onAddMarker
// window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onSearch = onSearch
window.toggleModal = toggleModal
window.togglScreen = togglScreen
window.onCopyLink = onCopyLink
window.onDeleteLoc = onDeleteLoc
// window.onGoLoc = onGoLoc
window.togglScreen = togglScreen


function onInit() {
    getPosition()
        .then(pos => {
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
        })
        .catch(() => console.log('Error: cannot init map'))
}

function loadMapByUrl() {
    var hash = window.location.hash.substring(1);
    var result = hash.split('&').reduce(function (res, item) {
        var parts = item.split('=');
        res[parts[0]] = parts[1];
        return res;
    }, {});
    mapService.panTo(result.lat, result.lng)
}



function onCopyLink(event) {
    getPosition().then(pos => {
        window.location.hash = `lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
        navigator.clipboard.writeText(window.location.href);
    })
}
// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
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
                
                </div>
                `
            })
            document.querySelector('.loc-list').innerHTML = strHTMLs
        })
}

{/* <button onclick="onGoLoc()">Go</button> */ }

function onDeleteLoc(locId) {
    locService.getLocs().then(locs => {
        var locIdx = locs.findIndex(loc => loc.id = locId)
        locs.splice(locIdx, 1)
        locService.saveToLocationDb(locs)
        onGetLocs()
        mapService.deleteMarker(locIdx)
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
    locService.getLocationByName(elInputSearch.value)
        .then(location => {
            mapService.panTo(location.lat, location.lng)
            const pos = {
                lat: location.lat,
                lng: location.lng
            }
            mapService.addMarker(pos, elInputSearch.value)
        })
}

function togglScreen() {
    toggleModal()
}

function toggleModal() {
    document.querySelector('.modal').classList.toggle('fade-out')
    document.querySelector('.modal').classList.toggle('fade-in')
    document.body.classList.toggle("modal-open")
}