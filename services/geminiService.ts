
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const summary = transactions.reduce((acc, t) => {
    const key = t.category;
    if (!acc[key]) acc[key] = 0;
    acc[key] += t.type === 'EXPENSE' ? t.amount : 0;
    return acc;
  }, {} as Record<string, number>);

  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const prompt = `
    Aja como um consultor financeiro sênior. Analise as seguintes finanças e dê 3 dicas práticas e curtas em português:
    - Renda Total: R$ ${totalIncome.toFixed(2)}
    - Gastos Variáveis Registrados: R$ ${totalExpense.toFixed(2)}
    - Gastos Variáveis por Categoria: ${JSON.stringify(summary)}
    - Saldo Real Atual (sem considerar fixas pendentes): R$ ${(totalIncome - totalExpense).toFixed(2)}

    Responda em formato JSON com uma lista de dicas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text || '{"tips": []}').tips as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return ["Mantenha o foco na economia mensal.", "Revise seus gastos por categoria regularmente."];
  }
};

// Fixed: Implemented parseVoiceCommand to handle voice input processing
export const parseVoiceCommand = async (base64Audio: string) => {
  const prompt = `
    Analise o comando de voz em português e converta em um objeto JSON para um app de finanças.
    Extraia descrição, valor, tipo (INCOME ou EXPENSE), categoria (Salário, Investimentos, Alimentação, Transporte, Moradia, Lazer, Saúde, Educação, Outros) e data.
    Identifique se o usuário quer adicionar uma transação pontual ou uma conta fixa recorrente.
    Se for conta fixa, retorne action: 'ADD_FIXED_BILL'. Se for transação, retorne action: 'ADD_TRANSACTION'.
    Hoje é ${new Date().toISOString().split('T')[0]}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "audio/webm",
              data: base64Audio
            }
          },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, enum: ['ADD_TRANSACTION', 'ADD_FIXED_BILL'] },
            data: {
              type: Type.OBJECT,
              properties: {
                description: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ['INCOME', 'EXPENSE'] },
                category: { type: Type.STRING },
                date: { type: Type.STRING },
                dueDate: { type: Type.STRING }
              },
              required: ['description', 'amount']
            }
          },
          required: ['action', 'data']
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Voice Analysis Error:", error);
    throw error;
  }
};
