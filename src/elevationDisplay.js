export function displayLocationElevation(location, elevator) {
    elevator
    .getElevationForLocations({
      locations: [location],
    })
    .then(({ results }) => {
    });
}