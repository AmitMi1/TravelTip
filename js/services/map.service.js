export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    deleteMarker
}
import { locService } from "./loc.service.js"
import { storageService } from "./storage.service.js"
import { utilService } from "./util.service.js"

const KEY = 'locationsDb'
var gIcon = "images/default.png"
var gMarkers = []
var gMap
var infoWindow

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            addMapListener()
            // addIconListener()
            locService.getLocs().then(locs => {
                if (!locs.length) return
                addMarkers(locs)
            })
        })
}

function addIconListener() {
    var elIcons = document.querySelectorAll('.icon')
    elIcons.forEach(icon => {
        icon.addEventListener("click", function () {
            gIcon = icon.src
        })
    })
}

function addMarker(loc, locName, loc.icon) {
    // console.log(loc)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: locName,
        icon: loc.icon
    })
    gMarkers.push(marker)
    return marker
}

function deleteMarker(markerIdx) {
    gMarkers[markerIdx].setMap(null)
    gMarkers.splice(markerIdx, 1)
}

function addMarkers(locs) {
    locs.forEach(loc => {
        addMarker({
            lat: loc.lat,
            lng: loc.lng,
        }, loc.name, loc.icon)
    })
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB3stN2xyUcqTxDrMmu4T_WHL7sZSIQN-s'
<<<<<<< HEAD
    //Private API key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
=======
        //Private API key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `
                    https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
>>>>>>> 413b6f7f2e7965d0f76814b8712c304183a61e90
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
        locService.getLocByLatLng(
            mapsMouseEvent.latLng.lat(),
            mapsMouseEvent.latLng.lng(),
            locationName
        )
        addMarker(mapsMouseEvent.latLng, locationName)


        // locService.createLoc(mapsMouseEvent.latLng, locationName)
        //     .then(res => loc = res)
        // locService.getLocs()
        //     .then(locs => locs.push[loc])
        // appController.saveLoc(mapsMouseEvent.latLng, locationName)
    })
    infoWindow = new google.maps.InfoWindow()
    // return Promise.resolve()
}