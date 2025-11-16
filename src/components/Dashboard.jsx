import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
    </div>
  )
}

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/dashboard`)
        const data = await res.json()
        setStats(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Stat label="Customers" value={stats?.totals?.customers ?? 0} />
        <Stat label="Applications" value={stats?.totals?.applications ?? 0} />
        <Stat label="Loans" value={stats?.totals?.loans ?? 0} />
        <Stat label="Active Loans" value={stats?.totals?.active_loans ?? 0} />
        <Stat label="Closed Loans" value={stats?.totals?.closed_loans ?? 0} />
        <Stat label="Outstanding" value={`$${stats?.financials?.outstanding_principal?.toFixed?.(2) ?? '0.00'}`} />
      </div>
    </div>
  )
}

export default Dashboard
