import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ModelViewer = ({ fileId }) => {
  const mountRef = useRef(null);
  const [model, setModel] = useState(null);
  const [scene, setScene] = useState(new THREE.Scene());

  useEffect(() => {
    if (!fileId || !mountRef.current) return;

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0xffffff, 2);
    scene.add(light);

    const loader = new STLLoader();
    loader.load(`${process.env.REACT_APP_BACKEND_URL}/api/retrieve/${fileId}/`, (geometry) => {
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const loadedModel = new THREE.Mesh(geometry, material);
      scene.add(loadedModel);
      setModel(loadedModel);

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    return () => {
      mountRef.current.innerHTML = "";
    };
  }, [fileId]);

  const handleExport = () => {
    if (!model) return alert("No model loaded!");
    const exporter = new OBJExporter();
    const objData = exporter.parse(model);
    const blob = new Blob([objData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "exported_model.obj";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div ref={mountRef} style={{ width: "800px", height: "800px" }} />
      <button onClick={handleExport}>Export as OBJ</button>
    </div>
  );
};

export default ModelViewer;
