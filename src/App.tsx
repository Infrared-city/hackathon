import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout }          from './components/layout/Layout'
import { LandingPage }     from './pages/LandingPage'
import { ParticipantsPage } from './pages/ParticipantsPage'
import { GetKeyPage }      from './pages/GetKeyPage'
import { SubmitPage }      from './pages/SubmitPage'
import { ProjectsPage }    from './pages/ProjectsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"             element={<LandingPage />} />
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/get-key"      element={<GetKeyPage />} />
          <Route path="/submit"       element={<SubmitPage />} />
          <Route path="/projects"     element={<ProjectsPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
