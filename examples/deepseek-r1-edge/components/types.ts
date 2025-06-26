export interface MessageContent {
  content: string;
  think?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  think?: string;
  source?: { title: string; url: string }[];
}

export interface KeywordButton {
  text: string;
  query: string;
}

export interface ModelOption {
  id: string;
  name: string;
} 