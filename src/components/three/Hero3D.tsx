"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useSound } from "@/lib/sound";
import { Button } from "@/components/ui/Button";

function HeroLogo({ time: _time }: { time: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.rotation.y = t * 0.03;

      groupRef.current.children.forEach((child, i) => {
        if (child instanceof THREE.Mesh) {
          child.rotation.y = t * 0.05 * (i % 2 === 0 ? 1 : -1);
          child.position.y = Math.sin(t * 2 + i) * 0.15;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[2.5, 5, 3]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.9}
          roughness={0.1}
          emissive="#00FFFF"
          emissiveIntensity={0.3 + Math.sin(time * 2) * 0.2}
        />
      </mesh>
      <mesh position={{ y: -1 }} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 2, 3]} />
        <meshStandardMaterial color="#00FFFF" metalness={1} roughness={0} emissive="#00FFFF" emissiveIntensity={1} />
      </mesh>
      <mesh position={{ y: 2 }} castShadow receiveShadow>
        <torusGeometry args={[1.2, 0.15, 8, 32]} />
        <meshStandardMaterial color="#BC13FE" metalness={1} roughness={0} emissive="#BC13FE" emissiveIntensity={1} />
      </mesh>
      <mesh position={{ y: 2.3 }} castShadow receiveShadow>
        <torusGeometry args={[1.5, 0.08, 8, 32]} rotation={{ x: Math.PI / 2 }} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0} emissive="#FFD700" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function EnergyRing({ time: _time, radius, color, speed, intensity }: { time: number; radius: number; color: string; speed: number; intensity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.z = t * speed;
      meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.3;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = intensity * (0.5 + Math.sin(t * 3) * 0.2);
    }
  });

  return (
    <mesh ref={meshRef} rotation={{ x: -Math.PI / 2 }}>
      <ringGeometry args={[radius * 0.95, radius, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 1500, time: _time }: { count?: number; time: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position;
      const velocities = pointsRef.current.geometry.attributes.userData as THREE.BufferAttribute;

      for (let i = 0; i < count; i++) {
        const y = positions.getY(i);
        const vy = velocities.getY(i);
        positions.setY(i, y + vy * 0.02 + Math.sin(t + i) * 0.001);

        if (positions.getY(i) > 15) positions.setY(i, -5);
        if (positions.getY(i) < -5) positions.setY(i, 15);
      }
      positions.needsUpdate = true;
    }
  });

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 20 + 5;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.random() * 20 - 5;
    positions[i * 3 + 2] = Math.sin(theta) * r;

    const colorChoice = Math.random();
    if (colorChoice < 0.45) {
      colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
    } else if (colorChoice < 0.8) {
      colors[i * 3] = 0.74; colors[i * 3 + 1] = 0.07; colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0;
    }

    sizes[i] = Math.random() * 1.5 + 0.3;
    velocities[i * 3] = (Math.random() - 0.5) * 0.01;
    velocities[i * 3 + 1] = Math.random() * 0.03 + 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.01;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("userData", new THREE.BufferAttribute(velocities, 3));

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={
        <pointsMaterial
          size={1}
          vertexColors
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      }
    />
  );
}

function GridPlane({ time: _time }: { time: number }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      const t = state.clock.getElapsedTime();
      const material = gridRef.current.material as THREE.Material;
      if (material && "opacity" in material) {
        (material as THREE.LineBasicMaterial).opacity = 0.08 + Math.sin(t * 0.5) * 0.03;
      }
    }
  });

  return (
    <gridHelper ref={gridRef} args={[80, 80, "#00FFFF33", "#00FFFF11"]} />
  );
}

function VolumetricLight({ time: _time }: { time: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.scale.y = 1 + Math.sin(t * 0.3) * 0.2;
      meshRef.current.rotation.y = t * 0.02;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.03 + Math.sin(t * 0.5) * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={{ y: 5 }} scale={{ x: 15, y: 20, z: 15 }}>
      <cylinderGeometry args={[1, 1, 1, 32, 1, true]} />
      <meshBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.03}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function MouseParallax() {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useFrame(() => {
    targetRef.current.x = gsap.utils.interpolate(targetRef.current.x, mouseRef.current.x * 0.5, 0.02);
    targetRef.current.y = gsap.utils.interpolate(targetRef.current.y, mouseRef.current.y * 0.3, 0.02);
    camera.position.x = targetRef.current.x;
    camera.position.y = 3 + targetRef.current.y;
    camera.lookAt(0, 1, 0);
  });

  return null;
}

function ScrollParallax() {
  const { camera } = useThree();
  const scrollY = useScroll();

  useFrame(() => {
    const targetZ = 12 + scrollY * 0.008;
    camera.position.z = gsap.utils.interpolate(camera.position.z, targetZ, 0.05);
    camera.lookAt(0, 1, 0);
  });

  return null;
}

export function Hero3D() {
  const { playAmbience, resumeContext } = useSound();
  const [loaded, setLoaded] = useState(false);
  const timeRef = useRef(0);

  useEffect(() => {
    resumeContext();
    playAmbience(true);
    setLoaded(true);
    return () => playAmbience(false);
  }, [resumeContext, playAmbience]);

  useFrame((state) => {
    timeRef.current = state.clock.getElapsedTime();
  });

  if (!loaded) return null;

  return (
    <div className="relative w-full h-full min-h-screen">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 3, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        performance={{ min: 0.3, max: 0.8 }}
      >
        <color attach="background" args={["#030307"]} />
        <fog attach="fog" args={["#030307", 0.015]} />

        <directionalLight position={[10, 25, 10]} intensity={2} color="#ffffff" castShadow>
          <orthographicCamera attach="shadowCamera" args={[-40, 40, 40, -40, 1, 100]} />
        </directionalLight>
        <directionalLight position={[-10, 20, -10]} intensity={0.5} color="#BC13FE" />
        <ambientLight color="#11111A" intensity={0.4} />
        <pointLight position={[0, 10, 0]} color="#00FFFF" intensity={1} distance={50} decay={2} />

        <GridPlane time={timeRef.current} />
        <VolumetricLight time={timeRef.current} />
        <FloatingParticles time={timeRef.current} />
        <HeroLogo time={timeRef.current} />

        <EnergyRing time={timeRef.current} radius={8} color="#00FFFF" speed={0.02} intensity={0.15} />
        <EnergyRing time={timeRef.current} radius={12} color="#BC13FE" speed={-0.015} intensity={0.1} />
        <EnergyRing time={timeRef.current} radius={16} color="#FFD700" speed={0.01} intensity={0.05} />

        <MouseParallax />
        <ScrollParallax />
      </Canvas>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 md:px-8 pt-32 pb-20">
        <div className="max-w-5xl w-full text-center animate-in">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full glass border-glass-border/50 mb-8 animate-in-delay-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan" />
            </span>
            <span className="text-caption text-neon-cyan tracking-widest">LIVE NOW</span>
          </div>

          <h1 className="text-display-xl md:text-display-xl lg:text-[clamp(4rem,10vw,9rem)] font-black tracking-tight text-ghost-white mb-6 animate-in-delay-2">
            TMT<span className="text-gradient-cyan"> OFFICIAL</span>
          </h1>

          <p className="text-body-lg md:text-body-lg max-w-2xl mx-auto text-ghost-muted mb-10 animate-in-delay-3">
            Elite gaming. Cinematic let&rsquo;s plays. Next-level challenges.
            Welcome to the abyss.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in-delay-4">
            <Button size="xl" variant="primary" magnetic className="min-w-[200px]">
              <span>WATCH VIDEOS</span>
            </Button>
            <Button size="xl" variant="secondary" magnetic className="min-w-[200px]">
              <span>JOIN COMMUNITY</span>
            </Button>
            <Button size="xl" variant="ghost" magnetic className="min-w-[200px]">
              <span>SUBSCRIBE</span>
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-12 text-sm text-ghost-muted/50 animate-in-delay-5">
            <div className="flex items-center gap-2">
              <span className="text-neon-cyan font-display text-2xl">2.4M</span>
              <span>SUBSCRIBERS</span>
            </div>
            <div className="w-px h-8 bg-glass-border" />
            <div className="flex items-center gap-2">
              <span className="text-neon-violet font-display text-2xl">847</span>
              <span>VIDEOS</span>
            </div>
            <div className="w-px h-8 bg-glass-border" />
            <div className="flex items-center gap-2">
              <span className="text-neon-gold font-display text-2xl">1.2B</span>
              <span>VIEWS</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-ghost-muted/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}