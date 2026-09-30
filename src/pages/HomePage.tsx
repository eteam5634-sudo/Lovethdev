import { About } from '../components/About'
import { ComponentLab } from '../components/ComponentLab'
import { Contact } from '../components/Contact'
import { DesignPlayground } from '../components/DesignPlayground'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Intro } from '../components/Intro'
import { MiniApps } from '../components/MiniApps'
import { Philosophy } from '../components/Philosophy'
import { ProjectExplorer } from '../components/ProjectExplorer'
import { Stats } from '../components/Stats'
import { TechnologyWall } from '../components/TechnologyWall'
import { Terminal } from '../components/Terminal'
import { UIExperiments } from '../components/UIExperiments'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function HomePage() {
  const location = useLocation()

  useEffect(() => {
    document.title = 'LovethDev Playground | Build. Experiment. Learn.'
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      window.requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.hash])

  return (
    <>
      <main id="main-content">
        <Hero />
        <Intro />
        <ProjectExplorer />
        <UIExperiments />
        <div id="miniapps">
          <MiniApps />
        </div>
        <ComponentLab />
        <TechnologyWall />
        <Terminal />
        <DesignPlayground />
        <Philosophy />
        <Stats />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
