
import React from 'react';
import { Folder, FolderPlus, Layers, X } from 'lucide-react';
import { Folder as FolderType } from '../types';

interface Props {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelect: (id: string | null) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

const FolderNavigator: React.FC<Props> = ({ folders, selectedFolderId, onSelect, onAdd, onDelete }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
          selectedFolderId === null
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
        }`}
      >
        <Layers size={16} />
        Tudo
      </button>

      {folders.map(folder => (
        <div key={folder.id} className="relative group flex-shrink-0">
          <button
            onClick={() => onSelect(folder.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap border pr-8 ${
              selectedFolderId === folder.id
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
            }`}
          >
            <Folder size={16} fill={selectedFolderId === folder.id ? 'white' : 'transparent'} />
            {folder.name}
          </button>
          
          {folder.id !== 'default' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder.id);
              }}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full transition-all ${
                selectedFolderId === folder.id 
                  ? 'text-indigo-200 hover:text-white hover:bg-white/20' 
                  : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-all border border-transparent border-dashed flex-shrink-0"
      >
        <FolderPlus size={16} />
      </button>
    </div>
  );
};

export default FolderNavigator;
