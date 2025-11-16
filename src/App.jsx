import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Customers from './components/Customers'
import Applications from './components/Applications'
import Loans from './components/Loans'

function App() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">Loan Management</div>
          <nav className="flex gap-2">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'customers', label: 'Customers' },
              { id: 'applications', label: 'Applications' },
              { id: 'loans', label: 'Loans' },
            ].map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} className={`px-3 py-2 rounded-md text-sm font-medium ${tab===t.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'customers' && <Customers />}
        {tab === 'applications' && <Applications />}
        {tab === 'loans' && <Loans />}
      </main>
    </div>
  )
}

export default App
