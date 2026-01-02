
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency, CATEGORY_COLORS } from '../constants.tsx';
import { Trash2, ShoppingBag, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, onDelete }) => {
  const sorted = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <ShoppingBag className="text-indigo-600" size={20} />
          Últimas Transações
        </h2>
        <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-full">
          {transactions.length} total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Transação</th>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4">Valor</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {t.type === TransactionType.INCOME ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                    </div>
                    <span className="font-medium text-slate-700">{t.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: `${CATEGORY_COLORS[t.category]}15`, color: CATEGORY_COLORS[t.category] }}
                  >
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {new Date(t.date).toLocaleDateString('pt-BR')}
                </td>
                <td className={`px-6 py-4 font-bold text-sm ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                  Nenhuma transação encontrada. Comece adicionando uma acima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
