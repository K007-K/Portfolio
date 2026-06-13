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

// --- Electric Current Shader (Jagged Lightning) ---
const ElectricMaterial = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { theme } = useTheme()
  const color = theme === 'dark' ? new THREE.Color('#4f6bf6') : new THREE.Color('#ffffff')

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uColor.value = color
    }
  })

  return (
    <shaderMaterial
      ref={materialRef}
      transparent
      blending={THREE.AdditiveBlending}
      depthWrite={false}
      uniforms={{
        uTime: { value: 0 },
        uColor: { value: color }
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
        uniform vec3 uColor;
        varying vec2 vUv;
        
        // Pseudo-random hash
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }
        
        // 2D Value Noise
        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), 
            u.y);
        }
        
        void main() {
          vec2 st = vUv;
          
          // Make the lightning wrap around the tube multiple times
          st.x *= 30.0; 
          
          // Generate chaotic high-frequency noise for the jagged shape
          float n = noise(vec2(st.x - uTime * 15.0, uTime * 25.0));
          float n2 = noise(vec2(st.x * 2.0 + uTime * 10.0, uTime * 30.0));
          
          // Combine noises for a more complex jagged path
          float path = (n + n2 * 0.5) / 1.5;
          
          // Create a thin line displaced by the noise. vUv.y is the circumference (0 to 1).
          // We center the line at 0.5 and displace it.
          float distanceToLine = abs(vUv.y - 0.5 + (path - 0.5) * 0.6);
          
          // Make it a glowing sharp line
          float intensity = 0.005 / (distanceToLine + 0.001);
          
          // Add global flickering to the bolt
          float flicker = noise(vec2(uTime * 50.0, 0.0));
          intensity *= (flicker * 1.5);
          
          // Mask the lightning so it only appears in isolated, moving patches (like arcs)
          float boltMask = noise(vec2(vUv.x * 8.0 - uTime * 3.0, 0.0));
          boltMask = smoothstep(0.5, 0.7, boltMask);
          
          intensity *= boltMask;
          
          // Clamp to prevent blowout
          intensity = clamp(intensity, 0.0, 1.5);

          gl_FragColor = vec4(uColor, intensity);
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
