import { useEffect, useState, useRef, useCallback } from 'react'
import { useStore } from '../store'
import { objects } from '../world/layout'
import { portfolio as p } from '../config/portfolio'

const isMobile = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0

// ===== TYPEWRITER TEXT =====
function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(true); return }
    setDisplayed(''); setDone(false)
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(iv); setDone(true) }
    }, speed)
    return () => clearInterval(iv)
  }, [text, speed])
  return <>{displayed}{!done && <span className="typewriter-cursor" />}</>
}

// ===== LOADING SCREEN =====
function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const setLoaded = useStore(s => s.setLoaded)

  useEffect(() => {
    const steps = [8, 20, 35, 50, 65, 78, 90, 100]
    let i = 0
    const iv = setInterval(() => {
      if (i < steps.length) {
        setProgress(steps[i]); i++
      } else {
        clearInterval(iv); setReady(true)
        setTimeout(() => setLoaded(), 500)
      }
    }, 280)
    return () => clearInterval(iv)
  }, [setLoaded])

  const messages = [
    'Generating textures...',
    'Building rooms...',
    'Placing furniture...',
    'Booting TEJA OS...',
    'Calibrating pixels...',
    'Lighting the campfire...',
    'Loading discoveries...',
    'Ready!',
  ]
  const msgIdx = Math.min(Math.floor(progress / 13), messages.length - 1)

  // Pixel art house ASCII
  const house = `    ▄████▄
   ██    ██
  ██  ██  ██
  ██ ████ ██
  ▀▀▀▀▀▀▀▀▀▀`

  return (
    <div className={`loading ${ready ? 'loading-done' : ''}`}>
      <div className="loading-house">{house}</div>
      <div className="loading-title">TEJA PRIYAN HOUSE</div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-text">{messages[msgIdx]}</div>
      <div className="loading-pixels">
        {[0, 1, 2, 3, 4].map(i => <div key={i} className="loading-pixel" />)}
      </div>
    </div>
  )
}

// ===== MINIMAP =====
function Minimap() {
  const canvasRef = useRef()
  const playerPos = useStore(s => s.playerPos)
  const found = useStore(s => s.found)

  useEffect(() => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const W = 140, H = 88
    cv.width = W; cv.height = H

    // Transform: map world coords to canvas
    const tx = (x) => ((x + 12) / 30) * W
    const tz = (z) => ((17 - z) / 24) * H
    const tw = (w) => (w / 30) * W
    const th = (h) => (h / 24) * H

    // Background (grass)
    ctx.fillStyle = '#0e1a0e'; ctx.fillRect(0, 0, W, H)

    // Yard path
    ctx.fillStyle = '#2a2520'
    ctx.fillRect(tx(-1), tz(15), tw(2), th(10))

    // Porch
    ctx.fillStyle = '#2a2822'
    ctx.fillRect(tx(-1.6), tz(7.5), tw(3.2), th(2.2))

    // House floor
    ctx.fillStyle = '#1a1208'
    ctx.fillRect(tx(-8), tz(5), tw(16), th(10))

    // AI Lab floor
    ctx.fillStyle = '#08101a'
    ctx.fillRect(tx(0), tz(0), tw(8), th(5))

    // Walls
    ctx.fillStyle = '#6a4a30'
    const wt = 2 // wall thickness in pixels
    // Front walls (with door gap)
    ctx.fillRect(tx(-8), tz(5), tw(7), wt)
    ctx.fillRect(tx(1), tz(5), tw(7), wt)
    // Back wall
    ctx.fillRect(tx(-8), tz(-5), tw(16), wt)
    // Left wall
    ctx.fillRect(tx(-8), tz(5), wt, th(10))
    // Right wall
    ctx.fillRect(tx(8) - wt, tz(5), wt, th(10))
    // Internal walls
    ctx.fillRect(tx(-8), tz(0), tw(3), wt)
    ctx.fillRect(tx(-3), tz(0), tw(6), wt)
    ctx.fillRect(tx(5), tz(0), tw(3), wt)
    ctx.fillRect(tx(0) - 1, tz(0), wt, th(5))

    // Room labels
    ctx.fillStyle = '#fff3'
    ctx.font = '6px monospace'
    ctx.textAlign = 'center'
    ctx.fillText('LR', tx(-4), tz(2.2))
    ctx.fillText('KT', tx(4), tz(2.2))
    ctx.fillText('BR', tx(-4), tz(-2.8))
    ctx.fillText('LAB', tx(4), tz(-2.8))

    // Campfire
    ctx.fillStyle = '#ff6622'
    ctx.fillRect(tx(-3) - 2, tz(10) - 2, 4, 4)

    // Pond
    ctx.fillStyle = '#1a4a6a'
    ctx.fillRect(tx(7.8), tz(11), tw(2.5), th(2))

    // Player dot
    if (playerPos) {
      const px = tx(playerPos[0]), pz = tz(playerPos[1])
      // Glow
      ctx.fillStyle = '#ff9d4d44'
      ctx.fillRect(px - 4, pz - 4, 8, 8)
      // Dot
      ctx.fillStyle = '#ff9d4d'
      ctx.fillRect(px - 2, pz - 2, 4, 4)
    }

    // Fence
    ctx.fillStyle = '#4a3a25'
    ctx.fillRect(tx(-17), tz(15.5), tw(34), wt)

  }, [playerPos, found])

  return (
    <div className="minimap">
      <span className="minimap-label">MAP</span>
      <canvas ref={canvasRef} />
    </div>
  )
}

// ===== DISCOVERY JOURNAL =====
function Journal() {
  const found = useStore(s => s.found)
  const journalOpen = useStore(s => s.journalOpen)
  const toggleJournal = useStore(s => s.toggleJournal)
  const total = p.discoveries.length

  useEffect(() => {
    const k = (e) => {
      if (e.code === 'Tab' && useStore.getState().started) {
        e.preventDefault(); toggleJournal()
      }
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [toggleJournal])

  if (!journalOpen) return null

  return (
    <div className="journal-bg" onClick={toggleJournal}>
      <div className="journal" onClick={e => e.stopPropagation()}>
        <h2>📖 DISCOVERY JOURNAL</h2>
        <div className="journal-count">{found.length}/{total} DISCOVERED</div>
        <div className="journal-bar-track">
          <div className="journal-bar-fill" style={{ width: `${(found.length / total) * 100}%` }} />
        </div>
        <div className="journal-grid">
          {p.discoveries.map((d) => {
            const isFound = found.includes(d.id)
            return (
              <div key={d.id} className={`journal-item ${isFound ? 'found' : ''}`}>
                <span className="journal-icon">{isFound ? '◆' : '◇'}</span>
                <span className="journal-name">{isFound ? d.title : '? ? ?'}</span>
              </div>
            )
          })}
        </div>
        <div className="journal-hint">Press TAB to close</div>
        <button className="journal-close" onClick={toggleJournal}>CLOSE</button>
      </div>
    </div>
  )
}

// ===== MODAL WITH TYPEWRITER =====
function Modal() {
  const m = useStore((s) => s.modal), close = useStore((s) => s.close)
  const [i, setI] = useState(0)
  useEffect(() => setI(0), [m])
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && close()
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [close])
  if (!m) return null
  return (
    <div className="modal-bg" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header><b>{m.title}</b><button onClick={close} aria-label="Close">X</button></header>
        {m.tabs.length > 1 && (
          <nav>{m.tabs.map((t, j) => <button key={j} className={j === i ? 'on' : ''} onClick={() => setI(j)}>{t.label}</button>)}</nav>
        )}
        <p><TypewriterText key={`${m.title}-${i}`} text={m.tabs[i]?.text} /></p>
        <footer>
          {(m.links || []).filter((l) => l.url).map((l) => <a key={l.label} href={l.url} target="_blank" rel="noreferrer">{l.label}</a>)}
          {(m.actions || []).map((a) => <button key={a.label} onClick={a.fn}>{a.label}</button>)}
        </footer>
      </div>
    </div>
  )
}

// ===== ROOM LABEL OVERLAY =====
function RoomLabel() {
  const [room, setRoom] = useState(null)
  const lastRoom = useRef(null)
  const playerPos = useStore(s => s.playerPos)

  useEffect(() => {
    if (!playerPos) return
    const [x, z] = playerPos
    let r = null
    if (x > -8 && x < 8 && z > -5 && z < 5) {
      if (x < 0 && z > 0) r = 'LIVING ROOM'
      else if (x >= 0 && z > 0) r = 'KITCHEN'
      else if (x < 0 && z <= 0) r = 'BEDROOM'
      else r = 'AI LAB'
    } else if (Math.abs(x) < 2 && z > 5 && z < 8) {
      r = 'FRONT PORCH'
    } else if (z > 5) {
      r = 'YARD'
    }

    if (r && r !== lastRoom.current) {
      lastRoom.current = r
      setRoom(r)
      setTimeout(() => setRoom(null), 2500)
    } else if (!r) {
      lastRoom.current = null
    }
  }, [playerPos])

  if (!room) return null
  return <div className="room-label" key={room}>{room}</div>
}

// ===== MOBILE CONTROLS OVERLAY =====
function MobileControls() {
  const started = useStore(s => s.started)
  const [mobile, setMobile] = useState(false)
  useEffect(() => { setMobile(isMobile()) }, [])

  if (!mobile || !started) return null
  return (
    <>
      {/* Left joystick zone indicator */}
      <div className="mobile-joystick-zone" aria-hidden>
        <div className="mobile-joystick-ring">
          <div className="mobile-joystick-label">DRAG TO MOVE</div>
        </div>
      </div>
      {/* Right look zone indicator */}
      <div className="mobile-look-zone" aria-hidden>
        <div className="mobile-look-label">DRAG TO LOOK</div>
      </div>
      {/* Interact button */}
      <button
        className="mobile-interact-btn"
        onTouchStart={(e) => {
          e.stopPropagation()
          // Simulate E key press for interaction
          window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyE' }))
          setTimeout(() => window.dispatchEvent(new KeyboardEvent('keyup', { code: 'KeyE' })), 100)
        }}
      >
        INTERACT
      </button>
    </>
  )
}

// ===== MAIN UI =====
export default function UI() {
  const s = useStore()
  const total = p.discoveries.length
  const go = () => { s.start(); document.querySelector('canvas')?.requestPointerLock() }
  const target = objects.find((o) => o.id === s.near)

  return (
    <>
      {/* Loading screen */}
      {s.loading && <LoadingScreen />}

      {/* Start screen */}
      {!s.started && !s.loading && (
        <div className="start">
          <h1>{p.name.toUpperCase()}<br />HOUSE</h1>
          <p>ENTER MY WORLD</p>
          <button onClick={go}>[ ENTER ]</button>
          <small>{p.tagline}</small>
          <div className="start-controls">
            {isMobile()
              ? 'Left Drag Move · Right Drag Look · Tap Interact'
              : 'WASD Move · Shift Run · Mouse Look · E Interact · Tab Journal · Esc Close'
            }
          </div>
        </div>
      )}

      {/* In-game HUD */}
      {s.started && (
        <>
          <div className="hud tl">DISCOVERIES {s.found.length}/{total}</div>
          <div className="hud tr">
            <button onClick={s.toggleMute}>{s.muted ? 'UNMUTE' : 'MUTE'}</button>
            <button onClick={s.reset}>RESET</button>
          </div>
          <div className="hud bl">WASD MOVE · TAB JOURNAL</div>
          <div className="hud br">CLICK / E INTERACT</div>
          {!isMobile() && <div className="dot" />}
          <Minimap />
          <MobileControls />
          <RoomLabel />
          {target && !s.modal && !s.journalOpen && <div className="prompt">[ E ] {target.name.toUpperCase()}</div>}
          {s.banner && (
            <div className="banner">
              <small>NEW DISCOVERY</small>
              <div>{String(s.banner.n).padStart(2, '0')}/{total} {s.banner.title}</div>
            </div>
          )}
          {s.toast && <div className="toast">{s.toast}</div>}
        </>
      )}

      {/* Journal overlay */}
      <Journal />

      {/* Modal overlay */}
      <Modal />
    </>
  )
}
