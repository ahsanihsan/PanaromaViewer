import * as THREE from "three";
import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useThree, useLoader } from "react-three-fiber";
import { Html, OrbitControls, Loader } from "@react-three/drei";
import "./App.css";

const store = [
  {
    name: "outside",
    color: "lightpink",
    position: [10, 0, -15],
    url: "/360_1.jpg",
    link: 1,
  },
  {
    name: "inside",
    color: "lightblue",
    position: [15, 0, 0],
    url: "/360_2.jpg",
    link: 0,
  },
  // ...
];

function Dome({ name, position, texture, onClick }) {
  return (
    <group>
      <mesh>
        <sphereBufferGeometry args={[500, 60, 40]} />
        <meshBasicMaterial map={texture} side={THREE.BackSide} />
      </mesh>
      <mesh position={position}>
        <sphereGeometry args={[1.25, 32, 32]} />
        <meshBasicMaterial color="white" />
        <Html center>
          {/* <Popconfirm
            title="Are you sure you want to leave?"
            onConfirm={onClick}
            okText="Yes"
            cancelText="No"
          > */}
          <a herf="#" onClick={onClick}>
            {name}
          </a>
          <a herf="#" onClick={onClick}>
            {name}
          </a>
          {/* </Popconfirm> */}
        </Html>
      </mesh>
    </group>
  );
}

function Portals() {
  const [which, set] = useState(0);
  const { link, ...props } = store[which];
  const maps = useLoader(
    THREE.TextureLoader,
    store.map((entry) => entry.url)
  );
  return <Dome onClick={() => set(link)} {...props} texture={maps[which]} />;
}

function Preload() {
  // This component pre-loads textures in order to lessen loading impact when clicking portals
  const { gl } = useThree();
  const maps = useLoader(
    THREE.TextureLoader,
    store.map((entry) => entry.url)
  );
  useEffect(() => maps.forEach(gl.initTexture), [maps]);
  return null;
}

function App() {
  return (
    <Canvas invalidateFrameloop concurrent camera={{ position: [0, 0, 0.1] }}>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.2}
        autoRotate={false}
        rotateSpeed={-0.5}
      />
      <Suspense
        fallback={
          <Html>
            <Loader />
          </Html>
        }
      >
        <Preload />
        <Portals />
      </Suspense>
    </Canvas>
  );
}

export default App;
