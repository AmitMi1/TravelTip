export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap
}
import { appController } from "../app.controller.js"
import { locService } from "./loc.service.js"
import { utilService } from "./util.service.js"

var gMap
var infoWindow
function initMap(lat = 32.0749831, lng = 34.9120554) {
    // debugger
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            addMapListener()
        })
}

function addMarker(loc, locName) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: locName
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}



function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB3stN2xyUcqTxDrMmu4T_WHL7sZSIQN-s' //Private API key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true;
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

function getMap() {
    return gMap
}

function addMapListener() {
    // var map = mapService.getMap()
    gMap.addListener("click", (mapsMouseEvent) => {
        var locationName = prompt('Enter location name')
        if (!locationName.trim()) return
        // gId = saveLocation(mapsMouseEvent.latLng, locationName)
        addMarker(mapsMouseEvent.latLng, locationName)
        debugger
        var time = Date.now()
        var location = {
            id: utilService.makeId(10),
            lat: mapsMouseEvent.latLng.lat(),
            lng: mapsMouseEvent.latLng.lng(),
            name: locationName,
            createdAt: time,
            updatedAt: time
        }
        locService.getLocs().then(locs => locs.push(location))
        // locService.createLoc(mapsMouseEvent.latLng, locationName)
        //     .then(res => loc = res)
        // locService.getLocs()
        //     .then(locs => locs.push[loc])
        // appController.saveLoc(mapsMouseEvent.latLng, locationName)
    })
    infoWindow = new google.maps.InfoWindow()
    // return Promise.resolve()
}

