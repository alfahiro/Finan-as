
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, FixedBill } from './types';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AIInsights from './components/AIInsights';
import TransactionForm from './components/TransactionForm';
import FixedBillManager from './components/FixedBillManager';
import { Wallet, Sparkles, Check } from 'lucide-react';

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('financas_pro_data');
    if (saved) return JSON.parse(saved);
    
    // Dados iniciais (Ganhos e Gastos Pontuais)
    return [
      {
        id: 'inc-1',
        description: 'Salário',
        amount: 5931.85,
        type: TransactionType.INCOME,
        category: 'Salário',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'exp-drink',
        description: 'HELP DRINK',
        amount: 12.00,
        type: TransactionType.EXPENSE,
        category: 'Alimentação', // Alterado de 'Lazer' para 'Alimentação' (Mercado)
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'exp-merc',
        description: 'MERCADINHO DA RUA NITERÓI (MPB)',
        amount: 43.97,
        type: TransactionType.EXPENSE,
        category: 'Alimentação',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'inc-2',
        description: 'Cheque Especial',
        amount: 1840.20,
        type: TransactionType.EXPENSE,
        category: 'Outros',
        date: new Date().toISOString().split('T')[0]
      },
      {
        id: 'init-1',
        description: 'Conta de Luz',
        amount: 66.66,
        type: TransactionType.EXPENSE,
        category: 'Moradia',
        date: new Date().toISOString().split('T')[0]
      }
    ];
  });

  const [fixedBills, setFixedBills] = useState<FixedBill[]>(() => {
    const saved = localStorage.getItem('financas_pro_fixed');
    if (saved) return JSON.parse(saved);

    // Contas Fixas solicitadas anteriormente - Valor do Aluguel atualizado para 824.00
    return [
      { id: 'f-1', description: 'Aluguel', amount: 824.00, dueDate: new Date().toISOString().split('T')[0], isPaid: false },
      { id: 'f-2', description: 'Internet/Celular', amount: 200.00, dueDate: new Date().toISOString().split('T')[0], isPaid: false },
      { id: 'f-3', description: 'Financiamento', amount: 1000.00, dueDate: new Date().toISOString().split('T')[0], isPaid: false }
    ];
  });

  const [lastAction, setLastAction] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('financas_pro_data', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('financas_pro_fixed', JSON.stringify(fixedBills));
  }, [fixedBills]);

  const handleAddTransaction = (newT: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [{ ...newT, id: crypto.randomUUID() }, ...prev]);
    setLastAction("Transação registrada!");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleAddFixedBill = (bill: Omit<FixedBill, 'id' | 'isPaid'>) => {
    setFixedBills(prev => [...prev, { ...bill, id: crypto.randomUUID(), isPaid: false }]);
    setLastAction("Conta fixa adicionada!");
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleToggleFixedBill = (id: string) => {
    setFixedBills(prev => prev.map(b => b.id === id ? { ...b, isPaid: !b.isPaid } : b));
  };

  const handleDeleteFixedBill = (id: string) => {
    setFixedBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Wallet size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Finanças<span className="text-indigo-600">Pro</span> AI
            </h1>
          </div>
          <div className="hidden sm:block text-slate-400 text-xs font-medium">
            Gestão Financeira Inteligente
          </div>
        </div>
      </header>

      {lastAction && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm animate-in fade-in slide-in-from-bottom-4">
            <Check size={18} className="text-emerald-400" /> {lastAction}
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            <Dashboard transactions={transactions} fixedBills={fixedBills} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <TransactionForm onAdd={handleAddTransaction} />
               <FixedBillManager 
                  bills={fixedBills}
                  onAdd={handleAddFixedBill}
                  onToggle={handleToggleFixedBill}
                  onDelete={handleDeleteFixedBill}
               />
            </div>

            <TransactionList 
              transactions={transactions} 
              onDelete={handleDeleteTransaction} 
            />
          </div>

          <div className="lg:col-span-4 space-y-8">
            <AIInsights transactions={transactions} />
            
            <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-lg relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                <Sparkles size={120} />
              </div>
              <h3 className="font-bold mb-2 flex items-center gap-2 text-sm relative z-10">
                <Sparkles size={16} className="text-amber-400" />
                Ajuste Realizado
              </h3>
              <p className="text-xs text-indigo-100 leading-relaxed relative z-10">
                A categoria do Help Drink foi alterada para Alimentação. Agora seus gastos com mercado estão devidamente agrupados.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Finanças Pro AI - Planejamento e Controle.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
