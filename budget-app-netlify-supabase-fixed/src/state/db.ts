
import Dexie, { Table } from 'dexie'
import type { Account, Budget, Category, Transaction } from '@/types'

export class LocalDB extends Dexie {
  accounts!: Table<Account>
  categories!: Table<Category>
  budgets!: Table<Budget>
  transactions!: Table<Transaction>

  constructor() {
    super('budget-db')
    this.version(1).stores({
      accounts: 'id, updated_at',
      categories: 'id, updated_at',
      budgets: 'id, month, category_id, updated_at',
      transactions: 'id, date, account_id, updated_at'
    })
  }
}

export const db = new LocalDB()
