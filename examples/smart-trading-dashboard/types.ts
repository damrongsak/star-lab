export interface Account {
  id: string;
  name: string;
  accountNumber: string;
  currency: 'AUD' | 'USD' | 'JPY' | 'EUR';
  nav: number;
  balance: number;
  unrealizedPL: number;
  marginUsed: number;
  marginPercent: number;
  type: 'V20' | 'MT4';
  mode: 'NETTING' | 'HEDGING';
}

export interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  subItems?: string[];
  isOpen?: boolean;
}

export interface GeminiAnalysis {
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  summary: string;
  keyPoints: string[];
}

// --- Journal Module Types ---

export type GameLevel = 'A-Game' | 'B-Game' | 'C-Game';
export type TradeDirection = 'Long' | 'Short';

export interface MentalPattern {
  triggers: string;       // What happened immediately before?
  thoughts: string;       // Internal monologue
  emotions: string;       // What was felt?
  behaviors: string;      // Observable actions
  decisionChanges: string; // Changes in decision making
  perceptionChanges: string; // Changes in market view
}

export interface SeverityScales {
  greed: number;      // 1-10
  fear: number;       // 1-10
  tilt: number;       // 1-10
  confidence: number; // 1-10
  discipline: number; // 1-10
}

export interface MentalHandHistory {
  problem: string;      // What's the problem?
  whyExists: string;    // Why does it exist?
  flaw: string;         // What is flawed?
  correction: string;   // What is the correction?
  logic: string;        // What logic confirms that correction?
}

export interface JournalEntry {
  id: string;
  date: string; // ISO String
  
  // I. Core Trade Data
  pair: string;
  direction: TradeDirection;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  duration: string; // e.g. "4h 30m"
  technicalScore: number; // 1-10
  
  // II. Mistake Categorization
  gameLevel: GameLevel;
  
  // III. Mental Pattern Mapping
  mentalPattern: MentalPattern;
  severity: SeverityScales;
  
  // IV. Mental Hand History
  handHistory: MentalHandHistory;

  // V. AI Analysis
  aiAnalysis?: string;
}