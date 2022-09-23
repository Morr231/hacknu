import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyATUpEKpPAlWeS1aHmd4TnKqOjehT2eZ5Y"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map);

        const webGLOverlayView = new window.google.maps.WebGLOverlayView();
        webGLOverlayView.onAdd = () => {};
        webGLOverlayView.onContextRestored = () => {};
        webGLOverlayView.onDraw = () => {};

        webGLOverlayView.setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >

            <></>
        </GoogleMap>
    ) : <></>
}

export default React.memo(Map)