import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Environment, Text, MeshTransmissionMaterial, Sparkles, Edges } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../../lib/data'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const allSkills = Object.values(skills).flatMap(cat => cat.items)

const createChunks = (arr: string[], pattern: number[]) => {
  const chunks = []
  let i = 0
  let patternIdx = 0
  while (i < arr.length) {
    const size = pattern[patternIdx % pattern.length]
    chunks.push(arr.slice(i, i + size))
    i += size
    patternIdx++
  }
  return chunks
}

const desktopRows = createChunks(allSkills, [6, 5])
const mobileRows = createChunks(allSkills, [3, 2])

// Math to center the honeycomb array in 3D space
const calculatePositions = (rows: string[][], isMobile: boolean) => {
  const R = isMobile ? 0.95 : 1.35
  const W = Math.sqrt(3) * R
  const H = 1.5 * R

  const positions: { skill: string, position: [number, number, number] }[] = []
  const totalHeight = (rows.length - 1) * H
  const startY = totalHeight / 2 

  rows.forEach((row, rowIndex) => {
    const rowWidth = (row.length - 1) * W
    const startX = -rowWidth / 2 
    const y = startY - (rowIndex * H)
    
    row.forEach((skill, colIndex) => {
      const x = startX + (colIndex * W)
      const z = (Math.random() - 0.5) * 0.4 // Slight 3D depth stagger
      positions.push({ skill, position: [x, y, z] })
    })
  })
  
  return positions
}

// ----------------------------------------------------
// 3D COMPONENTS
// ----------------------------------------------------

const MouseLight = () => {
  const lightRef = useRef<THREE.PointLight>(null)
  
  useFrame((state) => {
    if (lightRef.current) {
      // Map normalized device coordinates to the 3D space Z-plane
      const x = (state.mouse.x * state.viewport.width) / 2
      const y = (state.mouse.y * state.viewport.height) / 2
      
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, x, 0.1)
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, y, 0.1)
    }
  })
  
  return (
    <pointLight 
      ref={lightRef} 
      position={[0, 0, 3]} 
      intensity={12} 
      color="#22d3ee" 
      distance={15} 
    />
  )
}

const CrystalNode = ({ position, skill, isMobile }: { position: [number, number, number], skill: string, isMobile: boolean }) => {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  // Randomize floating speed slightly per crystal
  const floatSpeed = useMemo(() => 1.5 + Math.random(), [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (hovered) {
        // Violent 3D coin spin on hover
        groupRef.current.rotation.y += delta * 8
      } else {
        // Return to flat orientation smoothly
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.08)
      }
    }
  })

  // To make the Cylinder face the camera, we rotate the inner mesh.
  // Cylinder height is along Y. We rotate X by 90deg to face it to Z.
  // We rotate Y by 30deg (PI/6) to make it a pointy-topped hexagon.
  const meshRotation: [number, number, number] = [Math.PI / 2, Math.PI / 6, 0]
  const cylinderArgs: [number, number, number, number] = isMobile ? [0.95, 0.95, 0.3, 6] : [1.35, 1.35, 0.4, 6]

  return (
    <Float 
      speed={floatSpeed} 
      rotationIntensity={0.1} 
      floatIntensity={0.4} 
      position={position}
    >
      <group 
        ref={groupRef}
        onPointerOver={() => setHovered(true)} 
        onPointerOut={() => setHovered(false)}
      >
        <mesh rotation={meshRotation}>
          <cylinderGeometry args={cylinderArgs} />
          
          {/* THE PHYSICAL GLASS SHADER */}
          <MeshTransmissionMaterial 
            backside={false}
            samples={3}
            resolution={128}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.2}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color={hovered ? "#8b5cf6" : "#ffffff"}
            roughness={0.1}
            metalness={0.1}
            ior={1.5}
          />
          
          {/* Subtle 1px wireframe tracing the glass edges */}
          <Edges 
            linewidth={1} 
            threshold={15} 
            color={hovered ? "#22d3ee" : "rgba(255,255,255,0.15)"} 
          />
        </mesh>

        {/* 3D Text embedded perfectly inside the glass core */}
        <Text
          position={[0, 0, 0.22]} // Slightly protruding from the glass front
          fontSize={isMobile ? 0.16 : 0.2}
          color={hovered ? "#ffffff" : "rgba(255,255,255,0.6)"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          letterSpacing={0.15}
          font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff"
        >
          {skill.toUpperCase()}
        </Text>
      </group>
    </Float>
  )
}

// ----------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------

export default function Skills() {
  const containerRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const activeRows = isMobile ? mobileRows : desktopRows
  const positions = useMemo(() => calculatePositions(activeRows, isMobile), [activeRows, isMobile])

  return (
    <section 
      ref={containerRef} 
      id="skills" 
      className="w-full h-[100vh] min-h-[800px] relative bg-[#020202] overflow-hidden z-10"
    >
      {/* 
        HTML OVERLAY 
        The UI layer floating above the WebGL canvas
      */}
      <div className="absolute top-24 left-0 w-full z-20 pointer-events-none flex flex-col items-center">
        <h2 className="section-heading text-white text-center flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)] tracking-widest">
          <span>QUANTUM</span>
          <span className="relative">
            <span className="absolute inset-0 bg-gradient-to-r from-aurora-cyan to-aurora-purple blur-[20px] opacity-50"></span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-aurora-cyan to-aurora-purple italic">MATRIX</span>
          </span>
        </h2>
        <p className="text-white/40 mt-4 text-xs md:text-sm tracking-[0.3em] font-light">
          INTERACTIVE WEBGL CRYSTAL ARRAY
        </p>
      </div>

      {/* 
        THE 3D SCENE 
        Complete WebGL rendering engine taking over the DOM
      */}
      <div className="absolute inset-0 z-10">
        <Canvas 
          camera={{ position: [0, 0, isMobile ? 18 : 14], fov: 45 }}
          dpr={[1, 2]} // Optimize pixel ratio for performance
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.4} />
          
          {/* HDRI Environment provides real-world light reflections to the glass */}
          <Environment preset="city" />
          
          {/* Dynamic 3D flashlight tracking the mouse */}
          <MouseLight />
          
          {/* Floating background dust/energy particles */}
          <Sparkles count={200} scale={25} size={1.5} speed={0.2} opacity={0.4} color="#8b5cf6" />
          
          {/* Deep background static aurora lights in 3D space */}
          <pointLight position={[-5, 5, -5]} intensity={20} color="#22d3ee" distance={20} />
          <pointLight position={[5, -5, -5]} intensity={20} color="#8b5cf6" distance={20} />

          {/* The Array of Glass Crystals */}
          <group position={[0, -0.5, 0]}>
            {positions.map((data, i) => (
              <CrystalNode 
                key={i} 
                position={data.position} 
                skill={data.skill} 
                isMobile={isMobile} 
              />
            ))}
          </group>
        </Canvas>
      </div>
    </section>
  )
}
