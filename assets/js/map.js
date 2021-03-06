 /* this document was copied from multiple sections of googlemaps documentation for javaScript and modified */
function CoordMapType(tileSize) {
    this.tileSize = tileSize;
}
/* function to assemble Windmap Url for the current tile, and add the corresponding image
as a backgroundimage to a div that can later be layered ontop of map tiles */
CoordMapType.prototype.getTile = function (coord, zoom, ownerDocument) {
    var div = ownerDocument.createElement('div');
    var windurl = "https://tile.openweathermap.org/map/wind_new/" + zoom + "/" + coord.x + "/" + coord.y + ".png?appid=" + OpenWeatherKey;
    div.style.width = this.tileSize.width + 'px';
    div.style.height = this.tileSize.height + 'px';
    div.style.backgroundImage = "url('" + windurl + "')";
    return div;

};
/* function to initilaise map, is called from main.js once the contend of the DOM is loaded*/
function initMap() {
    var map = new google.maps.Map(document.getElementById('map-div'), {
        zoom: 3,
        center: {
            lat: 41.850,
            lng: -0.650
        },
        mapTypeControl: false
    });
/*      Insert this overlay map type as the first overlay map type at
     position 0. Note that all overlay map types appear on top of
     their parent base map. */
    map.overlayMapTypes.insertAt(
        0, new CoordMapType(new google.maps.Size(256, 256)));

        
     /* Function that responds to a click on the map by filling out the lat,long seacrh field with corresponding coordinates */
    map.addListener('click', function (e) {
        $('#lat-long').val(e.latLng.lat() + "," + e.latLng.lng());
    });

    /*  Add a Autocomplete search bar to the top left of the map, when a place is selected,
     the map zoomes in on it and the forecast for that location is collected and displayed */
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    var autocomplete = new google.maps.places.Autocomplete(input);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });
    autocomplete.addListener('place_changed', function () {
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        /* If the place has a geometry, then present it on a map. */
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(13);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        let location = place.geometry.location.lat() + "," + place.geometry.location.lng();
        let input = new inputBuilder(location);

        if ($("#source").children("option:selected").val() == 1) {
            let worldWeatherOnlineData = new weatherDataMatrix();
            JSONP_MarineWeather(input, worldWeatherOnlineData);

        } else if ($("#source").children("option:selected").val() == 2) {
            let openWeatherData = new weatherDataMatrix();
            JSONP_openWeather(input, openWeatherData);
        };
    });
}