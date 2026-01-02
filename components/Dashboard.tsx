
import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  Legend 
} from 'recharts';
import { Transaction, TransactionType, FixedBill } from '../types';
import { CATEGORY_COLORS, formatCurrency } from '../constants.tsx';
import { Wallet, TrendingUp, TrendingDown, LayoutDashboard, BarChart3 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  fixedBills: FixedBill[];
}

const Dashboard: React.FC<Props> = ({ transactions, fixedBills }) => {
  const totals = useMemo(() => {
    const transactionTotals = transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    const fixedTotal = fixedBills.reduce((acc, b) => acc + b.amount, 0);

    return {
      income: transactionTotals.income,
      expense: transactionTotals.expense + fixedTotal,
      fixed: fixedTotal
    };
  }, [transactions, fixedBills]);

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    
    // Gastos variáveis
    transactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });

    // Adiciona contas fixas na categoria "Moradia" ou similar (simplificado)
    if (fixedBills.length > 0) {
      const fixedTotal = fixedBills.reduce((acc, b) => acc + b.amount, 0);
      map['Moradia'] = (map['Moradia'] || 0) + fixedTotal;
    }

    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [transactions, fixedBills]);

  const balance = totals.income - totals.expense;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <Wallet size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Saldo Atual</p>
            <h3 className={`text-lg font-bold truncate ${balance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {formatCurrency(balance)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
            <TrendingUp size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Total Entradas</p>
            <h3 className="text-lg font-bold text-emerald-600 truncate">
              {formatCurrency(totals.income)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0">
            <TrendingDown size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Gasto Mensal (Total)</p>
            <h3 className="text-lg font-bold text-rose-600 truncate">
              {formatCurrency(totals.expense)}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-sm font-bold flex items-center gap-2 text-slate-700 mb-4">
            <LayoutDashboard className="text-indigo-600" size={16} />
            Distribuição dos Gastos
          </h2>
          <div className="h-[250px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value">
                    {categoryData.map((entry) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS] || '#cbd5e1'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">Nenhum gasto registrado</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center">
          <BarChart3 className="text-indigo-100 mb-4" size={48} />
          <h3 className="text-sm font-bold text-slate-700 mb-2">Composição do Gasto</h3>
          <div className="w-full space-y-3 mt-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Contas Fixas:</span>
              <span className="font-bold text-slate-700">{formatCurrency(totals.fixed)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500">Gastos Variáveis:</span>
              <span className="font-bold text-slate-700">{formatCurrency(totals.expense - totals.fixed)}</span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-sm font-bold">
              <span className="text-slate-700">Total:</span>
              <span className="text-rose-600">{formatCurrency(totals.expense)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
