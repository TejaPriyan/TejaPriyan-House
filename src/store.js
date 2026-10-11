import { create } from 'zustand'
import { portfolio } from './config/portfolio'

const KEY = 'tph-save'
let saved = {}
try { saved = JSON.parse(localStorage.getItem(KEY)) || {} } catch { /* no save yet */ }

export const useStore = create((set, get) => {
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify({ found: get().found, muted: get().muted })) } catch { /* storage blocked */ }
  }
  return {
    started: false, loading: true, modal: null, near: null, toast: null, banner: null, coffeeAt: 0,
    found: saved.found || [], muted: !!saved.muted,
    journalOpen: false, playerPos: null,
    // Loading
    setLoaded: () => set({ loading: false }),
    start: () => set({ started: true }),
    open: (modal) => { document.exitPointerLock?.(); set({ modal }) },
    close: () => set({ modal: null }),
    setNear: (near) => set((s) => (s.near === near ? s : { near })),
    setPlayerPos: (p) => set({ playerPos: p }),
    say: (toast) => { set({ toast }); setTimeout(() => get().toast === toast && set({ toast: null }), 3500) },
    toggleMute: () => { set({ muted: !get().muted }); save() },
    toggleJournal: () => {
      const next = !get().journalOpen
      if (next) document.exitPointerLock?.()
      set({ journalOpen: next })
    },
    reset: () => { set({ found: [] }); save() },
    discover: (id) => {
      const d = portfolio.discoveries.find((x) => x.id === id)
      if (!d || get().found.includes(id)) return
      const found = [...get().found, id]
      set({ found, banner: { n: found.length, title: d.title } })
      save(); sfx(880, 0.3)
      setTimeout(() => set({ banner: null }), 3500)
    },
  }
})

let ac
export const sfx = (freq = 520, len = 0.12, type = 'square') => {
  if (useStore.getState().muted) return
  try {
    ac ??= new AudioContext()
    const o = ac.createOscillator(), g = ac.createGain()
    o.type = type; o.frequency.value = freq
    g.gain.setValueAtTime(0.05, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + len)
    o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + len)
  } catch { /* audio unavailable: continue silently */ }
}

// Footstep sound with surface variation
let lastStep = 0
export const footstep = (surface = 'wood') => {
  const now = Date.now()
  if (now - lastStep < 300) return
  lastStep = now
  const freqs = { wood: 180, grass: 120, tile: 260, stone: 200 }
  sfx((freqs[surface] || 180) + Math.random() * 30, 0.06, 'triangle')
}
