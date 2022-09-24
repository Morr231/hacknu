import GLTFLoader from "@react-three/gltfjsx/src/utils/glftLoader";
import * as THREE from "three";

export function setWebGLOverlayView(map, mapOptions, webglOverlayView) {
    let scene, renderer, camera, loader;

    webglOverlayView.onAdd = () => {
        // Set up the Three.js scene.
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75); // Soft white light.
        scene.add(ambientLight);

        // Load the 3D model with GLTF Loader from Three.js.
        loader = new GLTFLoader();
        loader.load("pin.gltf");
    }

    webglOverlayView.onContextRestored = ({ gl }) => {
        // Create the Three.js renderer, using the
        // maps's WebGL rendering context.
        renderer = new THREE.WebGLRenderer({
            canvas: gl.canvas,
            context: gl,
            ...gl.getContextAttributes(),
        });
        renderer.autoClear = false;
    }

    webglOverlayView.onDraw = ({ gl, transformer }) => {
        // Update camera matrix to ensure the model is georeferenced correctly on the map.
        const matrix = transformer.fromLatLngAltitude({
            lat: mapOptions.center.lat,
            lng: mapOptions.center.lng,
            altitude: 120,
        });
        camera.projectionMatrix = new THREE.Matrix4().fromArray(matrix);

        // Request a redraw and render the scene.
        webglOverlayView.requestRedraw();
        renderer.render(scene, camera);

        // Always reset the GL state.
        renderer.resetState();
    }

    // Add the overlay to the map.
    webglOverlayView.setMap(map);
}