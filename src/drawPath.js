function drawPath(service, render, origin, dest, travelMode, waypoints) {
    const request = {
        origin: origin,
        destination: dest,
        travelMode: travelMode,
        waypoints: waypoints
    };

    service.route(request, function (result, status) {
        if (status === 'OK')
            render.setDirections(result);
    });
}



export function connectBluePoints(service, render) {
    let devData = require("./dev-data").devData;
    Object.values(devData).filter(d => d.length > 1)
        .forEach(person => {
            console.log("a")
            const origin = new window.google.maps.LatLng(person[0].Latitude, person[0].Longitude);
            const dest = new window.google.maps.LatLng(person[person.length - 1].Latitude, person[person.length - 1].Longitude);
            let waypoints = [];

            person.forEach(p => {
                waypoints.push({
                    location: new window.google.maps.LatLng(p.Latitude, p.Longitude),
                    stopover: false
                });
            });

            const travelMode = ["DRIVING", "BICYCLING", "TRANSIT", "WALKING"].includes(person[0].Activity.toUpperCase())
                ? person[0].Activity.toUpperCase() : "WALKING";
            drawPath(
                service,
                render,
                origin,
                dest,
                travelMode,
                waypoints
            )
        });
}