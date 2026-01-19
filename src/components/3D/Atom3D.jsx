import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Trail, Float, Stars, OrbitControls, Sparkles, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';

// --- Logic Helpers ---
const getElectronShells = (atomicNumber) => {
  const shells = [];
  let remaining = atomicNumber;
  let shellIndex = 1;

  while (remaining > 0) {
    const capacity = 2 * (shellIndex * shellIndex);
    const count = Math.min(remaining, capacity);
    shells.push({ 
        radius: 1.5 + (shellIndex * 1.8), // Slightly wider spacing for visual clarity
        count, 
        speed: (1.2 / shellIndex) * (Math.random() * 0.2 + 0.9) 
    });
    remaining -= count;
    shellIndex++;
  }
  return shells;
};

// --- Sub-Components ---

const Electron = ({ radius, speed, offset, tilt, color }) => {
  const ref = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.x = Math.cos(t) * radius;
    ref.current.position.y = Math.sin(t) * radius;
    ref.current.position.z = 0;
  });

  return (
    <group rotation={tilt}> 
      {/* Orbital Ring - Faint & Thin */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.008, 16, 64]} />
        <meshBasicMaterial color={color} opacity={0.1} transparent />
      </mesh>

      {/* The Moving Electron */}
      <group ref={ref}>
        <Trail
          width={2} 
          length={5} 
          color={new THREE.Color(color).multiplyScalar(2)} // Boost brightness for Bloom
          attenuation={(t) => t * t}
        >
          <mesh>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshBasicMaterial color={[10, 10, 10]} toneMapped={false} /> 
          </mesh>
        </Trail>
        {/* Local Point Light for the Electron itself */}
        <pointLight distance={2} intensity={2} color={color} decay={2} />
      </group>
    </group>
  );
};

const Nucleus = ({ atomicNumber, color }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle floating/breathing
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.1;
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.z = t * 0.05;
  });

  // Generate Protons/Neutrons
  const particles = useMemo(() => {
    const count = Math.min(Math.max(atomicNumber, 3), 50); // Clamp visuals
    return Array.from({ length: count }).map(() => {
      // Sphere packing algorithm approximation
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.sqrt(count * Math.PI) * phi;
      const r = 0.4 * Math.cbrt(Math.random()); // Cluster tightly
      
      return {
        pos: new THREE.Vector3(
            r * Math.cos(theta) * Math.sin(phi),
            r * Math.sin(theta) * Math.sin(phi),
            r * Math.cos(phi)
        ).multiplyScalar(1.5), // Spread slightly
        isProton: Math.random() > 0.4 // Slightly more protons for color
      };
    });
  }, [atomicNumber]);

  return (
    <group ref={groupRef}>
      {/* Inner Core Light */}
      <pointLight distance={5} intensity={4} color={color} decay={2} />
      
      {/* Nucleons */}
      {particles.map((p, i) => (
         <mesh key={i} position={p.pos}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshPhysicalMaterial 
                color={p.isProton ? color : "#888888"} 
                emissive={p.isProton ? color : "#000000"}
                emissiveIntensity={p.isProton ? 0.8 : 0}
                roughness={0.2}
                metalness={0.8}
                clearcoat={1}
                clearcoatRoughness={0.1}
            />
         </mesh>
      ))}

      {/* Energy Cloud (Quantum Fluctuations) */}
      <Sparkles count={40} scale={2.5} size={3} speed={0.4} opacity={0.5} color={color} />
    </group>
  );
};

const SceneContent = ({ atomicNumber, color }) => {
  const electrons = useMemo(() => {
    const shells = getElectronShells(atomicNumber);
    const e = [];
    shells.forEach((shell) => {
      for (let i = 0; i < shell.count; i++) {
        e.push({
          radius: shell.radius,
          speed: shell.speed,
          offset: (i / shell.count) * Math.PI * 2,
          tilt: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, 0]
        });
      }
    });
    return e;
  }, [atomicNumber]);

  return (
    <>
      <Nucleus atomicNumber={atomicNumber} color={color} />
      
      <group>
        {electrons.map((props, i) => (
          <Electron key={i} {...props} color={color} />
        ))}
      </group>
      
      {/* Distant Starfield for depth */}
      <Stars radius={50} depth={20} count={1000} factor={4} saturation={0} fade speed={0.5} />
    </>
  );
};

// --- Main Export ---
export default function Atom3D({ atomicNumber = 1, color = "#00F0FF" }) {
  const [hovered, setHover] = useState(false);

  return (
    <div 
        className="w-full h-full relative"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
    >
      <Canvas dpr={[1, 2]} gl={{ antialias: false, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={35} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
        <pointLight position={[-10, -10, -5]} intensity={2} color={color} />
        <spotLight position={[0, 20, 0]} angle={0.5} penumbra={1} intensity={1} castShadow />

        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.2}>
           <SceneContent atomicNumber={atomicNumber} color={color} />
        </Float>

        {/* Post Processing Stack */}
        <EffectComposer disableNormalPass>
            <Bloom 
                luminanceThreshold={0.1} // Glows easily
                mipmapBlur 
                intensity={1.5} // Intense Sci-Fi Glow
                radius={0.6} 
            />
            {/* Chromatic Aberration adds that "Hologram" lens distortion edge */}
            <ChromaticAberration offset={[0.002, 0.002]} />
            {/* Noise adds texture to prevent color banding */}
            <Noise opacity={0.05} />
            <Vignette eskil={false} offset={0.1} darkness={0.6} />
        </EffectComposer>

        <OrbitControls 
            enableZoom={true} 
            minDistance={8} 
            maxDistance={40} 
            autoRotate={!hovered}
            autoRotateSpeed={0.5}
            enablePan={false}
        />
      </Canvas>
    </div>
  );
}