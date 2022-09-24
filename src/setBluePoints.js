export function setBlueDotArrayForDevData(map, devData) {
    if (devData !== null) {
        devData.forEach((d, index) => {
            let date = new Date(d.Timestamp);
            let contentString =
                '<div>' +
                '<h1>' + (d.Identifier === null ? " " : d.Identifier) + '</h1>' +
                '<div>' +
                "<p>" + (d.Identifier === null ? " " : d.Identifier) + "</p><p>Longitude: " + d.Longitude + "</p>" +
                "<p>Latitude: " + d.Latitude + "</p><p>Altitude: " + (d.Altitude | 0) + "</p>" +
                "<p>Date: " + date.getDay() + "/" + months[date.getMonth()] + "/" + date.getFullYear() + "</p>" +
                "<p>Floor: " + (d['Floor label'] | "None") + "</p>" +
                "<p>Horizontal accuracy: " + (d["Horizontal accuracy"]) + "</p>" +
                "<p>Vertical accuracy: " + d["Vertical accuracy"] + "</p>" +
                "<p>Confidence in location accuracy: " + d["Confidence in location accuracy"] + "</p>" +
                "<p>Activity: " + (d.Activity.toLowerCase()) + "</p>" +
                "</div>" +
                "</div>";
            setBlueDot(
                map,
                { lat: d.Latitude, lng: d.Longitude },
                d["Horizontal accuracy"],
                d["Vertical accuracy"],
                d["Confidence in location accuracy"],
                contentString
            );
        });
    }
}

function setBlueDot(map, latLng, ha, va, cona, contentString) {
    const scale = 10;
    var marker = new window.google.maps.Marker({
        position: latLng,
        map: map,
        optimized: true,
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#5384ED',
            scale: scale,
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
        },
        title: "Info Card"
    });

    const infoWindow = new window.google.maps.InfoWindow({ content: contentString })

    marker.addListener("click", () => {
        infoWindow.open({
            anchor: marker,
            map,
            shouldFocus: false
        });
    });

    var outerMarker = new window.google.maps.Marker({
        position: latLng,
        map: map,
        icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#5384ED',
            fillOpacity: 0.5,
            strokeWeight: 2,
            strokeColor: '#ffffff',
        }
    });
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
