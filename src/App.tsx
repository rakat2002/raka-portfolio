import { Route, Routes } from 'react-router-dom'
import CV from './pages/CV'
import NotFound from './pages/NotFound'
import Workspace from './pages/Workspace'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Workspace />} />
      <Route path="/cv" element={<CV />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}