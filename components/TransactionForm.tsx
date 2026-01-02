
import React, { useState } from 'react';
import { Transaction, TransactionType, Category } from '../types';
import { CATEGORIES } from '../constants.tsx';
import { PlusCircle, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface Props {
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<Props> = ({ onAdd }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState<Category>('Outros');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAdd({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date
    });

    setDescription('');
    setAmount('');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="text-indigo-600" />
        Nova Transação
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
              type === TransactionType.INCOME 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-semibold' 
                : 'border-slate-100 hover:border-slate-200 text-slate-500'
            }`}
          >
            <ArrowUpCircle size={20} />
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
              type === TransactionType.EXPENSE 
                ? 'border-rose-500 bg-rose-50 text-rose-700 font-semibold' 
                : 'border-slate-100 hover:border-slate-200 text-slate-500'
            }`}
          >
            <ArrowDownCircle size={20} />
            Saída
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
            placeholder="Ex: Supermercado, Salário..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="0,00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
        >
          Salvar Transação
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
