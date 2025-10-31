
import { NavLink, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import Categories from './pages/Categories'
import Budgets from './pages/Budgets'
import Transactions from './pages/Transactions'
import { useEffect } from 'react'
import { useStore } from './state/store'

export default function App() {
  const loadAll = useStore(s => s.loadAll)
  useEffect(() => { loadAll() }, [loadAll])

  return (
    <div style={{maxWidth: 900, margin: '0 auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial'}}>
      <header style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between'}}>
        <h1 style={{fontSize: 20, margin: 0}}>Budget</h1>
        <nav style={{display:'flex', gap:12}}>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/accounts">Accounts</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
        </nav>
      </header>
      <main style={{marginTop: 16}}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
      <footer style={{marginTop: 32, fontSize: 12, opacity: 0.7}}>
        Netlify-ready • Offline capable • Supabase-ready
      </footer>
    </div>
  )
}
