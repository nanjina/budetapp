
import { useState } from 'react'
import { useStore } from '@/state/store'
import type { Category } from '@/types'

const newId = () => crypto.randomUUID()

export default function Categories(){
  const { categories, upsertCategory } = useStore(s => ({ categories: s.categories, upsertCategory: s.upsertCategory }))
  const [name, setName] = useState('')
  const [type, setType] = useState<Category['type']>('expense')

  const add = async () => {
    if(!name) return
    const c: Category = { id: newId(), name, type, active: true, updated_at: new Date().toISOString() }
    await upsertCategory(c)
    setName('')
  }

  return (
    <div>
      <h2>Categories</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value as Category['type'])}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button onClick={add}>Add</button>
      </div>

      <ul style={{paddingLeft:18}}>
        {categories.map(c=>(<li key={c.id}>{c.name} <span style={{opacity:.6}}>({c.type})</span></li>))}
      </ul>
    </div>
  )
}
