import React, { useState } from 'react';
import JournalForm from './JournalForm';
import { JournalEntry } from '../../types';
import { Plus, BookOpen, Brain, TrendingUp } from 'lucide-react';

const JournalView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  const handleSave = (entry: JournalEntry) => {
    setEntries([entry, ...entries]);
    setViewMode('list');
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={24} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-light text-white mb-2">Map Your First Pattern</h3>
        <p className="text-slate-400 max-w-md mb-6">
            "The definition of insanity is doing the same thing over and over again and expecting different results." — Start tracking your mental game today.
        </p>
        <button 
            onClick={() => setViewMode('create')}
            className="bg-primary text-black font-bold py-2 px-6 rounded hover:bg-primaryHover transition-colors"
        >
            Create Entry
        </button>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 sm:p-8 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-light text-slate-200 mb-2">Trading Journal</h1>
            <p className="text-sm text-slate-500">Mental Game Analysis & Pattern Mapping</p>
        </div>
        {viewMode === 'list' && (
             <button 
                onClick={() => setViewMode('create')}
                className="flex items-center gap-2 bg-primary text-black font-bold py-2 px-4 rounded hover:bg-primaryHover transition-colors shadow-lg shadow-primary/20"
            >
                <Plus size={18} /> New Entry
            </button>
        )}
      </div>

      {/* Content */}
      {viewMode === 'create' ? (
        <JournalForm onSave={handleSave} onCancel={() => setViewMode('list')} />
      ) : (
        <>
            {entries.length === 0 ? <EmptyState /> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {entries.map(entry => (
                        <div key={entry.id} className="bg-surface rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-white text-lg">{entry.pair}</span>
                                        <span className={`text-[10px] px-1.5 rounded uppercase font-bold border ${entry.direction === 'Long' ? 'border-green-800 text-green-400 bg-green-900/20' : 'border-red-800 text-red-400 bg-red-900/20'}`}>
                                            {entry.direction}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">{new Date(entry.date).toLocaleString()}</p>
                                </div>
                                <div className={`text-right font-mono font-bold ${entry.pnl >= 0 ? 'text-primary' : 'text-red-500'}`}>
                                    {entry.pnl >= 0 ? '+' : ''}{entry.pnl}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-4">
                                <span className={`text-xs px-2 py-1 rounded bg-[#0b0e11] border border-gray-700 ${
                                    entry.gameLevel === 'A-Game' ? 'text-green-400' : 
                                    entry.gameLevel === 'B-Game' ? 'text-yellow-400' : 'text-red-400'
                                }`}>
                                    {entry.gameLevel}
                                </span>
                                <span className="text-xs text-slate-500">Tech Score: <span className="text-white">{entry.technicalScore}/10</span></span>
                            </div>

                            <div className="space-y-3">
                                <div className="bg-[#0b0e11] p-3 rounded border border-gray-800">
                                    <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Mental Pattern</p>
                                    <p className="text-sm text-slate-300 line-clamp-2">"{entry.mentalPattern.thoughts}"</p>
                                </div>

                                {entry.aiAnalysis && (
                                    <div className="bg-purple-900/10 p-3 rounded border border-purple-900/30">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Brain size={12} className="text-purple-400" />
                                            <p className="text-[10px] uppercase font-bold text-purple-400">AI Coach</p>
                                        </div>
                                        <p className="text-xs text-slate-300 leading-relaxed">
                                            {entry.aiAnalysis}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
      )}
    </div>
  );
};

export default JournalView;