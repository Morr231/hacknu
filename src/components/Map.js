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

    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(mapOptions.center);
        map.fitBounds(bounds);
        initWebGLOverlayView(map);
        setMap(map);
    }, []);

    function initWebGLOverlayView(map) {  
        let scene, renderer, camera, loader;
        const webGLOverlayView = new window.google.maps.WebGLOverlayView();
        
        webGLOverlayView.onAdd = () => {
          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera();
          const ambientLight = new THREE.AmbientLight( 0xffffff, 0.75 );
          scene.add(ambientLight);
          const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
          directionalLight.position.set(0.5, -1, 0.5);
          scene.add(directionalLight);
        
          loader = new GLTFLoader();               
          const source = "pin.gltf";
          loader.load(
            source,
            gltf => {      
              gltf.scene.scale.set(25,25,25);
              gltf.scene.rotation.x = 180 * Math.PI/180;
              scene.add(gltf.scene);           
            }
          );
        }
        
        webGLOverlayView.onContextRestored = ({gl}) => {
          renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            context: gl,
            ...gl.getContextAttributes(),
          });
          renderer.autoClear = false;
      
          loader.manager.onLoad = () => {        
            renderer.setAnimationLoop(() => {
              map.moveCamera({
                "tilt": mapOptions.tilt,
                "heading": mapOptions.heading,
                "zoom": mapOptions.zoom
              });            
              
              if (mapOptions.tilt < 67.5) {
                mapOptions.tilt += 0.5
              } else if (mapOptions.heading <= 360) {
                mapOptions.heading += 0.2;
              } else {
                renderer.setAnimationLoop(null)
              }
            });        
          }
        }
      
        webGLOverlayView.onDraw = ({gl, transformer}) => {
          const latLngAltitudeLiteral = {
              lat: mapOptions.center.lat,
              lng: mapOptions.center.lng,
              altitude: 120
          }
      
          const matrix = transformer.fromLatLngAltitude(latLngAltitudeLiteral);
          camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);
          
          webGLOverlayView.requestRedraw();      
          renderer.render(scene, camera);                  

          renderer.resetState();
        }
        webGLOverlayView.setMap(map);
      }

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={{ lat: mapOptions.center.lat, lng: mapOptions.center.lng }}
            zoom={mapOptions.zoom}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <></>
        </GoogleMap>
    ) : <></>
}

export default React.memo(Map)