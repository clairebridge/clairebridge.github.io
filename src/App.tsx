import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Work } from './pages/Work'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/'

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/work" element={<Work />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}