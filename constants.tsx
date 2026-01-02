
import { Category } from './types';

export const CATEGORIES: Category[] = [
  'Salário',
  'Investimentos',
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Outros'
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Salário': '#10b981',
  'Investimentos': '#3b82f6',
  'Alimentação': '#f59e0b',
  'Transporte': '#6366f1',
  'Moradia': '#ef4444',
  'Lazer': '#ec4899',
  'Saúde': '#14b8a6',
  'Educação': '#8b5cf6',
  'Outros': '#64748b'
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
