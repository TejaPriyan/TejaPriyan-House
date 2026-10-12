import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore, sfx, footstep } from '../store'
import { objects, colliders } from '../world/layout'
import { useTouch, useTouchLook } from './TouchControls'

const R = 0.35
const interactables = objects.filter((o) => o.act)
const hit = (x, z) => colliders.some((c) => x + R > c.x0 && x - R < c.x1 && z + R > c.z0 && z - R < c.z1)

// One reusable interaction path for every object: run its act(), then record its discovery.
const interact = () => {
  const g = useStore.getState()
  const o = interactables.find((x) => x.id === g.near)
  if (!g.started || g.modal || g.journalOpen || !o) return
  sfx(660, 0.1); o.act()
  if (o.discovery) g.discover(o.discovery)
}

// Detect surface type based on player position
const getSurface = (x, z) => {
  // Inside house: x -8..8, z -5..5
  if (x > -8 && x < 8 && z > -5 && z < 5) {
    // AI lab has tile/circuit floor
    if (x > 0 && z < 0) return 'tile'
    return 'wood'
  }
  // Porch area
  if (Math.abs(x) < 2 && z > 5 && z < 7.5) return 'stone'
  // Brick path
  if (Math.abs(x) < 1.2 && z > 5 && z < 15) return 'stone'
  return 'grass'
}

const isMobile = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0

export default function Player() {
  const st = useRef({ x: 0, z: 12, vx: 0, vz: 0, yaw: 0, pitch: 0, ty: 0, tp: 0, bob: 0, k: {}, touchDx: 0, touchDz: 0 })

  // Hook up mobile touch controls
  useTouch(st)
  useTouchLook(st)

  useEffect(() => {
    const s = st.current
    const kd = (e) => { s.k[e.code] = true; if (e.code === 'KeyE') interact() }
    const ku = (e) => { s.k[e.code] = false }
    const mm = (e) => {
      if (!document.pointerLockElement) return
      s.ty -= e.movementX * 0.0022
      s.tp = Math.max(-1.2, Math.min(1.2, s.tp - e.movementY * 0.0022))
    }
    const md = (e) => {
      const g = useStore.getState()
      if (!g.started || g.modal || g.journalOpen) return
      if (document.pointerLockElement) interact()
      else if (e.target.tagName === 'CANVAS') {
        // On mobile, tapping canvas acts as interact (no pointer lock)
        if (isMobile()) interact()
        else e.target.requestPointerLock()
      }
    }
    addEventListener('keydown', kd); addEventListener('keyup', ku)
    addEventListener('mousemove', mm); addEventListener('mousedown', md)
    return () => {
      removeEventListener('keydown', kd); removeEventListener('keyup', ku)
      removeEventListener('mousemove', mm); removeEventListener('mousedown', md)
    }
  }, [])

  useFrame(({ camera }, dt) => {
    dt = Math.min(dt, 0.05)
    const s = st.current, g = useStore.getState(), k = s.k
    const busy = g.modal || g.journalOpen || !g.started // modal/journal open: movement disabled

    // Combine keyboard + touch input
    const kx = busy ? 0 : (k.KeyD ? 1 : 0) - (k.KeyA ? 1 : 0)
    const kz = busy ? 0 : (k.KeyS ? 1 : 0) - (k.KeyW ? 1 : 0)
    const ix = busy ? 0 : (kx || s.touchDx)
    const iz = busy ? 0 : (kz || s.touchDz)

    const sp = k.ShiftLeft ? 5 : 3, c = Math.cos(s.yaw), n = Math.sin(s.yaw)

    // acceleration / deceleration
    const a = 1 - Math.exp(-(ix || iz ? 10 : 7) * dt)
    s.vx += ((ix * c + iz * n) * sp - s.vx) * a
    s.vz += ((-ix * n + iz * c) * sp - s.vz) * a

    // axis-separated collision so you slide along walls
    const nx = s.x + s.vx * dt, nz = s.z + s.vz * dt
    if (!hit(nx, s.z)) s.x = Math.max(-20, Math.min(20, nx)); else s.vx = 0
    if (!hit(s.x, nz)) s.z = Math.max(-20, Math.min(16, nz)); else s.vz = 0

    // smooth look + head bob
    const f = 1 - Math.exp(-25 * dt)
    s.yaw += (s.ty - s.yaw) * f; s.pitch += (s.tp - s.pitch) * f
    const v = Math.hypot(s.vx, s.vz); s.bob += v * dt * 2.2
    camera.rotation.order = 'YXZ'
    camera.rotation.set(s.pitch, s.yaw, 0)
    camera.position.set(s.x, 1.6 + Math.sin(s.bob * 3) * 0.04 * Math.min(1, v / 3), s.z)

    // footstep sounds when moving
    if (v > 1.5 && !busy) {
      footstep(getSurface(s.x, s.z))
    }

    // update player position for minimap (throttled to ~0.5 unit increments)
    const rx = Math.round(s.x * 2) / 2
    const rz = Math.round(s.z * 2) / 2
    const pp = g.playerPos
    if (!pp || pp[0] !== rx || pp[1] !== rz) {
      g.setPlayerPos([rx, rz])
    }

    // nearest interactable in front of the player
    let best = null, bd = 2.6
    if (!busy) {
      for (const o of interactables) {
        if (o.when && !o.when(g.found)) continue
        const dx = o.pos[0] - s.x, dz = o.pos[2] - s.z, d = Math.hypot(dx, dz)
        if (d < bd && (d < 1 || (-dx * n - dz * c) / d > 0.35)) { best = o.id; bd = d }
      }
      if (s.x > 0.3 && s.x < 7.8 && s.z < -0.3 && s.z > -4.8) g.discover('lab')
    }
    g.setNear(best)
  })
  return null
}
