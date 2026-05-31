'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import type { Mesh } from 'three'

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]}>
      <MeshDistortMaterial
        color="#88ffcc"
        transparent
        opacity={0.15}
        distort={0.4}
        speed={2}
        roughness={0}
        metalness={0.8}
        wireframe={false}
      />
    </Sphere>
  )
}

function WireframeSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = -state.clock.elapsedTime * 0.15
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.25
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
  })

  return (
    <Sphere ref={meshRef} args={[1.05, 32, 32]}>
      <meshBasicMaterial
        color="#44ffaa"
        transparent
        opacity={0.12}
        wireframe
      />
    </Sphere>
  )
}

export default function RainbowSphere({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2, 2, 2]} color="#88ffcc" intensity={2} />
        <pointLight position={[-2, -1, -2]} color="#4488ff" intensity={1.5} />
        <pointLight position={[0, -2, 1]} color="#ff44aa" intensity={1} />
        <AnimatedSphere />
        <WireframeSphere />
      </Canvas>
    </div>
  )
}
