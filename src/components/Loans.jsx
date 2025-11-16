import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Loans() {
  const [items, setItems] = useState([])
  const [selected, setSelected] = useState(null)
  const [payment, setPayment] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API}/loans`)
      const data = await res.json()
      setItems(data)
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  const open = async (loan) => {
    const res = await fetch(`${API}/loans/${loan.id}`)
    const full = await res.json()
    setSelected(full)
  }

  const pay = async () => {
    if (!selected) return
    try {
      await fetch(`${API}/loans/${selected.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Number(payment) })
      })
      const res = await fetch(`${API}/loans/${selected.id}`)
      const updated = await res.json()
      setSelected(updated)
      setPayment('')
      load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Loans</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Principal</th>
              <th className="p-3 text-left">Term</th>
              <th className="p-3 text-left">APR</th>
              <th className="p-3 text-left">EMI</th>
              <th className="p-3 text-left">Balance</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(l => (
              <tr key={l.id} className="border-t">
                <td className="p-3">{l.customer_id}</td>
                <td className="p-3">${l.principal.toFixed(2)}</td>
                <td className="p-3">{l.term_months} mo</td>
                <td className="p-3">{l.annual_interest_rate}%</td>
                <td className="p-3">${l.emi.toFixed(2)}</td>
                <td className="p-3">${l.balance_principal.toFixed(2)}</td>
                <td className="p-3">{l.status}</td>
                <td className="p-3"><button onClick={()=>open(l)} className="px-3 py-1 bg-blue-600 text-white rounded">View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Loan Details</h3>
            <button onClick={()=>setSelected(null)} className="text-gray-600">Close</button>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-gray-500 text-sm">Principal</div>
              <div className="text-lg font-medium">${selected.principal.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">EMI</div>
              <div className="text-lg font-medium">${selected.emi.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">APR</div>
              <div className="text-lg font-medium">{selected.annual_interest_rate}%</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm">Balance</div>
              <div className="text-lg font-medium">${selected.balance_principal.toFixed(2)}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <input className="border rounded px-3 py-2" placeholder="Payment amount" value={payment} onChange={e=>setPayment(e.target.value)} />
            <button onClick={pay} className="bg-green-600 text-white rounded px-4 py-2">Record Payment</button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 text-left">#</th>
                  <th className="p-2 text-left">Due</th>
                  <th className="p-2 text-left">Principal</th>
                  <th className="p-2 text-left">Interest</th>
                  <th className="p-2 text-left">Installment</th>
                  <th className="p-2 text-left">Paid</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {selected.schedule.map((it) => (
                  <tr key={it.installment_no} className="border-t">
                    <td className="p-2">{it.installment_no}</td>
                    <td className="p-2">{new Date(it.due_date).toLocaleDateString()}</td>
                    <td className="p-2">${Number(it.principal).toFixed(2)}</td>
                    <td className="p-2">${Number(it.interest).toFixed(2)}</td>
                    <td className="p-2">${Number(it.installment_amount).toFixed(2)}</td>
                    <td className="p-2">${Number(it.paid_amount || 0).toFixed(2)}</td>
                    <td className="p-2">{it.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Loans
