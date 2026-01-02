
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
}

const AIInsights: React.FC<Props> = ({ transactions }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdvice = async () => {
    if (transactions.length === 0) return;
    setLoading(true);
    const advice = await getFinancialAdvice(transactions);
    setTips(advice);
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sparkles className="text-amber-300" />
          Dicas da IA (Gemini)
        </h2>
        <button 
          onClick={fetchAdvice}
          disabled={loading || transactions.length === 0}
          className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center text-indigo-100/70 italic">
            Analisando seus dados financeiros...
          </div>
        ) : tips.length > 0 ? (
          tips.map((tip, idx) => (
            <div key={idx} className="flex gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all text-xs">
              <span className="text-amber-300 font-bold shrink-0">{idx + 1}.</span>
              <p className="leading-relaxed">{tip}</p>
            </div>
          ))
        ) : (
          <div className="py-4 text-center text-indigo-100/70 italic text-xs">
            {transactions.length > 0 
              ? "Clique em atualizar para obter insights."
              : "Adicione transações para receber conselhos da IA."}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
