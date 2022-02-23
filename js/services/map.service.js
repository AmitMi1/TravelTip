export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap
}
import { appController } from "../app.controller.js"
import { locService } from "./loc.service.js"
import { storageService } from "./storage.service.js"
import { utilService } from "./util.service.js"

const KEY = 'locationsDb'

var gMap
var infoWindow

function initMap(lat = 32.0749831, lng = 34.9120554) {
    // debugger
    return _connectGoogleApi()
        .then(() => {
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            addMapListener()
            locService.getLocs().then(locs => addMarkers(locs))
        })
}

function addMarker(loc, locName) {
    // console.log(loc)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: locName
    })
    return marker
}

function addMarkers(locs) {
    locs.forEach(loc => {
        addMarker({
            lat: loc.lat,
            lng: loc.lng,
        }, loc.name)
    })
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