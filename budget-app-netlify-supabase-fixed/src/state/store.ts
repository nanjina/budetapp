
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { db } from './db'
import type { Account, Category, Budget, Transaction, ID, YearMonth, Money } from '@/types'

type State = {
  accounts: Account[]
  categories: Category[]
  budgets: Budget[]
  transactions: Transaction[]
  month: YearMonth
}

type Actions = {
  loadAll: () => Promise<void>
  setMonth: (m: YearMonth) => void
  upsertAccount: (a: Account) => Promise<void>
  upsertCategory: (c: Category) => Promise<void>
  upsertBudget: (b: Budget) => Promise<void>
  addTransaction: (t: Transaction) => Promise<void>
  deleteTransaction: (id: ID) => Promise<void>
}

const today = new Date()
const ym = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}` as YearMonth

export const useStore = create<State & Actions>()(devtools((set, get) => ({
  accounts: [], categories: [], budgets: [], transactions: [], month: ym,

  async loadAll() {
    const [accounts, categories, budgets, transactions] = await Promise.all([
      db.accounts.toArray(),
      db.categories.toArray(),
      db.budgets.toArray(),
      db.transactions.toArray()
    ])
    set({ accounts, categories, budgets, transactions })
  },

  setMonth(m) { set({ month: m }) },

  async upsertAccount(a) {
    await db.accounts.put(a)
    const accounts = await db.accounts.toArray()
    set({ accounts })
  },

  async upsertCategory(c) {
    await db.categories.put(c)
    const categories = await db.categories.toArray()
    set({ categories })
  },

  async upsertBudget(b) {
    await db.budgets.put(b)
    const budgets = await db.budgets.toArray()
    set({ budgets })
  },

  async addTransaction(t) {
    await db.transactions.put(t)
    const transactions = await db.transactions.toArray()
    set({ transactions })
  },

  async deleteTransaction(id) {
    await db.transactions.delete(id)
    const transactions = await db.transactions.toArray()
    set({ transactions })
  },
})))

// Helpers
export function calcAccountBalance(accId: ID, accounts: Account[], txns: Transaction[]): Money {
  const acc = accounts.find(a => a.id === accId)
  const base = acc?.opening_balance ?? 0
  const delta = txns.filter(t => t.account_id === accId).reduce((sum, t) => sum + t.amount, 0)
  return base + delta
}

export function monthTxns(txns: Transaction[], month: YearMonth): Transaction[] {
  return txns.filter(t => t.date.startsWith(month))
}

export function categoryActualForMonth(categoryId: ID, txns: Transaction[], month: YearMonth): Money {
  return monthTxns(txns, month)
    .filter(t => t.type !== 'transfer' && t.category_id === categoryId)
    .reduce((s, t) => s + (t.amount < 0 ? -t.amount : t.amount), 0) * (1) // expense positive value
}

export function netForMonth(txns: Transaction[], month: YearMonth): Money {
  const m = monthTxns(txns, month)
  const income = m.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = m.filter(t => t.type === 'expense').reduce((s, t) => s + (-t.amount), 0)
  return income - expense
}
