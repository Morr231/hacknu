import "./styles.css";

function initMap() {
  const map = new window.google.maps.Map(document.getElementById("root"), {
    center: {
      lat: 37.7893719,
      lng: -122.3942,
    },
    zoom: 16,
    heading: 320,
    tilt: 47.5,
    mapId: "90f87356969d889c",
  });
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

window.initMap = initMap;
