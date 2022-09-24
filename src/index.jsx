import axios from 'axios';
import "./styles.css";

const elevationApiUri = (key, location) => `https://maps.googleapis.com/maps/api/elevation/json?key=${key}&location=${location}`;
const directionApiUri = (dest, orig, key) => `https://maps.googleapis.com/maps/api/directions/json?origin=37.7680296,-122.4375126&destination=side_of_road:37.7663444,-122.4412006&key=${key}`

function initMap() {
  const map = new window.google.maps.Map(document.getElementById("root"), {
    center: {
      lat: 35.6609342754636,
      lng: 139.729033427753,
    },
    zoom: 16,
    heading: 320,
    tilt: 47.5,
    mapId: "90f87356969d889c",
  });

  addButtons(map);

  const devData = require("./dev-data").devData;
  console.log(devData);
  console.log(devData.dev1);
  setBlueDotArrayForDevData(map, devData.dev1);
  setBlueDotArrayForDevData(map, devData.dev2);
  setBlueDotArrayForDevData(map, devData.dev3);
  setBlueDotArrayForDevData(map, devData.dev4);
  setBlueDotArrayForDevData(map, devData.dev5);
  setBlueDotArrayForDevData(map, devData.dev6);
  setBlueDotArrayForDevData(map, devData.dev7);
  setBlueDotArrayForDevData(map, devData.dev8);
  setBlueDotArrayForDevData(map, devData.dev9);
  setBlueDotArrayForDevData(map, devData.dev10);
}

function addButtons(map) {
  const buttons = [
    ["Rotate Left", "rotate", 20, window.google.maps.ControlPosition.LEFT_CENTER],
    ["Rotate Right", "rotate", -20, window.google.maps.ControlPosition.RIGHT_CENTER],
    ["Tilt Down", "tilt", 20, window.google.maps.ControlPosition.TOP_CENTER],
    ["Tilt Up", "tilt", -20, window.google.maps.ControlPosition.BOTTOM_CENTER],
  ];

  buttons.forEach(([text, mode, amount, position]) => {
    const controlDiv = document.createElement("div");
    const controlUI = document.createElement("button");

    controlUI.classList.add("ui-button");
    controlUI.innerText = `${text}`;
    controlUI.addEventListener("click", () => {
      adjustMap(mode, amount);
    });
    controlDiv.appendChild(controlUI);
    map.controls[position].push(controlDiv);
  });

  const adjustMap = function (mode, amount) {
    switch (mode) {
      case "tilt":
        map.setTilt(map.getTilt() + amount);
        break;
      case "rotate":
        map.setHeading(map.getHeading() + amount);
        break;
      default:
        break;
    }
  };
}

function addHeatMapData(map) {
  const heatmapData = require("./heatmapData").data;
  var heatmap = new window.google.maps.visualization.HeatmapLayer({
    data: heatmapData
  });

  heatmap.setMap(map);
}

function setBlueDot(map, latLng, ha, va, contentString) {
  const scale = 5;
  var marker = new window.google.maps.Marker({
    position: latLng,
    map: map,
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: scale,
      fillOpacity: 1,
      fillColor: '#5384ED',
      strokeOpacity: 0
    },
    title: "Info Card"
  });

  var outerMarker = new window.google.maps.Marker({
    position: latLng,
    map: map,
    icon: {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: scale + 10 * (ha + va) / 2,
      fillOpacity: 0.5,
      strokeWeight: 2,
      fillColor: '#5384ED',
      strokeColor: '#ffffff',
    },
    title: "Info Card"
  })

  const infoWindow = new window.google.maps.InfoWindow({ content: contentString })

  marker.addListener("click", () => {
    infoWindow.open({
      anchor: marker,
      map,
      shouldFocus: false
    });
  });
}

async function drawPath(dest, orig, key) {
  await axios.get(directionApiUri(dest, orig, key)).then(res => {
    console.log(res.data);
  });
}

async function getElevation(loc, key) {
  await axios.get(elevationApiUri(key, loc)).then(res => {
    console.log(res.data);
  })
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function setBlueDotArrayForDevData(map, devData) {
  if (devData !== null) {
    devData.forEach(d => {
      let date = new Date(d.Timestamp);
      let contentString =
        '<div>' +
        '<h1>' + (d.id === undefined ? " " : d.id) + '</h1>' +
        '<div>' +
        "<p>" + (d.id === undefined ? " " : d.id) + "</p><p>Longitude: " + d.Longitude + "</p>" +
        "<p>Latitude: " + d.Latitude + "</p><p>Altitude: " + (d.Altitude | 0) + "</p>" +
        "<p>Date: " + date.getDay() + "/" + months[date.getMonth()] + "/" + date.getFullYear() + "</p>" +
        "<p>Floor: " + (d['Floor label'] | "None") + "</p>" +
        "<p>Horizontal accuracy: " + (d["Horizontal accuracy"]) + "</p>" +
        "<p>Vertical accuracy: " + d["Vertical accuracy"] + "</p>" +
        "<p>Confidence in location accuracy: " + d["Confidence in location accuracy"] + "</p>" +
        "<p>Activity: " + (d.Activity.toLowerCase()) + "</p>" +
        "</div>" +
        "</div>";
      setBlueDot(map, { lat: d.Latitude, lng: d.Longitude }, d["Horizontal accuracy"], d["Vertical accuracy"], contentString);
    });
  }
}

window.initMap = initMap;
