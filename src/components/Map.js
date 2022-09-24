import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const mapOptions = {
    "tilt": 0,
    "heading": 0,
    "zoom": 18,
    "center": { lat: 35.6594945, lng: 139.6999859 }
}

function Map() {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyATUpEKpPAlWeS1aHmd4TnKqOjehT2eZ5Y"
    });

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: mapOptions.center.lat, lng: mapOptions.center.lng }}
            zoom={mapOptions.zoom}
        >
        </GoogleMap>
    ) : <></>
}

export default React.memo(Map)