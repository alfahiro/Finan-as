
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Sparkles, X } from 'lucide-react';
import { parseVoiceCommand } from '../services/geminiService';

interface Props {
  onProcessed: (result: any) => void;
}

const VoiceInput: React.FC<Props> = ({ onProcessed }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          try {
            setIsProcessing(true);
            const result = await parseVoiceCommand(base64Audio);
            onProcessed(result);
          } catch (err) {
            setError("Não consegui entender o áudio. Tente novamente.");
          } finally {
            setIsProcessing(false);
          }
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Permissão de microfone negada.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
            <Sparkles className="text-indigo-600" size={20} />
            Lançamento por Voz
          </h2>
          {error && (
             <button onClick={() => setError(null)} className="text-rose-500 hover:bg-rose-50 p-1 rounded">
               <X size={16} />
             </button>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isRecording 
                ? 'bg-rose-500 animate-pulse scale-110' 
                : isProcessing 
                  ? 'bg-slate-100 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="animate-spin text-indigo-600" size={32} />
            ) : isRecording ? (
              <Square className="text-white fill-white" size={32} />
            ) : (
              <Mic className="text-white" size={32} />
            )}
          </button>
          
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-700">
              {isRecording ? "Ouvindo... Toque para parar" : isProcessing ? "Processando com IA..." : "Toque para falar"}
            </p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] mx-auto">
              Ex: "Gastei 50 reais com alimentação" ou "Conta de luz de 150 reais para o dia 20"
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 text-rose-600 text-xs rounded-xl flex items-center gap-2">
            <X size={14} /> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
