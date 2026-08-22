"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useSound } from "@/lib/sound";

interface IntroPhase {
  name: string;
  duration: number;
  onEnter: () => void;
  onExit?: () => void;
}

const PHASES: IntroPhase[] = [
  { name: "pre-boot", duration: 500, onEnter: () => {} },
  { name: "anticipation", duration: 1500, onEnter: () => {} },
  { name: "discovery", duration: 2000, onEnter: () => {} },
  { name: "impact", duration: 1500, onEnter: () => {} },
  { name: "reveal", duration: 2000, onEnter: () => {} },
  { name: "transition", duration: 1000, onEnter: () => {} },
];

function Monolith({ index, active, position }: { index: number; active: boolean; position: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { playTone, playNoise } = useSound();
  const [glowIntensity, setGlowIntensity] = useState(0);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = position.y + Math.sin(time * 0.5 + index) * 0.15;

      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (active) {
        material.emissiveIntensity = glowIntensity;
      }
    }
  });

  useEffect(() => {
    if (active) {
      gsap.to({ val: 0 }, {
        val: 1,
        duration: 1.5,
        ease: "power2.out",
        onUpdate: function () {
          setGlowIntensity(this.targets()[0].val);
        },
        onComplete: () => {
          playTone(110 * (index + 1), 0.8, "sine", "cinematic", { attack: 0.2, release: 0.6 });
          playNoise(0.3, "cinematic", { attack: 0.01, decay: 0.1, filterFreq: 200 });
        },
      });
    } else {
      gsap.to({ val: glowIntensity }, {
        val: 0,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: function () {
          setGlowIntensity(this.targets()[0].val);
        },
      });
    }
  }, [active, playTone, playNoise]);

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[1.2, 6, 1.2]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.9}
          roughness={0.1}
          emissive={index === 0 ? "#00FFFF" : index === 1 ? "#BC13FE" : "#FFD700"}
          emissiveIntensity={glowIntensity}
        />
      </mesh>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#030307" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={{ y: -3.15 }} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color="#030307" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function EnergyVeins({ active, progress }: { active: boolean; progress: number }) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame((state) => {
    if (lineRef.current && active) {
      const time = state.clock.getElapsedTime();
      const positions = lineRef.current.geometry.attributes.position;
      const count = positions.count;

      for (let i = 0; i < count; i++) {
        const y = positions.getY(i);
        const wave = Math.sin(y * 2 + time * 3) * 0.05 * progress;
        positions.setX(i, positions.getX(i) + wave);
      }
      positions.needsUpdate = true;
    }
  });

  const points = [];
  for (let x = -30; x <= 30; x += 2) {
    for (let z = -30; z <= 30; z += 2) {
      if (Math.abs(x) > 8 || Math.abs(z) > 8) {
        points.push(new THREE.Vector3(x, 0.1, z));
      }
    }
  }

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line
      ref={lineRef}
      geometry={geometry}
      material={
        <lineBasicMaterial
          color="#00FFFF"
          transparent
          opacity={active ? 0.3 * progress : 0}
          linewidth={2}
        />
      }
    />
  );
}

function ParticleField({ count = 2000, active }: { count?: number; active: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (active) {
      gsap.to({ val: 0 }, { val: 1, duration: 2, ease: "power2.out", onUpdate: function () { setOpacity(this.targets()[0].val); } });
    } else {
      gsap.to({ val: opacity }, { val: 0, duration: 1, ease: "power2.out", onUpdate: function () { setOpacity(this.targets()[0].val); } });
    }
  }, [active, opacity]);

  useFrame((state) => {
    if (pointsRef.current) {
      const _time = state.clock.getElapsedTime();
      const positions = pointsRef.current.geometry.attributes.position;
      const velocities = pointsRef.current.geometry.attributes.userData as THREE.BufferAttribute;

      for (let i = 0; i < count; i++) {
        const y = positions.getY(i);
        const vy = velocities.getY(i);
        positions.setY(i, y + vy * 0.01);

        if (positions.getY(i) > 20) positions.setY(i, -10);
        if (positions.getY(i) < -10) positions.setY(i, 20);
      }
      positions.needsUpdate = true;
    }
  });

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const velocities = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = Math.random() * 30 - 10;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;

    const colorChoice = Math.random();
    if (colorChoice < 0.4) {
      colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 1;
    } else if (colorChoice < 0.7) {
      colors[i * 3] = 0.74; colors[i * 3 + 1] = 0.07; colors[i * 3 + 2] = 1;
    } else {
      colors[i * 3] = 1; colors[i * 3 + 1] = 0.84; colors[i * 3 + 2] = 0;
    }

    sizes[i] = Math.random() * 2 + 0.5;
    velocities[i * 3] = (Math.random() - 0.5) * 0.02;
    velocities[i * 3 + 1] = Math.random() * 0.02 + 0.01;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
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
          opacity={opacity}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      }
    />
  );
}

function GridFloor({ active, intensity }: { active: boolean; intensity: number }) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current && active) {
      const time = state.clock.getElapsedTime();
      const material = gridRef.current.material as THREE.Material;
      if (material && "opacity" in material) {
        (material as THREE.LineBasicMaterial).opacity = 0.15 + Math.sin(time * 0.5) * 0.05 * intensity;
      }
    }
  });

  return (
    <gridHelper ref={gridRef} args={[60, 60, "#00FFFF44", "#00FFFF11"]} />
  );
}

function Scanline({ active }: { active: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && active) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = -10 + (time * 5) % 30;
    }
  });

  return (
    <mesh ref={meshRef} position={{ y: -10 }} rotation={{ x: -Math.PI / 2 }} visible={active}>
      <planeGeometry args={[80, 0.1]} />
      <meshBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Shockwave({ trigger, onComplete }: { trigger: number; onComplete?: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { playTone, playNoise } = useSound();

  useFrame((state) => {
    if (meshRef.current && trigger > 0) {
      const elapsed = state.clock.getElapsedTime() - trigger;
      if (elapsed < 2) {
        const scale = 1 + elapsed * 15;
        meshRef.current.scale.setScalar(scale);
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.5 - elapsed * 0.25);
      } else {
        meshRef.current.scale.setScalar(1);
        if (onComplete) onComplete();
      }
    }
  });

  useEffect(() => {
    if (trigger > 0) {
      playTone([30, 40, 60], 1.5, "sine", "cinematic", { attack: 0.01, decay: 0.3, sustain: 0.1, release: 1, filterFreq: 120 });
      playNoise(0.5, "cinematic", { attack: 0.001, decay: 0.2, filterFreq: 100, filterType: "highpass" });
    }
  }, [trigger, playTone, playNoise]);

  return (
    <mesh ref={meshRef} position={{ y: 0.1 }} rotation={{ x: -Math.PI / 2 }} visible={trigger > 0}>
      <ringGeometry args={[0.1, 1, 64]} />
      <meshBasicMaterial
        color="#00FFFF"
        transparent
        opacity={0.5}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LogoMark({ phase, progress }: { phase: string; progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { playChord } = useSound();

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = time * 0.05;

      if (phase === "reveal") {
        groupRef.current.scale.setScalar(0.5 + progress * 0.5);
        groupRef.current.position.y = progress * 2;
      }
    }
  });

  useEffect(() => {
    if (phase === "reveal" && progress > 0.8) {
      playChord([261.63, 329.63, 392.0, 523.25], 2, "cinematic", { attack: 0.2, release: 1, type: "triangle" });
    }
  }, [phase, progress, playChord]);

  return (
    <group ref={groupRef} scale={phase === "impact" ? 0 : 1}>
      <mesh castShadow receiveShadow>
        <coneGeometry args={[2, 4, 3]} />
        <meshStandardMaterial
          color="#0A0A12"
          metalness={0.9}
          roughness={0.1}
          emissive="#00FFFF"
          emissiveIntensity={phase === "reveal" ? progress * 0.5 : 0}
        />
      </mesh>
      <mesh position={{ y: -0.5 }} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 1, 3]} />
        <meshStandardMaterial color="#00FFFF" metalness={1} roughness={0} emissive="#00FFFF" emissiveIntensity={1} />
      </mesh>
      <mesh position={{ y: 1.5 }} castShadow receiveShadow>
        <torusGeometry args={[0.8, 0.1, 8, 32]} />
        <meshStandardMaterial color="#BC13FE" metalness={1} roughness={0} emissive="#BC13FE" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

function CinematicCamera({ phase, progress }: { phase: string; progress: number }) {
  const { camera } = useThree();

  useFrame(() => {
    switch (phase) {
      case "pre-boot":
        camera.position.set(0, 2, 15);
        camera.lookAt(0, 0, 0);
        break;
      case "anticipation":
        camera.position.set(
          10 * Math.sin(progress * Math.PI * 0.5),
          3 + progress * 2,
          15 * Math.cos(progress * Math.PI * 0.5)
        );
        camera.lookAt(0, 0, 0);
        break;
      case "discovery":
        camera.position.set(
          8 * Math.sin(progress * Math.PI * 2),
          5,
          12 * Math.cos(progress * Math.PI * 2)
        );
        camera.lookAt(0, 1, 0);
        break;
      case "impact":
        camera.position.set(0, 6, 20 - progress * 15);
        camera.lookAt(0, 2, 0);
        camera.fov = 60 + progress * 30;
        camera.updateProjectionMatrix();
        break;
      case "reveal":
        camera.position.set(0, 4, 12 - progress * 8);
        camera.lookAt(0, 2, 0);
        camera.fov = 90 - progress * 40;
        camera.updateProjectionMatrix();
        break;
      case "transition":
        camera.position.set(0, 3, 4 - progress * 4);
        camera.lookAt(0, 1.5, 0);
        camera.fov = 50;
        camera.updateProjectionMatrix();
        break;
    }
  });

  return null;
}

function FogVolume({ active, density }: { active: boolean; density: number }) {
  const { scene } = useThree();
  const fogRef = useRef<THREE.FogExp2 | null>(null);

  useEffect(() => {
    if (active) {
      fogRef.current = new THREE.FogExp2("#030307", density);
      scene.fog = fogRef.current;
    } else if (fogRef.current) {
      scene.fog = null;
      fogRef.current = null;
    }
  }, [active, density, scene]);

  return null;
}

interface IntroExperienceProps {
  onComplete: () => void;
  isReturningVisitor: boolean;
  onSkip: () => void;
}

export function IntroExperience({ onComplete, isReturningVisitor, onSkip }: IntroExperienceProps) {
  const { playIntroSequence, playWhoosh, playAmbience, resumeContext } = useSound();
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const phaseStartRef = useRef(0);
  const completedRef = useRef(false);

  const currentPhase = PHASES[phaseIndex];
  const isShortVersion = isReturningVisitor;

  useEffect(() => {
    resumeContext();
    playAmbience(true);

    if (isShortVersion) {
      setPhaseIndex(PHASES.length - 2);
      setPhaseProgress(1);
      setTimeout(() => {
        if (!completedRef.current) {
          completedRef.current = true;
          playWhoosh();
          onComplete();
        }
      }, 2000);
      return;
    }

    const timer = setTimeout(() => setShowSkip(true), 1500);

    const runSequence = async () => {
      playIntroSequence();

      for (let i = 0; i < PHASES.length; i++) {
        if (completedRef.current) break;
        setPhaseIndex(i);
        setPhaseProgress(0);
        phaseStartRef.current = performance.now();

        const phase = PHASES[i];
        await new Promise<void>((resolve) => {
          const tick = () => {
            const elapsed = performance.now() - phaseStartRef.current;
            const progress = Math.min(elapsed / phase.duration, 1);
            setPhaseProgress(progress);

            if (progress >= 1) {
              resolve();
            } else {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        });
      }

      if (!completedRef.current) {
        completedRef.current = true;
        playWhoosh();
        onComplete();
      }
    };

    runSequence();

    return () => {
      clearTimeout(timer);
      playAmbience(false);
    };
  }, [isShortVersion, onComplete, resumeContext, playIntroSequence, playWhoosh, playAmbience]);

  const handleSkip = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onSkip();
  };

  const activePhase = currentPhase?.name || "pre-boot";

  return (
    <div className="fixed inset-0 z-[layer-5] flex items-center justify-center">
      <Canvas
        className="w-full h-full"
        camera={{ position: [0, 3, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false }}
        shadows={{ type: THREE.PCFSoftShadowMap }}
        performance={{ min: 0.3, max: 0.8 }}
      >
        <color attach="background" args={["#030307"]} />
        <fog attach="fog" args={["#030307", 0.02]} />

        <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" castShadow>
          <orthographicCamera attach="shadowCamera" args={[-30, 30, 30, -30, 1, 100]} />
        </directionalLight>
        <ambientLight color="#11111A" intensity={0.5} />

        <FogVolume active={activePhase !== "transition"} density={0.015} />
        <GridFloor active={activePhase !== "transition"} intensity={phaseProgress} />
        <Scanline active={activePhase === "pre-boot" || activePhase === "anticipation"} />
        <ParticleField active={activePhase !== "pre-boot"} />
        <EnergyVeins active={activePhase === "discovery"} progress={phaseProgress} />

        <Monolith index={0} active={activePhase === "discovery" && phaseProgress > 0.2} position={new THREE.Vector3(-3, 0, 0)} />
        <Monolith index={1} active={activePhase === "discovery" && phaseProgress > 0.5} position={new THREE.Vector3(0, 0, 0)} />
        <Monolith index={2} active={activePhase === "discovery" && phaseProgress > 0.8} position={new THREE.Vector3(3, 0, 0)} />

        <LogoMark phase={activePhase} progress={phaseProgress} />

        <Shockwave trigger={activePhase === "impact" ? performance.now() : 0} />

        <CinematicCamera phase={activePhase} progress={phaseProgress} />
      </Canvas>

      <div className="absolute bottom-8 right-8 z-10">
        <button
          onClick={handleSkip}
          className={`
            glass px-6 py-3 rounded-xl font-display font-medium text-body-sm text-ghost-white
            border border-glass-border
            transition-all duration-300
            hover:border-neon-cyan hover:bg-glass-hover hover:shadow-glow-cyan
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan
            opacity-0 pointer-events-none
            ${showSkip ? "opacity-100 pointer-events-auto" : ""}
          `}
          aria-label="Skip intro"
        >
          ENTER EXPERIENCE
        </button>
      </div>

      <div className="absolute bottom-8 left-8 z-10 text-caption text-ghost-muted/50 font-mono">
        PHASE: <span className="text-neon-cyan">{activePhase.toUpperCase()}</span>
        {phaseProgress < 1 && (
          <>
            {" | "}
            PROGRESS: <span className="text-neon-violet">{Math.round(phaseProgress * 100)}%</span>
          </>
        )}
      </div>
    </div>
  );
}