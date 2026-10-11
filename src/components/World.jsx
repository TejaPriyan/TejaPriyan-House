import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, Sparkles, useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { walls, objects } from '../world/layout'
import { portfolio as p } from '../config/portfolio'
import { useStore } from '../store'
import { PixBox, tex } from '../pixel'

const Mat = (props) => <meshStandardMaterial flatShading {...props} />

function Obj({ o }) {
  const near = useStore((s) => s.near === o.id)
  const { pos, size, ry = 0 } = o
  return (
    <>
      {!o.hidden && (
        <PixBox position={pos} size={size} pat={o.pat} color={o.color} emissive={near ? '#ffcc66' : o.emissive || '#000'} emissiveIntensity={near ? 0.6 : 1} />
      )}
      {o.label && (
        <Text position={[pos[0] + Math.sin(ry) * 0.15, pos[1] + (o.ly ?? 0.9), pos[2] + Math.cos(ry) * 0.15]} rotation={[0, ry, 0]} fontSize={0.14} maxWidth={1.3} textAlign="center" color="#cfe6ff">
          {o.label}
        </Text>
      )}
    </>
  )
}

// Fake animated code on a canvas texture
function CodeScreen({ pos }) {
  const [tex] = useState(() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 40
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; return t
  })
  useFrame(({ clock }) => {
    const t = Math.floor(clock.elapsedTime * 4)
    if (tex.userData.t === t) return
    tex.userData.t = t
    const g = tex.image.getContext('2d')
    g.fillStyle = '#06121f'; g.fillRect(0, 0, 64, 40)
    for (let i = 0; i < 9; i++) { g.fillStyle = i % 3 ? '#4ade80' : '#38bdf8'; g.fillRect(4 + (i % 2) * 4, 3 + i * 4, 8 + (((i + t) * 37) % 40), 2) }
    tex.needsUpdate = true
  })
  return <mesh position={pos}><planeGeometry args={[1.2, 0.65]} /><meshBasicMaterial map={tex} /></mesh>
}

// Animated retro pixel-art TV scene
function TVScreen({ pos, w = 1.6, h = 0.85 }) {
  const [tvTex] = useState(() => {
    const c = document.createElement('canvas'); c.width = 64; c.height = 48
    const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; return t
  })
  useFrame(({ clock }) => {
    const t = Math.floor(clock.elapsedTime * 8)
    if (tvTex.userData.t === t) return
    tvTex.userData.t = t
    const g = tvTex.image.getContext('2d')
    const f = t % 120

    // sky gradient
    g.fillStyle = '#0a0a2a'; g.fillRect(0, 0, 64, 48)
    g.fillStyle = '#0e1840'; g.fillRect(0, 0, 64, 30)

    // twinkling stars
    for (let i = 0; i < 12; i++) {
      const sx = (i * 41 + 3) % 64, sy = (i * 17 + 1) % 24
      if ((t + i * 7) % 5 < 3) { g.fillStyle = '#fff'; g.fillRect(sx, sy, 1, 1) }
    }

    // mountains
    g.fillStyle = '#1a2a4a'
    for (let i = 0; i < 6; i++) {
      const mx = i * 12 - 4, mh = 10 + (i * 7) % 8
      for (let r = 0; r < mh; r++) {
        const rw = ((mh - r) / mh) * 12
        g.fillRect(mx + 6 - rw / 2, 30 - r, rw, 1)
      }
    }

    // ground
    g.fillStyle = '#1a3a20'; g.fillRect(0, 30, 64, 18)
    g.fillStyle = '#224a28'; g.fillRect(0, 30, 64, 2)

    // bouncing pixel character
    const bx = 16 + Math.sin(f * 0.12) * 18
    const jumpH = Math.abs(Math.sin(f * 0.18)) * 8
    const by = 32 - jumpH

    // shadow
    g.fillStyle = '#0004'; g.fillRect(bx - 1, 33, 6, 1)

    // body
    g.fillStyle = '#ff9d4d'; g.fillRect(bx, by, 4, 4)
    // head
    g.fillStyle = '#f3e6c8'; g.fillRect(bx, by - 3, 4, 3)
    // eyes
    g.fillStyle = '#222'
    g.fillRect(bx + 1, by - 2, 1, 1)
    g.fillRect(bx + 3, by - 2, 1, 1)
    // legs
    g.fillStyle = '#3a3a6a'
    if (f % 8 < 4) {
      g.fillRect(bx, by + 4, 2, 2); g.fillRect(bx + 2, by + 4, 2, 3)
    } else {
      g.fillRect(bx, by + 4, 2, 3); g.fillRect(bx + 2, by + 4, 2, 2)
    }

    // collectible coin
    const cx = (f * 2 + 40) % 64
    g.fillStyle = (f % 6 < 3) ? '#ffd700' : '#ffaa00'
    g.fillRect(cx, 28, 3, 3)

    // HUD bar
    g.fillStyle = '#4ade80'; g.fillRect(2, 2, 20, 2)
    g.fillStyle = '#333'; g.fillRect(22, 2, 10, 2)
    g.fillStyle = '#ff6b6b'; g.fillRect(2, 5, 14, 2)

    // scanline effect
    for (let sy = 0; sy < 48; sy += 2) {
      g.fillStyle = '#0001'; g.fillRect(0, sy, 64, 1)
    }

    tvTex.needsUpdate = true
  })
  return <mesh position={pos}><planeGeometry args={[w, h]} /><meshBasicMaterial map={tvTex} /></mesh>
}

function Core() {
  const r = useRef()
  useFrame((_, dt) => { r.current.rotation.y += dt * 0.8; r.current.rotation.x += dt * 0.3 })
  return (
    <group position={[4, 1.9, -2.2]}>
      <mesh ref={r}><icosahedronGeometry args={[0.5, 0]} /><Mat color="#2a6bff" emissive="#4aa3ff" emissiveIntensity={1.5} /></mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.75, 0.75, 2, 8]} />
        <meshStandardMaterial color="#4aa3ff" transparent opacity={0.18} emissive="#2a6bff" emissiveIntensity={0.6} depthWrite={false} flatShading />
      </mesh>
      <Sparkles count={40} scale={[6, 2.5, 4]} size={3} color="#66ccff" />
    </group>
  )
}

function Steam() {
  const g = useRef()
  useFrame(({ clock }) => {
    g.current.visible = (Date.now() - useStore.getState().coffeeAt) / 1000 < 6
    g.current.children.forEach((m, i) => {
      const k = (clock.elapsedTime * 0.6 + i / 6) % 1
      m.position.set(Math.sin(k * 6 + i) * 0.05, k * 0.5, 0); m.scale.setScalar(1 - k)
    })
  })
  return (
    <group ref={g} position={[4.4, 1.2, 4.4]} visible={false}>
      {[0, 1, 2, 3, 4, 5].map((i) => <mesh key={i}><boxGeometry args={[0.06, 0.06, 0.06]} /><meshBasicMaterial color="#fff" transparent opacity={0.6} /></mesh>)}
    </group>
  )
}

// Campfire in the front yard with animated flickering flames
function Campfire() {
  const flames = useRef()
  const lightRef = useRef()
  useFrame(({ clock }) => {
    if (!flames.current) return
    const t = clock.elapsedTime
    flames.current.children.forEach((m, i) => {
      const phase = t * 3.5 + i * 1.7
      const h = (Math.sin(phase) * 0.5 + 0.5) * 0.5
      m.position.set(Math.sin(i * 2.1) * 0.12, 0.2 + h, Math.cos(i * 2.1) * 0.12)
      m.scale.setScalar(0.7 + Math.sin(phase * 1.5) * 0.35)
    })
    if (lightRef.current) {
      lightRef.current.intensity = 12 + Math.sin(t * 5) * 4 + Math.sin(t * 8.3) * 2
    }
  })

  const stones = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2
    return [Math.cos(a) * 0.45, 0.07, Math.sin(a) * 0.45]
  })

  return (
    <group position={[-3, 0, 10]}>
      {stones.map((pos, i) => (
        <mesh key={`cs${i}`} position={pos}><boxGeometry args={[0.14, 0.14, 0.14]} /><Mat color="#5a5a5a" /></mesh>
      ))}
      <mesh position={[0, 0.08, 0]} rotation={[0, 0.3, 0]}><boxGeometry args={[0.5, 0.07, 0.09]} /><Mat color="#4a3020" /></mesh>
      <mesh position={[0, 0.08, 0]} rotation={[0, -0.6, 0]}><boxGeometry args={[0.45, 0.07, 0.09]} /><Mat color="#3a2518" /></mesh>
      <group ref={flames}>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <mesh key={i}><boxGeometry args={[0.07, 0.1, 0.07]} /><meshBasicMaterial color={i % 3 === 0 ? '#ff4400' : i % 3 === 1 ? '#ff8800' : '#ffcc00'} /></mesh>
        ))}
      </group>
      <Sparkles count={20} scale={[0.8, 1.5, 0.8]} size={2} color="#ff6600" speed={0.8} />
      <pointLight ref={lightRef} color="#ff8844" intensity={14} distance={8} position={[0, 0.5, 0]} />
    </group>
  )
}

// 3D Avatar loaded with Kenney Blocky Character GLB and textured lit material
function Avatar() {
  const g = useRef()
  const show = useStore((s) => s.found.length >= p.discoveries.length - 1)
  const { scene } = useGLTF('/models/avatar.glb')
  const texture = useTexture('/models/Textures/texture-a.png')

  const model = useMemo(() => {
    texture.magFilter = THREE.NearestFilter
    texture.minFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    const clone = scene.clone(true)
    clone.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.85,
          metalness: 0.05,
          flatShading: true,
        })
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    return clone
  }, [scene, texture])

  useFrame(({ camera }) => {
    if (g.current) g.current.rotation.y = Math.atan2(camera.position.x, camera.position.z - 2.2)
  })
  if (!show) return null
  return (
    <group ref={g} position={[0, 0, 2.2]} scale={[1.1, 1.1, 1.1]}>
      <primitive object={model} />
    </group>
  )
}

// Kenney 3D Coffee Cup on kitchen counter
function CoffeeCup() {
  const { scene } = useGLTF('/models/coffee-cup.glb')
  return <primitive object={scene.clone()} position={[4.4, 1.05, 4.4]} scale={[1.5, 1.5, 1.5]} />
}

// Kenney Sports Car parked in the front driveway
function CarModel() {
  const { scene } = useGLTF('/models/car.glb')
  return <primitive object={scene.clone()} position={[5.8, 0, 9.5]} rotation={[0, -0.4, 0]} scale={[1.2, 1.2, 1.2]} />
}

// Kenney Treasure Chest
function ChestModel() {
  const { scene } = useGLTF('/models/chest.glb')
  return <primitive object={scene.clone()} position={[-5.8, 0, 8.5]} rotation={[0, 0.5, 0]} scale={[1.3, 1.3, 1.3]} />
}

// Kenney Flowers along entrance path
function FlowerGarden() {
  const { scene } = useGLTF('/models/flower.glb')
  const spots = [
    [-1.6, 0, 7], [1.6, 0, 7],
    [-1.6, 0, 9], [1.6, 0, 9],
    [-1.6, 0, 11], [1.6, 0, 11],
    [-1.6, 0, 13], [1.6, 0, 13],
  ]
  return (
    <group>
      {spots.map((pos, i) => (
        <primitive key={i} object={scene.clone()} position={pos} scale={[1.1, 1.1, 1.1]} />
      ))}
    </group>
  )
}

function Sign({ x, z, w, text, fs }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.6, 0]}><boxGeometry args={[0.14, 1.2, 0.14]} /><Mat color="#3b2a1d" /></mesh>
      <mesh position={[0, 1.35, 0]}><boxGeometry args={[w, 0.9, 0.12]} /><Mat color="#5a3d2b" /></mesh>
      <Text position={[0, 1.35, 0.08]} fontSize={fs} maxWidth={w - 0.2} textAlign="center" color="#ffd9a0">{text}</Text>
    </group>
  )
}

function SkillTiles() {
  return p.skills.map((s, i) => (
    <group key={s.name} position={[7.7, 2.35 - Math.floor(i / 4) * 0.55, 2 + ((i % 4) - 1.5) * 0.55]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh><boxGeometry args={[0.46, 0.46, 0.04]} /><Mat color={s.color} emissive={s.color} emissiveIntensity={0.4} /></mesh>
      <Text position={[0, 0, 0.03]} fontSize={0.07} maxWidth={0.4} textAlign="center" color="#fff">{s.name}</Text>
    </group>
  ))
}

// Pond water shimmer effect
function PondWater() {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.material.emissiveIntensity = 0.3 + Math.sin(clock.elapsedTime * 1.5) * 0.15
    }
  })
  return (
    <mesh ref={ref} position={[9, 0.04, 10]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.3, 1.8]} />
      <meshStandardMaterial color="#1a5a8a" emissive="#0a3a6a" emissiveIntensity={0.3} transparent opacity={0.7} flatShading />
    </mesh>
  )
}

// Window with frame and glass panes
function Window({ x }) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[x, 1.7, 5.19]}><boxGeometry args={[1.3, 1.1, 0.06]} /><Mat color="#5a3d2b" /></mesh>
      {/* Glass */}
      <mesh position={[x, 1.7, 5.21]}>
        <planeGeometry args={[1.1, 0.9]} />
        <meshStandardMaterial color="#8ab8ff" transparent opacity={0.2} emissive="#ffcf7a" emissiveIntensity={0.15} />
      </mesh>
      {/* Cross frame bars */}
      <mesh position={[x, 1.7, 5.23]}><boxGeometry args={[1.2, 0.04, 0.02]} /><Mat color="#5a3d2b" /></mesh>
      <mesh position={[x, 1.7, 5.23]}><boxGeometry args={[0.04, 0.9, 0.02]} /><Mat color="#5a3d2b" /></mesh>
    </group>
  )
}

const TREES = [[-12, 8], [-9, 13], [11, 9], [14, 3], [-14, -2], [12, -9], [-11, -10], [5, -12], [-4, -13], [16, 12]]
// Extra varied trees for a richer forest look
const TREES2 = [[-15, 10], [15, 8], [-13, 14], [13, 14], [-7, 14], [8, 14], [-16, 5], [17, 0], [-10, -13], [10, -12]]
const LAMPS = [[-3, 6.5], [3, 6.5], [0, 14]]
const Flat = ({ args, y = 0, x = 0, z = 0, color, pat = 'noise' }) => (
  <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[x, y, z]}>
    <planeGeometry args={args} /><meshStandardMaterial map={tex(pat, args[0] * 2, args[1] * 2)} color={color} flatShading />
  </mesh>
)

export default function World() {
  return (
    <>
      {/* ground, path, floors */}
      <Flat args={[80, 80]} pat="leaf" color="#2f6a40" />
      <Flat args={[2, 9]} y={0.01} z={9.5} pat="bricks" color="#8a847b" />
      <Flat args={[16, 10]} y={0.02} pat="wood" color="#9a6a42" />
      <Flat args={[7.7, 5]} y={0.03} x={4} z={-2.5} pat="circuit" color="#2a4aa0" />

      {/* shell + roof */}
      {walls.map((w, i) => <PixBox key={i} position={w.pos} size={w.size} pat="rows" color={w.color} />)}
      <group scale={[1.2, 1, 0.8]} position={[0, 4.1, 0]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]}><coneGeometry args={[9.5, 2.2, 4]} /><meshStandardMaterial map={tex('bricks', 12, 3)} color="#8a3a34" flatShading /></mesh>
      </group>

      {/* Windows with glass panes */}
      <Window x={-4.5} />
      <Window x={4.5} />

      {/* furniture + interactables */}
      {objects.map((o) => <Obj key={o.id} o={o} />)}
      <SkillTiles />
      <CodeScreen pos={[-3.9, 1.25, -4.49]} />
      <CodeScreen pos={[-2.1, 1.25, -4.49]} />
      <TVScreen pos={[-7.58, 1.2, 1.6]} w={0.1} h={0.9} />
      <Core />
      <Steam />
      <Campfire />
      <PondWater />
      <Avatar />
      <CoffeeCup />
      <Text position={[4, 2.75, -4.83]} fontSize={0.4} color="#7fc4ff">TEJAX</Text>
      <Text position={[4, 2.45, -4.83]} fontSize={0.1} color="#7fc4ff">AUTONOMOUS INTELLIGENCE LAB</Text>

      {/* yard */}
      <Sign x={3.6} z={8} w={3.4} text="TEJA PRIYAN HOUSE" fs={0.3} />
      <Sign x={-3} z={9.5} w={2.6} text="ENTER MY WORLD →" fs={0.2} />
      <CarModel />
      <ChestModel />
      <FlowerGarden />

      {/* Primary trees */}
      {TREES.map(([x, z], i) => (
        <group key={`t${i}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 1, 0]}><cylinderGeometry args={[0.25, 0.3, 2, 5]} /><meshStandardMaterial map={tex('rows', 1, 3)} color="#6a4630" flatShading /></mesh>
          <mesh castShadow position={[0, 2.8, 0]}><coneGeometry args={[1.9, 2.6, 6]} /><meshStandardMaterial map={tex('leaf', 3, 2)} color="#2a7a4a" flatShading /></mesh>
          <mesh castShadow position={[0, 4.2, 0]}><coneGeometry args={[1.3, 2.4, 6]} /><meshStandardMaterial map={tex('leaf', 3, 2)} color="#35905a" flatShading /></mesh>
        </group>
      ))}
      {/* Secondary trees (smaller, varied) for denser forest */}
      {TREES2.map(([x, z], i) => (
        <group key={`t2${i}`} position={[x, 0, z]}>
          <mesh castShadow position={[0, 0.7, 0]}><cylinderGeometry args={[0.18, 0.22, 1.4, 5]} /><meshStandardMaterial map={tex('rows', 1, 2)} color="#5a3a28" flatShading /></mesh>
          <mesh castShadow position={[0, 2, 0]}><coneGeometry args={[1.4, 2, 5]} /><meshStandardMaterial map={tex('leaf', 2, 2)} color="#1a6a3a" flatShading /></mesh>
          <mesh castShadow position={[0, 3.1, 0]}><coneGeometry args={[0.9, 1.6, 5]} /><meshStandardMaterial map={tex('leaf', 2, 2)} color="#2a8a4a" flatShading /></mesh>
        </group>
      ))}

      {LAMPS.map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 1.5, 0]}><boxGeometry args={[0.1, 3, 0.1]} /><Mat color="#222" /></mesh>
          <mesh position={[0, 3.1, 0]}><boxGeometry args={[0.3, 0.3, 0.3]} /><meshBasicMaterial color="#ffd27a" /></mesh>
        </group>
      ))}
      {/* Moon */}
      <mesh position={[-25, 30, -45]}><sphereGeometry args={[3, 8, 8]} /><meshBasicMaterial color="#f3e6c8" fog={false} /></mesh>
      {/* Ambient sparkles */}
      <Sparkles count={60} scale={[30, 4, 24]} position={[0, 2, 8]} size={2} color="#ffe9a0" />
      {/* Firefly sparkles in the yard */}
      <Sparkles count={30} scale={[20, 3, 16]} position={[0, 1.5, 10]} size={1.5} color="#88ff88" speed={0.3} />

      {/* lights: warm house, cold lab */}
      <pointLight position={[0, 2.6, 6.5]} color="#ffb766" intensity={25} distance={12} />
      <pointLight position={[-4, 2.6, 2.5]} color="#ffb766" intensity={30} distance={11} />
      <pointLight position={[5, 2.6, 2.5]} color="#ffd39a" intensity={30} distance={11} />
      <pointLight position={[-4, 2.6, -2.5]} color="#ffa860" intensity={30} distance={11} />
      <pointLight position={[4, 2.6, -2.5]} color="#4aa3ff" intensity={35} distance={11} />
      {/* Porch lights */}
      <pointLight position={[0, 2.5, 6]} color="#ffd27a" intensity={8} distance={6} />
    </>
  )
}

useGLTF.preload('/models/avatar.glb')
useGLTF.preload('/models/coffee-cup.glb')
useGLTF.preload('/models/car.glb')
useGLTF.preload('/models/chest.glb')
useGLTF.preload('/models/flower.glb')
useTexture.preload('/models/Textures/texture-a.png')
