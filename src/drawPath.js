function drawPath(map, service, render, origin, dest, travelMode, waypoints) {
    const request = {
        origin: origin,
        destination: dest,
        travelMode: travelMode,
        waypoints: waypoints,
        optimizeWaypoints: true
    };

    service.route(request)
        .then(result => render.setDirections(result))
        .catch(() => {
            const routeCoords = [];
            routeCoords.push(origin);
            routeCoords.push(...waypoints.map(wp => wp.location));
            routeCoords.push(dest);

            const path = new window.google.maps.Polyline({
                path: routeCoords,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            path.setMap(map);
        });
}

export function calculateAndDisplayRoutes(map, service, render) {
    let devData = require("./dev-data").devData;
    Object.values(devData)
        .forEach((people) => {
            const names = [...new Set(people.map(p => p.Identifier))];
            names.forEach(name => {
                if (!name) return;
                let args = pathArgs(people.filter(person => person.Identifier === name));
                drawPath(map, service, render, ...args);
            })
        });
}

function pathArgs(people) {
    const travelModes = window.google.maps.TravelMode;
    const modes = [travelModes.BICYCLING, travelModes.DRIVING, travelModes.TRANSIT, travelModes.WALKING];

    const origin = new window.google.maps.LatLng(people[0].Latitude, people[0].Longitude);
    const dest = new window.google.maps.LatLng(people[people.length - 1].Latitude, people[people.length - 1].Longitude);
    let waypoints = [];

    people.forEach(p => {
        waypoints.push({
            location: new window.google.maps.LatLng({ lat: p.Latitude, lng: p.Longitude }),
            stopover: true,
        });
    });

    let travelMode = people[0].Activity.toUpperCase();
    if (modes.includes(travelMode) === false) {
        if (travelMode === "CYCLING")
            travelMode = travelModes.BICYCLING;
        else if (travelMode === "RUNNING")
            travelMode = travelModes.WALKING;
        else travelMode = travelModes.DRIVING;
    }

    return [origin, dest, travelMode, waypoints, people[0].Identifier];
}