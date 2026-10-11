import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import World from './components/World'
import Player from './components/Player'
import UI from './ui/UI'

export default function App() {
  return (
    <>
      {/* dpr 0.5 renders at half resolution; CSS image-rendering:pixelated scales it up for the chunky pixel look */}
      <Canvas shadows dpr={0.5} gl={{ antialias: false }} camera={{ fov: 70, near: 0.1, far: 120, position: [0, 1.6, 12] }}>
        <color attach="background" args={['#070b1e']} />
        <fog attach="fog" args={['#0a1030', 12, 45]} />
        <ambientLight intensity={0.35} color="#8ea2ff" />
        {/* moonlight: casts shadows, so the roof and walls keep the interior dark and warm-lit */}
        <directionalLight
          position={[-10, 20, 10]} intensity={1.1} color="#aab8ff" castShadow
          shadow-mapSize={[2048, 2048]} shadow-bias={-0.0005}
          shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-camera-near={1} shadow-camera-far={70}
        />
        <Stars radius={90} depth={30} count={1200} factor={5} fade />
        <Suspense fallback={null}>
          <World />
        </Suspense>
        <Player />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.9} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
          <Noise opacity={0.07} />
          <Vignette darkness={0.65} offset={0.3} />
        </EffectComposer>
      </Canvas>
      <UI />
    </>
  )
}
