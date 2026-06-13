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

// --- Electric Current Shader (Slow, Rare Pulse) ---
const ElectricMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      uniforms={{
        uTime: { value: 0 }
      }}
      vertexShader={`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
      fragmentShader={`
        uniform float uTime;
        varying vec2 vUv;
        
        void main() {
          // Slow speed for the spark
          float speed = 0.08;
          
          // Create a cycle that is much longer than the tube itself (0 to 1).
          // If cycleLength is 3.0, the spark travels the tube (0 to 1) and then is completely invisible 
          // while it travels from 1.0 to 3.0, creating a long delay between appearances.
          float cycleLength = 3.0; 
          float sparkPos = mod(uTime * speed, cycleLength); 
          
          // Calculate distance along the tube
          float diff = sparkPos - vUv.x;
          
          float intensity = 0.0;
          // The spark has a core at the front, and a fading tail stretching behind it
          float tailLength = 0.15;
          if (diff > 0.0 && diff < tailLength) {
              intensity = 1.0 - (diff / tailLength);
              intensity = pow(intensity, 4.0); // Very sharp, glowing core
          }
          
          // Restrict the spark to a thin line along the edge of the tube
          // vUv.y is the circumference (0 to 1). We place it at 0.25 (the top/side edge)
          float distY = abs(vUv.y - 0.25);
          distY = min(distY, 1.0 - distY); // Handle wrapping
          float intensityY = smoothstep(0.03, 0.0, distY);
          
          intensity *= intensityY;
          
          // Deep electric blue color mapping
          vec3 deepBlue = vec3(0.02, 0.15, 1.0);
          vec3 brightCore = vec3(0.8, 0.9, 1.0);
          
          // Mix colors based on intensity so the core is white/cyan and the edges are deep blue
          vec3 finalColor = mix(deepBlue, brightCore, intensity);
          
          // Boost alpha for strong glow
          float alpha = intensity * 1.5;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `}
    />
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
        {/* The Inner Electric Current */}
        <mesh>
          <tubeGeometry args={[curve, 256, 0.7, 16, true]} />
          <ElectricMaterial />
        </mesh>

        {/* The Outer Infinity Glass Loop */}
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
