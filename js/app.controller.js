import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { searchService } from './services/search.service'
import { storageService } from './services/storage.service.js'

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onPanTo = onPanTo;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
    getPosition()
        .then(pos => {
            console.log('Map is ready')
            mapService.initMap(pos.coords.latitude, pos.coords.longitude)
            // addMapListener()
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker');
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            document.querySelector('.locs').innerText = JSON.stringify(locs)
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
            mapService.addMarker(latlang)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function onPanTo() {
    console.log('Panning the Map');
    mapService.panTo(35.6895, 139.6917);
}


function onSaveLocation(location, locationName, id) {
    // console.log(location.lat())
    // return
    marker = new google.maps.Marker({
        position: location,
        gMap,
        title: locationName,
    })
    saveMarker(marker)
    // if (!gId) gId = id
    if (id) gId = id
    document.querySelector('.location-list').innerHTML += `<li data-id=${gId}>${locationName}
    <button data-id=${gId} onclick="onRemoveLocation(this)">x</button>
    </li>
    `
    console.log('gid', gId)
}
