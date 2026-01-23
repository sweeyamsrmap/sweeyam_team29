import Sidebar from './components/Sidebar'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import SubmissionForm from './components/SubmissionForm'
import BlockchainProof from './components/BlockchainProof'
import VerificationPanel from './components/VerificationPanel'
import StatsGrid from './components/StatsGrid'

function App() {
  return (
    <div className="flex min-h-screen bg-background-light dark:bg-background-dark">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
          <HeroSection />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SubmissionForm />
            <BlockchainProof />
          </div>
          
          <VerificationPanel />
          
          <StatsGrid />
        </div>
      </main>
    </div>
  )
}

export default App
