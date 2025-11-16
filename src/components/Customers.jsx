import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Customers() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '' })
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/customers`)
      const data = await res.json()
      setItems(data)
    } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    try {
      await fetch(`${API}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      setForm({ first_name: '', last_name: '', email: '', phone: '' })
      load()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
      </div>

      <form onSubmit={submit} className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input className="border rounded px-3 py-2" placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <input className="border rounded px-3 py-2" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <button className="bg-blue-600 text-white rounded px-4 py-2 col-span-2 md:col-span-1">Add</button>
      </form>

      {loading ? (<div>Loading...</div>) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
              </tr>
            </thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.first_name} {c.last_name}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Customers
