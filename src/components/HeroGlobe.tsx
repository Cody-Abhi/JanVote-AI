import { useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function RotatingGlobe() {
  const globeRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={globeRef} args={[2.5, 64, 64]} scale={1}>
      <meshStandardMaterial 
        color="#2563eb" 
        wireframe={true} 
        transparent 
        opacity={0.3}
      />
      <Sphere args={[2.45, 64, 64]}>
        <meshStandardMaterial color="#f8fafc" />
      </Sphere>
      {/* Floating particles or dots can go here, for now a wireframe globe + solid core */}
    </Sphere>
  );
}

export default function HeroGlobe() {
  return (
    <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#f97316" />
        <directionalLight position={[-10, -10, -5]} intensity={1} color="#10b981" />
        <RotatingGlobe />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
