import { createRoot } from 'react-dom/client'
import { portfolio } from './config/portfolio'
import App from './App'
import './styles.css'

Object.entries(portfolio.colors).forEach(([k, v]) => document.documentElement.style.setProperty('--' + k, v))
createRoot(document.getElementById('root')).render(<App />)
