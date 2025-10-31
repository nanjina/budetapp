
import { useState } from 'react'
import { useStore, categoryActualForMonth } from '@/state/store'
import type { Budget } from '@/types'

const newId = () => crypto.randomUUID()

export default function Budgets(){
  const { month, categories, budgets, transactions, upsertBudget } = useStore(s => ({
    month: s.month, categories: s.categories, budgets: s.budgets, transactions: s.transactions, upsertBudget: s.upsertBudget
  }))

  const [selCat, setSelCat] = useState<string>('')
  const [amount, setAmount] = useState('0')

  const add = async () => {
    if(!selCat) return
    const b: Budget = { id: newId(), month, category_id: selCat, amount: Math.round(parseFloat(amount||'0')*100), updated_at: new Date().toISOString() }
    await upsertBudget(b)
    setAmount('0')
  }

  return (
    <div>
      <h2>Budgets — {month}</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <select value={selCat} onChange={e=>setSelCat(e.target.value)}>
          <option value="">Select category</option>
          {categories.filter(c=>c.type==='expense').map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={add}>Set</button>
      </div>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Category</th><th align="right">Budget</th><th align="right">Actual</th><th align="right">Diff</th></tr></thead>
        <tbody>
          {budgets.filter(b=>b.month===month).map(b=>{
            const cat = categories.find(c=>c.id===b.category_id)
            const actual = categoryActualForMonth(b.category_id, transactions, month)
            const diff = (b.amount - actual)
            return <tr key={b.id} style={{borderTop:'1px solid #eee'}}>
              <td>{cat?.name ?? 'Unknown'}</td>
              <td align="right">{fmt(b.amount)}</td>
              <td align="right">{fmt(actual)}</td>
              <td align="right" style={{color: diff<0 ? 'crimson' : 'seagreen'}}>{fmt(diff)}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

function fmt(cents:number){
  const sign = cents < 0 ? '-' : ''
  const v = Math.abs(cents)/100
  return `${sign}$${v.toFixed(2)}`
}
