import * as THREE from "three";
import React, { Suspense, useState, useEffect } from "react";
import { Canvas, useThree, useLoader } from "react-three-fiber";
import { Html, OrbitControls, Loader } from "@react-three/drei";
import "./App.css";

const store = [
  {
    name: "outside",
    color: "lightpink",
    position: [10, 0, -1],
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

function MovableShizz() {
  const ref = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      const [, , z] = position;
      setPosition([x / aspect, -y / aspect, z]);
    },
    { pointerEvents: true }
  );
  return (
    <mesh position={position} {...bind()} ref={ref}>
      <dodecahedronBufferGeometry attach="geometry" />
      <meshLambertMaterial attach="material" />
    </mesh>
  );
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
    <Canvas invalidateFrameloop concurrent camera={{ position: [0, 0, 1] }}>
      <OrbitControls
        enableZoom={true}
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
