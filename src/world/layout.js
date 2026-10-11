import { portfolio as p } from '../config/portfolio'
import { useStore, sfx } from '../store'
import { props } from './props'

// Every object is plain data: { id, pos, size, color, solid, emissive, name, label, discovery, act, when }
// `act` makes it interactable, `solid` makes it a collider. Swap the box for a GLB later in World.jsx.
const open = (m) => useStore.getState().open(m)
const list = (a) => a.map((x) => '• ' + x).join('\n')
const links = () =>
  [['EMAIL', p.contact.email && 'mailto:' + p.contact.email], ...Object.entries(p.socials).map(([k, v]) => [k.toUpperCase(), v])].map(([label, url]) => ({ label, url }))

export const resume = () =>
  open({
    title: 'TEJA OS',
    tabs: [
      { label: 'ABOUT', text: `${p.name}: ${p.title}\n\n${p.about}` },
      { label: 'EDUCATION', text: list(p.education) },
      { label: 'SKILLS', text: p.skills.map((s) => s.name).join(', ') },
      { label: 'EXPERIENCE', text: list(p.experience) },
      { label: 'PROJECTS', text: list(p.projects.map((x) => `${x.title}: ${x.description}`)) },
      { label: 'CERTS', text: list(p.certifications) },
      { label: 'CONTACT', text: [p.contact.email, ...Object.values(p.socials)].filter(Boolean).join('\n') || 'Add links in src/config/portfolio.js' },
    ],
    links: links(),
  })
export const contact = () => open({ title: "LET'S CONNECT", tabs: [{ label: '', text: p.tagline }], links: links() })

const devMode = () => open({ title: 'DEVELOPER MODE', tabs: [{ label: '', text: p.skills.map((s) => '> ' + s.name).join('\n') }] })
const skills = () => open({ title: 'SKILLS WALL', tabs: [{ label: '', text: p.skills.map((s) => `${s.name.toUpperCase()}\n${s.desc}`).join('\n\n') }] })
const core = () => open({ title: 'TEJAX CORE', tabs: Object.entries(p.tejax).map(([label, text]) => ({ label, text })) })
const future = () =>
  open({ title: 'UNDER CONSTRUCTION', tabs: [{ label: 'HERE', text: p.houseText.construction }, { label: 'FUTURE', text: p.houseText.future }] })
const coffee = () => {
  useStore.setState({ coffeeAt: Date.now() })
  useStore.getState().say('COFFEE READY ☕  Developer fuel acquired.')
  sfx(300, 0.4)
}
const final = () =>
  open({
    title: p.name.toUpperCase(),
    tabs: p.houseText.final.map((text, i) => ({ label: ['HEY', 'WELCOME', 'THANKS'][i], text })),
    actions: [
      { label: 'EXPLORE AGAIN', fn: () => { useStore.getState().reset(); location.reload() } },
      { label: 'VIEW RESUME', fn: resume },
      { label: 'CONTACT ME', fn: contact },
    ],
  })

const T = 0.3, H = 3
const wall = (x, z, w, d) => ({ pos: [x, H / 2, z], size: [w, H, d], color: '#8a6040', pat: 'rows', solid: 1 })
// House: x -8..8, z -5..5. Door at front (x 0). Living room + kitchen in front, bedroom (left) and AI lab (right) behind.
export const walls = [
  wall(-4.5, 5, 7, T), wall(4.5, 5, 7, T), wall(0, -5, 16, T), wall(-8, 0, T, 10), wall(8, 0, T, 10),
  wall(-6.5, 0, 3, T), wall(0, 0, 6, T), wall(6.5, 0, 3, T), wall(0, -2.5, T, 5),
]

const o = (id, pos, size, color, extra = {}) => ({ id, pos, size, color, ...extra })
const D = p.discoveries.length

const projects = p.projects.slice(0, 4).flatMap((pr, i) => {
  const x = 1.3 + i * 1.8
  return [
    o('pd' + i, [x, 0.45, -4.3], [0.9, 0.9, 0.9], '#12204a', { solid: 1, emissive: '#102a6e' }),
    o('pr' + i, [x, 1.4, -4.3], [0.5, 0.5, 0.5], ['#3b82f6', '#22d3ee', '#a78bfa', '#34d399'][i], {
      emissive: '#1d4ed8', name: pr.title, label: pr.title, discovery: 'archive',
      act: () => open({
        title: pr.title,
        tabs: [{ label: 'OVERVIEW', text: pr.description }, { label: 'TECH', text: pr.technologies.join(', ') }],
        links: [{ label: 'GITHUB', url: pr.github }, { label: 'LIVE DEMO', url: pr.liveDemo }],
      }),
    }),
  ]
})

export const objects = [
  ...props,
  // yard props
  o('car', [5.8, 0.8, 9.5], [2.2, 1.4, 4.2], '#e8454a', { solid: 1, hidden: 1, name: "Teja's Sports Car" }),
  // living room
  o('sofa', [-5, 0.4, 1.8], [3, 0.8, 1], '#8c3b3b', { solid: 1, pat: 'fabric' }),
  o('table', [-5, 0.2, 3.3], [1.4, 0.4, 0.8], '#6b4a2f', { solid: 1, pat: 'wood' }),
  o('tv', [-7.7, 1.2, 1.6], [0.2, 1, 1.8], '#111', { solid: 1, emissive: '#3d6bff' }),
  o('picture', [-7.78, 1.8, 3.8], [0.1, 1, 1.2], '#e0a050', { emissive: '#6b3d10', name: 'Framed picture', discovery: 'beginning', act: () => open({ title: p.houseText.pictureTitle, tabs: [{ label: '', text: p.about }] }) }),
  o('board', [-3, 1.8, 4.78], [2, 1, 0.1], '#2b2147', { emissive: '#7a4dff', name: 'Contact board', label: "LET'S CONNECT", ly: 0, ry: Math.PI, discovery: 'contact', act: contact }),
  // kitchen
  o('counter', [4.5, 0.5, 4.4], [3, 1, 0.8], '#7d6b57', { solid: 1, pat: 'wood' }),
  o('coffee', [5.5, 1.3, 4.4], [0.5, 0.6, 0.5], '#222', { solid: 1, emissive: '#ff5533', name: 'Make coffee', discovery: 'kitchen', act: coffee }),
  o('mug', [4.4, 1.08, 4.4], [0.2, 0.16, 0.2], '#f3e6c8', { hidden: 1 }),
  o('fridge', [7.3, 1.1, 4.2], [1, 2.2, 1], '#cfd8e3', { solid: 1, pat: 'metal' }),
  o('skills', [7.75, 1.4, 2], [0.1, 2.4, 2.4], '#16213a', { emissive: '#1b2f7a', name: 'Skills wall', discovery: 'skills', act: skills }),
  // bedroom + developer desk
  o('bed', [-6.7, 0.3, -3.3], [2, 0.6, 3], '#2f4f8f', { solid: 1, pat: 'fabric' }),
  o('desk', [-3, 0.4, -4.2], [3.4, 0.8, 1.2], '#5a3d2b', { solid: 1, pat: 'wood' }),
  o('chair', [-3, 0.5, -3], [0.6, 1, 0.6], '#a22', { solid: 1 }),
  o('monitor', [-3.9, 1.25, -4.55], [1.3, 0.75, 0.1], '#111', { name: 'Developer monitor', discovery: 'desk', act: devMode }),
  o('monitor2', [-2.1, 1.25, -4.55], [1.3, 0.75, 0.1], '#111'),
  o('laptop', [-3, 0.86, -3.9], [0.7, 0.06, 0.5], '#222', { emissive: '#38b6ff', name: 'Open TEJA OS', discovery: 'about', act: resume }),
  o('future', [-7.75, 1.2, -0.9], [0.2, 2.4, 1.4], '#4a3a22', { solid: 1, name: 'Locked door', label: 'UNDER CONSTRUCTION', ly: 0.3, ry: Math.PI / 2, discovery: 'future', act: future }),
  // AI lab
  o('pedestal', [4, 0.4, -2.2], [1.2, 0.8, 1.2], '#12204a', { solid: 1, emissive: '#1b3b9a', pat: 'circuit' }),
  o('core', [4, 1.7, -2.2], [1, 1, 1], '#000', { hidden: 1, name: 'TEJAX CORE', discovery: 'lab', act: core }),
  ...projects,
  // final avatar (appears once everything else is found)
  o('avatar', [0, 1, 2.2], [0.6, 2, 0.5], '#000', { hidden: 1, name: 'Talk to Teja', when: (f) => f.length >= D - 1, discovery: 'final', act: final }),
]

export const colliders = [...walls, ...objects.filter((x) => x.solid)].map(({ pos: [x, , z], size: [w, , d] }) => ({
  x0: x - w / 2, x1: x + w / 2, z0: z - d / 2, z1: z + d / 2,
}))
