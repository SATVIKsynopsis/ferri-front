"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

interface DotGlobeHeroProps {
  rotationSpeed?: number;
  globeRadius?: number;
  className?: string;
  children?: React.ReactNode;
}

const Globe: React.FC<{
  rotationSpeed: number;
  radius: number;
}> = ({ rotationSpeed, radius }) => {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
      groupRef.current.rotation.x += rotationSpeed * 0.3;
      groupRef.current.rotation.z += rotationSpeed * 0.1;
    }
  });

  // Create latitude lines
  const latitudeLines = [];
  for (let lat = -60; lat <= 60; lat += 20) {
    const latRad = (lat * Math.PI) / 180;
    const points = [];
    for (let lng = -180; lng <= 180; lng += 5) {
      const lngRad = (lng * Math.PI) / 180;
      const x = radius * Math.cos(latRad) * Math.cos(lngRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(lngRad);
      points.push(new THREE.Vector3(x, y, z));
    }
    latitudeLines.push(points);
  }

  // Create longitude lines
  const longitudeLines = [];
  for (let lng = -180; lng < 180; lng += 30) {
    const lngRad = (lng * Math.PI) / 180;
    const points = [];
    for (let lat = -90; lat <= 90; lat += 5) {
      const latRad = (lat * Math.PI) / 180;
      const x = radius * Math.cos(latRad) * Math.cos(lngRad);
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(lngRad);
      points.push(new THREE.Vector3(x, y, z));
    }
    longitudeLines.push(points);
  }

  return (
    <group ref={groupRef}>
      {/* Main globe wireframe */}
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>

      {/* Latitude lines */}
      {latitudeLines.map((points, idx) => (
        <line key={`lat-${idx}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6366f1" transparent opacity={0.4} linewidth={1} />
        </line>
      ))}

      {/* Longitude lines */}
      {longitudeLines.map((points, idx) => (
        <line key={`lng-${idx}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#6366f1" transparent opacity={0.4} linewidth={1} />
        </line>
      ))}
    </group>
  );
};



const DotGlobeHero = React.forwardRef<
  HTMLDivElement,
  DotGlobeHeroProps
>(({
  rotationSpeed = 0.005,
  globeRadius = 1,
  className,
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-screen bg-background overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {children}
      </div>
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 3]} fov={75} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Globe
            rotationSpeed={rotationSpeed}
            radius={globeRadius}
          />
        </Canvas>
      </div>
    </div>
  );
});

DotGlobeHero.displayName = "DotGlobeHero";

export { DotGlobeHero, type DotGlobeHeroProps };