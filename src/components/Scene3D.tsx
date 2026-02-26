"use client";

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Environment } from "@react-three/drei";
import * as THREE from "three";

// Placeholder car wireframe - replace with your actual 3D model
function CarPlaceholder() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} scale={1.5}>
        {/* Car body placeholder */}
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[2.5, 0.4, 1]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Cockpit */}
        <mesh position={[0.2, 0.6, 0]}>
          <boxGeometry args={[0.8, 0.3, 0.6]} />
          <meshStandardMaterial
            color="#050505"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Front wing */}
        <mesh position={[1.5, 0.1, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.3, 0.05, 1.4]} />
          <meshStandardMaterial
            color="#d9c26b"
            emissive="#d9c26b"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Rear wing */}
        <mesh position={[-1.3, 0.7, 0]}>
          <boxGeometry args={[0.1, 0.3, 1.2]} />
          <meshStandardMaterial
            color="#d9c26b"
            emissive="#d9c26b"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Wing endplates */}
        <mesh position={[-1.3, 0.7, 0.55]}>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[-1.3, 0.7, -0.55]}>
          <boxGeometry args={[0.3, 0.4, 0.05]} />
          <meshStandardMaterial
            color="#0a0a0a"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Wheels */}
        {[
          [0.8, 0, 0.6],
          [0.8, 0, -0.6],
          [-0.8, 0, 0.6],
          [-0.8, 0, -0.6],
        ].map((pos, i) => (
          <group key={i} position={pos as [number, number, number]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.15, 32]} />
              <meshStandardMaterial
                color="#050505"
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
            {/* Wheel glow */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
              <ringGeometry args={[0.15, 0.22, 32]} />
              <meshStandardMaterial
                color="#d9c26b"
                emissive="#d9c26b"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          </group>
        ))}

        {/* Sidepods */}
        <mesh position={[0, 0.3, 0.55]}>
          <boxGeometry args={[1.2, 0.25, 0.2]} />
          <meshStandardMaterial
            color="#080808"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
        <mesh position={[0, 0.3, -0.55]}>
          <boxGeometry args={[1.2, 0.25, 0.2]} />
          <meshStandardMaterial
            color="#080808"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Engine cover accent */}
        <mesh position={[-0.5, 0.45, 0]}>
          <boxGeometry args={[0.8, 0.05, 0.5]} />
          <meshStandardMaterial
            color="#d9c26b"
            emissive="#d9c26b"
            emissiveIntensity={0.3}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Halo */}
        <mesh position={[0.4, 0.85, 0]} rotation={[0, 0, 0.2]}>
          <torusGeometry args={[0.35, 0.03, 8, 32, Math.PI]} />
          <meshStandardMaterial
            color="#d9c26b"
            emissive="#d9c26b"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

// Particle system for atmosphere
function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#d9c26b"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Grid floor
function Grid() {
  return (
    <gridHelper
      args={[20, 40, "#d9c26b", "#1a1a1a"]}
      position={[0, -0.5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

export default function Scene3D() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [4, 2, 4], fov: 50 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          {/* Lighting - Dark saturated red ambient */}
          <ambientLight intensity={0.15} color="#8b0000" />
          <spotLight
            position={[10, 10, 5]}
            angle={0.3}
            penumbra={1}
            intensity={1}
            color="#ffffff"
            castShadow
          />
          {/* Dark saturated red point lights */}
          <pointLight position={[-5, 5, -5]} intensity={0.6} color="#8b0000" />
          <pointLight position={[5, 3, 5]} intensity={0.4} color="#8b0000" />
          <pointLight position={[0, 2, 0]} intensity={0.3} color="#d9c26b" />

          {/* Scene elements */}
          <CarPlaceholder />
          <Particles />
          <Grid />

          {/* Environment */}
          <Environment preset="night" />

          {/* Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>

      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
    </div>
  );
}
