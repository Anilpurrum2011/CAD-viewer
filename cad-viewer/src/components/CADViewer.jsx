import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const Model = ({ scale, rotation }) => {
    const ref = useRef();

    useFrame(() => {
        ref.current.rotation.y = rotation;
    });

    return (
        <mesh ref={ref} scale={scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="blue" />
        </mesh>
    );
};

const CADViewer = () => {
    const [scale, setScale] = useState([1, 1, 1]);
    const [rotation, setRotation] = useState(0);
    const [zoom, setZoom] = useState(1);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Canvas camera={{ position: [0, 0, 5 * zoom] }} style={{ width: "100vw", height: "80vh" }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <Model scale={scale} rotation={rotation} />
                <OrbitControls />
            </Canvas>

            {/* Buttons for Controls */}
            <div style={{ marginTop: 20 }}>
                <button onClick={() => setScale([scale[0] + 0.2, scale[1], scale[2]])}>Increase Width</button>
                <button onClick={() => setScale([scale[0] - 0.2, scale[1], scale[2]])}>Decrease Width</button>
                <button onClick={() => setScale([scale[0], scale[1] + 0.2, scale[2]])}>Increase Height</button>
                <button onClick={() => setScale([scale[0], scale[1] - 0.2, scale[2]])}>Decrease Height</button>
                <button onClick={() => setRotation(rotation + 0.2)}>Rotate Right</button>
                <button onClick={() => setRotation(rotation - 0.2)}>Rotate Left</button>
                <button onClick={() => setZoom(zoom * 0.9)}>Zoom In</button>
                <button onClick={() => setZoom(zoom * 1.1)}>Zoom Out</button>
            </div>
        </div>
    );
};

export default CADViewer;
