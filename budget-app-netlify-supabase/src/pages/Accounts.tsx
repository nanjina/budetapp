
import { useState } from 'react'
import { useStore, calcAccountBalance } from '@/state/store'
import type { Account } from '@/types'

const newId = () => crypto.randomUUID()

export default function Accounts(){
  const { accounts, transactions, upsertAccount } = useStore(s => ({
    accounts: s.accounts, transactions: s.transactions, upsertAccount: s.upsertAccount
  }))

  const [name, setName] = useState('')
  const [type, setType] = useState<Account['type']>('chequing')
  const [opening, setOpening] = useState('0')

  const add = async () => {
    if(!name) return
    const acc: Account = {
      id: newId(),
      name, type,
      opening_balance: Math.round(parseFloat(opening||'0')*100),
      active: true,
      updated_at: new Date().toISOString()
    }
    await upsertAccount(acc)
    setName(''); setOpening('0')
  }

  return (
    <div>
      <h2>Accounts</h2>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <select value={type} onChange={e=>setType(e.target.value as Account['type'])}>
          <option value="cash">Cash</option>
          <option value="credit">Credit</option>
          <option value="chequing">Chequing</option>
          <option value="savings">Savings</option>
        </select>
        <input type="number" step="0.01" value={opening} onChange={e=>setOpening(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>

      <table width="100%" cellPadding="6" style={{borderCollapse:'collapse'}}>
        <thead>
          <tr><th align="left">Name</th><th>Type</th><th align="right">Balance</th></tr>
        </thead>
        <tbody>
          {accounts.map(a=>{
            const bal = calcAccountBalance(a.id, accounts, transactions)
            return <tr key={a.id} style={{borderTop:'1px solid #eee'}}>
              <td>{a.name}</td>
              <td align="center">{a.type}</td>
              <td align="right">{formatMoney(bal)}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}

function formatMoney(cents:number){
  const sign = cents < 0 ? '-' : ''
  const v = Math.abs(cents)/100
  return `${sign}$${v.toFixed(2)}`
}
