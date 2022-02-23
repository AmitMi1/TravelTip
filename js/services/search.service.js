export const searchService {

}
const GEOCODE_API = 'AIzaSyC5hMbe-8DIFINoWf3CRnTZNAmbd07NxVs'

function search(input) {
    return axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC5hMbe-8DIFINoWf3CRnTZNAmbd07NxVs')
        .then(())
}