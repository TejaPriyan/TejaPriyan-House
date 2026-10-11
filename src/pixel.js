import { createElement, useMemo } from 'react'
import * as THREE from 'three'

// 16x16 greyscale pixel patterns, tinted per object by its `color`. 2 repeats per metre = 32 texels/m.
const PER_M = 2
let seed = 7
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
const LUM = {
  noise: () => 205 + rnd() * 50,
  leaf: () => 130 + rnd() * 125,
  rows: (x, y) => (y % 4 === 3 ? 120 : 190 + rnd() * 65), // wooden planks
  bricks: (x, y) => (y % 4 === 3 || (x + (((y >> 2) % 2) * 8)) % 8 === 7 ? 110 : 185 + rnd() * 70),
  grid: (x, y) => (x % 8 === 0 || y % 8 === 0 ? 255 : 140 + rnd() * 40), // tiles / lab floor
  // ── New enriched patterns ──
  circuit: (x, y) => {
    const trace = x % 4 === 0 || y % 4 === 0
    const node = x % 4 === 0 && y % 4 === 0
    return node ? 240 + rnd() * 15 : trace && rnd() > 0.3 ? 180 + rnd() * 40 : 55 + rnd() * 30
  },
  carpet: (x, y) => {
    const w = (x + y) % 2 === 0 ? 18 : 0
    return 150 + w + rnd() * 45
  },
  stone: (x, y) => {
    const crack = rnd() > 0.9 ? -50 : 0
    return 140 + rnd() * 60 + crack
  },
  wood: (x, y) => {
    const ring = Math.abs(((x * 3 + y) % 8) - 4) * 8
    const grain = y % 3 === 0 ? -12 : 0
    return Math.max(80, Math.min(240, 165 + ring + grain + rnd() * 30))
  },
  metal: (x, y) => {
    const streak = y % 2 === 0 ? 12 : 0
    return 175 + streak + rnd() * 25
  },
  fabric: (x, y) => {
    const knit = ((x % 2) + (y % 2)) === 1 ? 15 : 0
    return 155 + knit + rnd() * 50
  },
}
const base = {}
function baseTex(pat) {
  if (base[pat]) return base[pat]
  const c = document.createElement('canvas'); c.width = c.height = 16
  const g = c.getContext('2d')
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v = ((LUM[pat] || LUM.noise)(x, y)) | 0
      g.fillStyle = `rgb(${v},${v},${v})`; g.fillRect(x, y, 1, 1)
    }
  const t = new THREE.CanvasTexture(c)
  t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestMipmapLinearFilter
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace
  return (base[pat] = t)
}

const cache = {}
export function tex(pat = 'noise', rx = 1, ry = 1) {
  const k = `${pat}|${rx}|${ry}`
  if (!cache[k]) { const t = baseTex(pat).clone(); t.repeat.set(rx, ry); t.needsUpdate = true; cache[k] = t }
  return cache[k]
}

export function PixBox({ size, pat = 'noise', color = '#fff', emissive = '#000', emissiveIntensity = 1, ...rest }) {
  const [w, h, d] = size
  const geo = useMemo(() => {
    const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv
    const S = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]] // per-face size so pixels stay square
    for (let i = 0; i < 24; i++) uv.setXY(i, uv.getX(i) * S[i >> 2][0] * PER_M, uv.getY(i) * S[i >> 2][1] * PER_M)
    return g
  }, [w, h, d])
  return createElement('mesh', { geometry: geo, castShadow: true, receiveShadow: true, ...rest },
    createElement('meshStandardMaterial', { map: tex(pat), color, emissive, emissiveIntensity, flatShading: true }))
}
