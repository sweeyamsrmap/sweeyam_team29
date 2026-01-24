import { useNavigate } from 'react-router-dom'

function RoleSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">E</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">ESG Ledger</h1>
          <p className="text-slate-600">Blockchain-based ESG Data Verification Platform</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <span className="text-3xl">👤</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Organization</h2>
            <p className="text-slate-600 mb-4">Submit and track your ESG data submissions</p>
            <ul className="text-left text-sm text-slate-500 space-y-2">
              <li>✓ Submit ESG reports</li>
              <li>✓ Track verification status</li>
              <li>✓ View submission history</li>
              <li>✓ Download certificates</li>
            </ul>
          </button>

          <button
            onClick={() => navigate('/admin')}
            className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all group"
          >
            <div className="w-16 h-16 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors">
              <span className="text-3xl">👨‍💼</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Panel</h2>
            <p className="text-slate-600 mb-4">Review and verify ESG submissions</p>
            <ul className="text-left text-sm text-slate-500 space-y-2">
              <li>✓ Review pending submissions</li>
              <li>✓ Approve or reject reports</li>
              <li>✓ Mint blockchain certificates</li>
              <li>✓ Manage verification queue</li>
            </ul>
          </button>
        </div>

        <div className="text-center mt-8 text-sm text-slate-500">
          <p>Secure • Transparent • Immutable</p>
        </div>
      </div>
    </div>
  )
}

export default RoleSelection
