export function addButtons(map) {
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

export function dropdownPoint(map) {
    const container = document.createElement('div');
    const dropdownMenu = document.createElement('select');

    const devData = require("./dev-data").devData;
    Object.values(devData).forEach(d => {
        let unique = [...new Set(d.map(item => item.Identifier))];
        unique.forEach(el => {
            if (el) {
                const option = document.createElement("option");
                option.innerText = el;
                option.value = [d[0].Latitude, d[0].Longitude];
                dropdownMenu.appendChild(option);
            }
        })
    });

    dropdownMenu.addEventListener("change", (e) => {
        map.panTo(new window.google.maps.LatLng(
            parseFloat(e.target.value.split(',')[0]), parseFloat(e.target.value.split(',')[1]))
        );
    });

    container.appendChild(dropdownMenu);
    container.style.marginRight = "10px";

    map.controls[window.google.maps.ControlPosition.RIGHT_TOP].push(container);
}