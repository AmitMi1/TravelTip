export const mapService = {
    initMap,
    addMarker,
    panTo,
    getMap,
    deleteMarker
}
import { locService } from "./loc.service.js"
import { cont } from "../app.controller.js"

const KEY = 'locationsDb'
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
            locService.getLocs().then(locs => {
                if (!locs.length) return
                addMarkers(locs)
            })
        })
}

function addMarker(loc, locName, icon) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: locName,
        icon: icon
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
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyB3stN2xyUcqTxDrMmu4T_WHL7sZSIQN-s'
    //Private API key
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
    gMap.addListener("click", (mapsMouseEvent) => {
        var locationName = prompt('Enter location name')
        if (!locationName.trim()) return
        locService.getLocByLatLng(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng(), locationName, cont.getIcon())
        addMarker(mapsMouseEvent.latLng, locationName, cont.getIcon())
        cont.flashMsg(`Location ${locationName} added`)
    })
    infoWindow = new google.maps.InfoWindow()
}