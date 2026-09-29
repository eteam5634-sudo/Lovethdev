import { About } from './components/About'
import { AuroraBackground } from './components/AuroraBackground'
import { ComponentLab } from './components/ComponentLab'
import { Contact } from './components/Contact'
import { DesignPlayground } from './components/DesignPlayground'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { MiniApps } from './components/MiniApps'
import { Navbar } from './components/Navbar'
import { Philosophy } from './components/Philosophy'
import { ProjectExplorer } from './components/ProjectExplorer'
import { Stats } from './components/Stats'
import { TechnologyWall } from './components/TechnologyWall'
import { Terminal } from './components/Terminal'
import { UIExperiments } from './components/UIExperiments'

function App() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-cyan-400 focus:px-4 focus:py-2 focus:text-slate-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Intro />
        <ProjectExplorer />
        <UIExperiments />
        <MiniApps />
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
    </div>
  )
}

export default App
