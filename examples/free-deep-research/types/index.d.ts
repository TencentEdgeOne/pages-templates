export type Step = 'query' | 'clarify' | 'research' | 'learning' | 'results';

export interface Message {
  role?: 'user' | 'assistant' | 'system';
  content: string;
  step?: Step;
  think?: string;
  goal?: string;
  source?: { title: string; url: string; content: string }[];
  query?: string;
}
