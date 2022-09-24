import { addButtons, dropdownPoint } from "./UI";
import { connectBluePoints } from "./drawPath";
import { setBlueDotArrayForDevData } from "./setBluePoints";
import "./styles.css";

function initMap() {
  const map = new window.google.maps.Map(document.getElementById("root"), {
    center: {
      lat: 35.6609342754636,
      lng: 139.729033427753,
    },
    zoom: 16,
    mapId: "90f87356969d889c",
  });

  var directionsService = new window.google.maps.DirectionsService();
  var directionsRender = new window.google.maps.DirectionsRenderer();
  directionsRender.setMap(map);
  connectBluePoints(directionsService, directionsRender);

  addButtons(map);

  const devData = require("./dev-data").devData;
  Object.values(devData).forEach(el => setBlueDotArrayForDevData(map, el));
  dropdownPoint(map);
}

window.initMap = initMap;
