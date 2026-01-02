
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export type Category = 
  | 'Salário' 
  | 'Investimentos' 
  | 'Alimentação' 
  | 'Transporte' 
  | 'Moradia' 
  | 'Lazer' 
  | 'Saúde' 
  | 'Educação' 
  | 'Outros';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string;
}

export interface FixedBill {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

// Added Folder interface to fix missing member error in FolderNavigator
export interface Folder {
  id: string;
  name: string;
}
