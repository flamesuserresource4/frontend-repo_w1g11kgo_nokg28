import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Applications() {
  const [items, setItems] = useState([])
  const [customers, setCustomers] = useState([])
  const [form, setForm] = useState({ customer_id: '', amount: '', term_months: 12, annual_interest_rate: 12, purpose: '' })

  const load = async () => {
    try {
      const [appsRes, custRes] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${API}/customers`)
      ])
      setItems(await appsRes.json())
      setCustomers(await custRes.json())
    } catch (e) { console.error(e) }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, amount: Number(form.amount), term_months: Number(form.term_months), annual_interest_rate: Number(form.annual_interest_rate) })
      })
      setForm({ customer_id: '', amount: '', term_months: 12, annual_interest_rate: 12, purpose: '' })
      load()
    } catch (e) { console.error(e) }
  }

  const decide = async (id, decision) => {
    const body = { decision }
    try {
      await fetch(`${API}/applications/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Applications</h2>

      <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <select className="border rounded px-3 py-2 col-span-2" value={form.customer_id} onChange={e=>setForm({...form, customer_id:e.target.value})}>
          <option value="">Select customer</option>
          {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
        </select>
        <input className="border rounded px-3 py-2" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Term (months)" value={form.term_months} onChange={e=>setForm({...form, term_months:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="APR %" value={form.annual_interest_rate} onChange={e=>setForm({...form, annual_interest_rate:e.target.value})} />
        <input className="border rounded px-3 py-2 col-span-2" placeholder="Purpose" value={form.purpose} onChange={e=>setForm({...form, purpose:e.target.value})} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 col-span-2 md:col-span-1">Submit</button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Term</th>
              <th className="p-3 text-left">APR</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(a => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.customer_id}</td>
                <td className="p-3">${a.amount.toFixed(2)}</td>
                <td className="p-3">{a.term_months} mo</td>
                <td className="p-3">{a.annual_interest_rate}%</td>
                <td className="p-3">{a.status}</td>
                <td className="p-3 space-x-2">
                  {a.status === 'pending' && (
                    <>
                      <button onClick={()=>decide(a.id, 'approve')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
                      <button onClick={()=>decide(a.id, 'reject')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Applications
