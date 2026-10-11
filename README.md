# TEJA PRIYAN HOUSE

A walkable low-poly pixel-art portfolio built with React, Vite and React Three Fiber.

```
npm install
npm run dev      # develop
npm run build    # deploy the dist/ folder to Vercel, Netlify or GitHub Pages
```

## Controls
WASD move, Shift run, mouse look (click to lock the pointer), E or click to interact, Esc closes a window.

## Edit your content
Everything is in `src/config/portfolio.js`: name, about, skills, projects (GitHub / live demo URLs; empty ones hide their button), resume sections, contact links, colors and the discovery list. Progress is saved in localStorage; use RESET in the top-right to clear it.

## How it works
- `src/world/layout.js`: walls, furniture and interactables as plain data. An object with `act` is interactable, `solid` makes it a collider, `discovery` unlocks a discovery.
- `src/components/World.jsx`: renders that data as procedural low-poly geometry. To use a GLB, load it with `useGLTF` inside `Obj` and fall back to the box if it fails.
- `src/components/Player.jsx`: first-person movement with acceleration, wall sliding, head bob and the "nearest object" check.
- `src/ui/UI.jsx` and `src/store.js`: HUD, modals, discovery banner, sounds and saving.
- Avatar placeholder: search for `TEJA AVATAR PLACEHOLDER` in `World.jsx`.

## Not built yet
Mobile joystick, loading screen, ambient music files, cinematic camera transitions, dedicated Project Archive room, GLB models.
