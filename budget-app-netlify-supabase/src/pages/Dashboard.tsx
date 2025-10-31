
import { useStore, netForMonth, monthTxns } from '@/state/store'

export default function Dashboard() {
  const { accounts, transactions, month } = useStore(s => ({accounts:s.accounts, transactions:s.transactions, month:s.month}))
  const net = netForMonth(transactions, month)
  const mtx = monthTxns(transactions, month)

  return (
    <div>
      <h2>This month: {month}</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12}}>
        <Stat title="Net" value={formatMoney(net)} />
        <Stat title="Transactions" value={String(mtx.length)} />
        <Stat title="Accounts" value={String(accounts.length)} />
      </div>
      <p style={{marginTop:16, opacity:.8}}>Add accounts, categories, budgets, and transactions to see more insights.</p>
    </div>
  )
}

function Stat({title, value}:{title:string; value:string}){
  return <div style={{border:'1px solid #ddd', borderRadius:8, padding:12}}>
    <div style={{fontSize:12, opacity:.7}}>{title}</div>
    <div style={{fontSize:20, fontWeight:600}}>{value}</div>
  </div>
}

function formatMoney(cents:number){
  const sign = cents < 0 ? '-' : ''
  const v = Math.abs(cents)/100
  return `${sign}$${v.toFixed(2)}`
}
