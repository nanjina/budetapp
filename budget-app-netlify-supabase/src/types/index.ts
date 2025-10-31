
export type ID = string;
export type Money = number; // cents

export type YearMonth = `${number}-${'01'|'02'|'03'|'04'|'05'|'06'|'07'|'08'|'09'|'10'|'11'|'12'}`;

export type AccountType = 'cash'|'credit'|'chequing'|'savings';

export interface Account {
  id: ID;
  name: string;
  type: AccountType;
  opening_balance: Money;
  active: boolean;
  updated_at: string;
}

export type CategoryType = 'expense'|'income';

export interface Category {
  id: ID;
  name: string;
  type: CategoryType;
  active: boolean;
  updated_at: string;
}

export interface Budget {
  id: ID;
  month: YearMonth;
  category_id: ID;
  amount: Money;
  updated_at: string;
}

export type TxType = 'expense'|'income'|'transfer';

export interface Transaction {
  id: ID;
  date: string; // YYYY-MM-DD (local)
  account_id: ID;
  amount: Money; // negative for expense, positive for income; for transfer, sign follows source leg
  type: TxType;
  payee?: string;
  memo?: string;
  is_transfer: boolean;
  transfer_pair_id?: ID;
  updated_at: string;
  category_id?: ID; // simple mode without splits
}
