import React, { useState } from 'react';
import { JournalEntry, TradeDirection, GameLevel } from '../../types';
import { ChevronRight, ChevronLeft, Save, Activity, Brain, AlertTriangle, Search } from 'lucide-react';
import { analyzeJournalEntry } from '../../services/geminiService';

interface Props {
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const JournalForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState<Omit<JournalEntry, 'id' | 'date' | 'aiAnalysis'>>({
    // Step 1: Core Trade Data
    pair: 'XAU/USD',
    direction: 'Long',
    entryPrice: 0,
    exitPrice: 0,
    pnl: 0,
    duration: '',
    technicalScore: 5,
    
    // Step 2: Mistake Categorization
    gameLevel: 'B-Game',
    
    // Step 3: Mental Pattern
    mentalPattern: {
      triggers: '',
      thoughts: '',
      emotions: '',
      behaviors: '',
      decisionChanges: '',
      perceptionChanges: ''
    },
    severity: {
      greed: 1,
      fear: 1,
      tilt: 1,
      confidence: 5,
      discipline: 5
    },
    
    // Step 4: Mental Hand History
    handHistory: {
      problem: '',
      whyExists: '',
      flaw: '',
      correction: '',
      logic: ''
    }
  });

  const updateMentalPattern = (field: keyof typeof formData.mentalPattern, value: string) => {
    setFormData(prev => ({
      ...prev,
      mentalPattern: { ...prev.mentalPattern, [field]: value }
    }));
  };

  const updateSeverity = (field: keyof typeof formData.severity, value: number) => {
    setFormData(prev => ({
      ...prev,
      severity: { ...prev.severity, [field]: value }
    }));
  };

  const updateHandHistory = (field: keyof typeof formData.handHistory, value: string) => {
    setFormData(prev => ({
      ...prev,
      handHistory: { ...prev.handHistory, [field]: value }
    }));
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    // Get AI Analysis
    const analysis = await analyzeJournalEntry(formData);
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...formData,
      aiAnalysis: analysis
    };
    
    setIsAnalyzing(false);
    onSave(newEntry);
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
        <Activity className="text-primary" /> I. Core Trade Data
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pair</label>
          <input 
            type="text" 
            value={formData.pair}
            onChange={e => setFormData({...formData, pair: e.target.value})}
            className="w-full bg-[#0b0e11] border border-gray-700 rounded p-2 text-white focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Direction</label>
          <div className="flex bg-[#0b0e11] rounded p-1 border border-gray-700">
            {['Long', 'Short'].map(dir => (
              <button
                key={dir}
                onClick={() => setFormData({...formData, direction: dir as TradeDirection})}
                className={`flex-1 text-sm py-1 rounded transition-colors ${formData.direction === dir ? 'bg-slate-700 text-white' : 'text-slate-500'}`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Entry Price</label>
          <input 
            type="number" 
            value={formData.entryPrice}
            onChange={e => setFormData({...formData, entryPrice: parseFloat(e.target.value)})}
            className="w-full bg-[#0b0e11] border border-gray-700 rounded p-2 text-white focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Exit Price</label>
          <input 
            type="number" 
            value={formData.exitPrice}
            onChange={e => setFormData({...formData, exitPrice: parseFloat(e.target.value)})}
            className="w-full bg-[#0b0e11] border border-gray-700 rounded p-2 text-white focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">P&L ($)</label>
          <input 
            type="number" 
            value={formData.pnl}
            onChange={e => setFormData({...formData, pnl: parseFloat(e.target.value)})}
            className={`w-full bg-[#0b0e11] border border-gray-700 rounded p-2 focus:outline-none font-bold ${formData.pnl >= 0 ? 'text-primary' : 'text-red-500'}`}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Technical Context Score (1-10)
        </label>
        <input 
          type="range" 
          min="1" max="10" 
          value={formData.technicalScore}
          onChange={e => setFormData({...formData, technicalScore: parseInt(e.target.value)})}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Poor Context</span>
          <span className="text-primary font-bold">{formData.technicalScore}</span>
          <span>Perfect Context</span>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in-up">
       <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-500" /> II. Mistake Categorization
      </h3>
      
      <p className="text-sm text-slate-400 mb-4">
        Categorize the error to help AI understand the severity. Be honest.
      </p>

      <div className="space-y-3">
        {[
          { 
            id: 'A-Game', 
            label: 'A-Game (Learning Mistake)', 
            desc: 'Unavoidable weakness in tactical decision-making. Something you haven\'t learned yet.' 
          },
          { 
            id: 'B-Game', 
            label: 'B-Game (Marginal Mistake)', 
            desc: 'Blend of tactical weakness and minor emotional/mental flaws.' 
          },
          { 
            id: 'C-Game', 
            label: 'C-Game (Obvious Mistake)', 
            desc: 'Caused by intense emotion or low energy. So obvious there is nothing to learn tactically.' 
          }
        ].map((level) => (
          <div 
            key={level.id}
            onClick={() => setFormData({...formData, gameLevel: level.id as GameLevel})}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              formData.gameLevel === level.id 
                ? 'bg-primary/10 border-primary' 
                : 'bg-surface border-gray-800 hover:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className={`font-bold ${formData.gameLevel === level.id ? 'text-primary' : 'text-white'}`}>
                {level.label}
              </span>
              {formData.gameLevel === level.id && <div className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(0,195,137,0.5)]"></div>}
            </div>
            <p className="text-xs text-slate-400">{level.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
        <Brain className="text-accentBlue" /> III. Mental Pattern Mapping
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-300 border-b border-gray-800 pb-2">Incident Sequence</h4>
          {[
            { key: 'triggers', label: 'Triggers', placeholder: 'What happened right before? (e.g. Missed trade)' },
            { key: 'thoughts', label: 'Thoughts', placeholder: 'Internal monologue ("Must make it back")' },
            { key: 'emotions', label: 'Emotions', placeholder: 'What was felt? (e.g. Heat in face, anxiety)' },
            { key: 'behaviors', label: 'Behaviors', placeholder: 'Actions taken (e.g. Clicking rapidly)' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
              <textarea 
                rows={2}
                value={formData.mentalPattern[field.key as keyof typeof formData.mentalPattern]}
                onChange={e => updateMentalPattern(field.key as keyof typeof formData.mentalPattern, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded p-2 text-sm text-white focus:border-accentBlue focus:outline-none resize-none"
              />
            </div>
          ))}
        </div>

        <div className="space-y-6 bg-[#0b0e11] p-4 rounded-lg border border-gray-800">
          <h4 className="text-sm font-bold text-slate-300 border-b border-gray-800 pb-2">Severity Scales (1-10)</h4>
          {[
            { key: 'greed', label: 'Greed', color: 'text-green-400' },
            { key: 'fear', label: 'Fear', color: 'text-red-400' },
            { key: 'tilt', label: 'Tilt (Anger)', color: 'text-orange-400' },
            { key: 'confidence', label: 'Over-Confidence', color: 'text-blue-400' },
          ].map((scale) => (
            <div key={scale.key}>
              <div className="flex justify-between mb-1">
                <label className={`text-xs font-bold uppercase ${scale.color}`}>{scale.label}</label>
                <span className="text-xs text-white font-mono">{formData.severity[scale.key as keyof typeof formData.severity]}</span>
              </div>
              <input 
                type="range" 
                min="1" max="10" 
                value={formData.severity[scale.key as keyof typeof formData.severity]}
                onChange={e => updateSeverity(scale.key as keyof typeof formData.severity, parseInt(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
        <Search className="text-purple-400" /> IV. Mental Hand History
      </h3>
      <p className="text-sm text-slate-400 mb-4">
        Deep dive into the Root Cause. This is what the AI analyzes most.
      </p>

      <div className="space-y-4">
        {[
            { key: 'problem', label: '1. What\'s the problem?', ph: 'Describe the specific issue clearly.' },
            { key: 'whyExists', label: '2. Why does the problem exist?', ph: 'Immediate behavioral reason.' },
            { key: 'flaw', label: '3. What is flawed?', ph: 'Underlying cognitive flaw (e.g. unreasonable expectation).' },
            { key: 'correction', label: '4. What is the correction?', ph: 'Specific action plan/strategy.' },
            { key: 'logic', label: '5. What logic confirms that correction?', ph: 'Long-term logical grounding.' },
        ].map((field) => (
             <div key={field.key}>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{field.label}</label>
              <textarea 
                rows={2}
                value={formData.handHistory[field.key as keyof typeof formData.handHistory]}
                onChange={e => updateHandHistory(field.key as keyof typeof formData.handHistory, e.target.value)}
                placeholder={field.ph}
                className="w-full bg-[#0b0e11] border border-gray-700 rounded p-2 text-sm text-white focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-gray-800 p-6 md:p-8 max-w-4xl mx-auto shadow-2xl">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-0"></div>
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all duration-300 ${
              step >= s ? 'bg-primary text-black' : 'bg-gray-800 text-slate-500'
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-800">
        <button 
            onClick={step === 1 ? onCancel : () => setStep(step - 1)}
            className="px-6 py-2 rounded text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
            {step === 1 ? 'Cancel' : 'Back'}
        </button>

        {step < 4 ? (
            <button 
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 rounded bg-primary text-black text-sm font-bold hover:bg-primaryHover transition-colors flex items-center gap-2"
            >
                Next <ChevronRight size={16} />
            </button>
        ) : (
            <button 
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className="px-6 py-2 rounded bg-gradient-to-r from-primary to-emerald-600 text-black text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'} <Save size={16} />
            </button>
        )}
      </div>
    </div>
  );
};

export default JournalForm;