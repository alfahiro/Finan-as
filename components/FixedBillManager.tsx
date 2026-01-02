
import React, { useState } from 'react';
import { FixedBill } from '../types';
import { formatCurrency } from '../constants.tsx';
import { Calendar, CheckCircle2, Circle, Trash2, AlertCircle, Plus } from 'lucide-react';

interface Props {
  bills: FixedBill[];
  onAdd: (bill: Omit<FixedBill, 'id' | 'isPaid'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const FixedBillManager: React.FC<Props> = ({ bills, onAdd, onToggle, onDelete }) => {
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;
    onAdd({ 
      description: desc, 
      amount: parseFloat(val), 
      dueDate: date 
    });
    setDesc('');
    setVal('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-sm font-bold flex items-center gap-2 text-slate-700">
          <Calendar className="text-indigo-600" size={18} />
          Contas Fixas (Mensais)
        </h2>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 mb-6">
          <input
            type="text"
            placeholder="Nome (ex: Aluguel)"
            className="text-sm p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Valor"
              className="text-sm p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              value={val}
              onChange={e => setVal(e.target.value)}
            />
            <input
              type="date"
              className="text-sm p-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-indigo-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1">
            <Plus size={16} /> Adicionar Fixa
          </button>
        </form>

        <div className="space-y-2">
          {bills.map(bill => (
            <div 
              key={bill.id} 
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                bill.isPaid 
                  ? 'bg-slate-50 border-slate-100 opacity-60' 
                  : 'bg-white border-amber-100 shadow-sm shadow-amber-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onToggle(bill.id)}
                  className={`transition-colors ${bill.isPaid ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
                >
                  {bill.isPaid ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${bill.isPaid ? 'line-through text-slate-500' : 'text-slate-700'}`}>
                    {bill.description}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {new Date(bill.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${bill.isPaid ? 'text-slate-400' : 'text-rose-600'}`}>
                  {formatCurrency(bill.amount)}
                </span>
                <button 
                  onClick={() => onDelete(bill.id)}
                  className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FixedBillManager;
