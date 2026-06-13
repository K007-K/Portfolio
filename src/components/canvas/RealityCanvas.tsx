import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, MeshTransmissionMaterial, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { useTheme } from '../../context/ThemeContext'

// --- Custom Infinity Symbol (Figure 8) Curve ---
class InfinityCurve extends THREE.Curve<THREE.Vector3> {
  scale: number;
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const u = t * Math.PI * 2;
    // Lemniscate of Bernoulli extended into 3D
    const x = Math.cos(u) * 3;
    const y = Math.sin(u) * Math.cos(u) * 3;
    const z = Math.sin(u) * 1.5; // Add depth so it's not totally flat

    return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
  }
}

function ShockwaveRing({ delay = 0 }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.MeshBasicMaterial>(null)
  const { theme } = useTheme()
  const color = theme === 'dark' ? '#4f6bf6' : '#ffffff'
  const timeOffset = useRef(delay)

  useFrame((_, delta) => {
    timeOffset.current += delta
    const t = timeOffset.current % 6 // 6 second expanding loop
    
    if (meshRef.current && materialRef.current) {
      // Scale out
      const scale = 1 + t * 1.2
      meshRef.current.scale.set(scale, scale, scale)
      
      // Fade out over the 6 seconds
      // Opacity peaks at 0.3 then slowly fades to 0
      const opacity = t < 0.5 ? t * 0.6 : Math.max(0, 0.3 * (1 - (t - 0.5) / 5.5))
      materialRef.current.opacity = opacity
    }
  })

  return (
    <mesh ref={meshRef} rotation-x={Math.PI / 2}>
      <torusGeometry args={[3, 0.02, 16, 100]} />
      <meshBasicMaterial 
        ref={materialRef} 
        color={color} 
        transparent 
        opacity={0} 
        blending={THREE.AdditiveBlending} 
        depthWrite={false} 
      />
    </mesh>
  )
}

// --- The Infinity Loop (Möbius Concept) ---
function InfinityLoop() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { theme } = useTheme()
  const { viewport } = useThree()

  // Slowly rotate the loop to showcase the infinite surface
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
      // Add a slight bobbing motion
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2
    }
  })

  // Theme-based glass properties
  const glassProps = useMemo(() => ({
    thickness: 2.5,
    roughness: 0.05,
    transmission: 1,
    ior: 1.5,
    chromaticAberration: 0.08,
    backside: true,
  }), [])

  // Animate color transition based on theme
  const materialRef = useRef<any>(null)
  useFrame(() => {
    if (materialRef.current) {
      const targetColor = theme === 'dark' ? new THREE.Color('#1a1a2e') : new THREE.Color('#000000')
      materialRef.current.color.lerp(targetColor, 0.05)
    }
  })

  // Responsive scaling based on viewport width
  const scale = Math.min(viewport.width / 12, 1.2)
  const curve = useMemo(() => new InfinityCurve(1.5), [])

  return (
    <group scale={scale}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1} position={[0, 0, -4]}>
        {/* The 3D Shockwaves */}
        <ShockwaveRing delay={0} />
        <ShockwaveRing delay={2} />
        <ShockwaveRing delay={4} />

        {/* The Infinity Glass Loop */}
        <mesh ref={meshRef}>
          <tubeGeometry args={[curve, 256, 0.8, 64, true]} />
          <MeshTransmissionMaterial ref={materialRef} {...glassProps} resolution={1024} />
        </mesh>
      </Float>
    </group>
  )
}

// --- The Global Scene ---
function Scene() {
  const { theme } = useTheme()

  return (
    <>
      <ambientLight intensity={theme === 'dark' ? 0.2 : 0.8} />
      <directionalLight position={[10, 10, 5]} intensity={theme === 'dark' ? 1 : 2} />
      <directionalLight position={[-10, -10, -5]} intensity={theme === 'dark' ? 2 : 1} color={theme === 'dark' ? '#4F6BF6' : '#ffffff'} />
      
      {/* Environment for glass reflections */}
      <Environment preset="city" />

      <InfinityLoop />
    </>
  )
}

export default function RealityCanvas() {
  return (
    <div className="absolute inset-0 z-[-1] pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }}
        dpr={[1, 2]} // Optimize for high DPI displays but cap at 2
        gl={{ antialias: false }} // Transmission material handles its own sampling
      >
        <Scene />
      </Canvas>
    </div>
  )
}
