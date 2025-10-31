
import { useState } from 'react'
import { useStore } from '@/state/store'
import type { Transaction } from '@/types'

const newId = () => crypto.randomUUID()

export default function Transactions(){
  const { accounts, categories, transactions, addTransaction, deleteTransaction, month } = useStore(s => ({
    accounts: s.accounts, categories: s.categories, transactions: s.transactions, addTransaction: s.addTransaction, deleteTransaction: s.deleteTransaction, month: s.month
  }))

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0,10))
  const [accountId, setAccountId] = useState<string>('')
  const [type, setType] = useState<Transaction['type']>('expense')
  const [categoryId, setCategoryId] = useState<string>('')
  const [amount, setAmount] = useState('0')
  const [payee, setPayee] = useState('')
  const [memo, setMemo] = useState('')

  const save = async () => {
    if(!accountId) return
    const amt = Math.round(parseFloat(amount||'0')*100)
    const t: Transaction = {
      id: newId(),
      date, account_id: accountId,
      amount: type === 'expense' ? -Math.abs(amt) : Math.abs(amt),
      type, category_id: categoryId || undefined,
      payee: payee || undefined, memo: memo || undefined,
      is_transfer: type === 'transfer',
      updated_at: new Date().toISOString()
    }
    await addTransaction(t)
    setAmount('0'); setPayee(''); setMemo('')
  }

  const monthTxns = transactions.filter(t => t.date.startsWith(month))

  return (
    <div>
      <h2>Transactions — {month}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:8, alignItems:'end', marginBottom:12}}>
        <div>
          <label>Date</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div>
          <label>Account</label>
          <select value={accountId} onChange={e=>setAccountId(e.target.value)}>
            <option value="">Select</option>
            {accounts.map(a=>(<option key={a.id} value={a.id}>{a.name}</option>))}
          </select>
        </div>
        <div>
          <label>Type</label>
          <select value={type} onChange={e=>setType(e.target.value as Transaction['type'])}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
            <option value="transfer">Transfer</option>
          </select>
        </div>
        {type!=='transfer' && <div>
          <label>Category</label>
          <select value={categoryId} onChange={e=>setCategoryId(e.target.value)}>
            <option value="">(none)</option>
            {categories.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>}
        <div>
          <label>Amount</label>
          <input type="number" step="0.01" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>
        <div>
          <label>Payee</label>
          <input value={payee} onChange={e=>setPayee(e.target.value)} />
        </div>
        <div>
          <label>Memo</label>
          <input value={memo} onChange={e=>setMemo(e.target.value)} />
        </div>
        <div>
          <button onClick={save}>Add</button>
        </div>
      </div>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead><tr><th align="left">Date</th><th align="left">Account</th><th>Type</th><th align="right">Amount</th><th align="left">Category</th><th align="left">Payee</th><th></th></tr></thead>
        <tbody>
          {monthTxns.map(t=>{
            const acc = accounts.find(a=>a.id===t.account_id)?.name ?? '—'
            const cat = categories.find(c=>c.id===t.category_id ?? '')?.name ?? '—'
            return <tr key={t.id} style={{borderTop:'1px solid #eee'}}>
              <td>{t.date}</td>
              <td>{acc}</td>
              <td align="center">{t.type}</td>
              <td align="right" style={{color: t.amount<0 ? 'crimson' : 'seagreen'}}>{fmt(t.amount)}</td>
              <td>{cat}</td>
              <td>{t.payee ?? ''}</td>
              <td align="right"><button onClick={()=>deleteTransaction(t.id)}>Delete</button></td>
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
