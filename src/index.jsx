import { addButtons, dropdownPoint } from "./UI";
import { calculateAndDisplayRoutes } from "./drawPath";
import { setBlueDotArrayForDevData } from "./setBluePoints";
import "./styles.css";
import { setWebGLOverlayView } from "./webGlOverlayViewSettings";

function initMap() {
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRender = new window.google.maps.DirectionsRenderer();

  const elevationService = new window.google.maps.ElevationService();
  const webGLOverlayView = new window.google.maps.WebGLOverlayView();

  const map = new window.google.maps.Map(document.getElementById("root"), {
    center: {
      lat: 35.6609342754636,
      lng: 139.729033427753,
    },
    zoom: 16,
    mapId: "90f87356969d889c",
  });
  directionsRender.setMap(map);
  webGLOverlayView.setMap(map);
  
  calculateAndDisplayRoutes(map, directionsService, directionsRender);

  addButtons(map);

  setWebGLOverlayView(map, { center: map.getCenter() }, webGLOverlayView);

  const devData = require("./dev-data").devData;
  Object.values(devData).forEach(el => setBlueDotArrayForDevData(map, el));
  dropdownPoint(map);
}

window.initMap = initMap;
