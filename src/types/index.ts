export interface Position {
  x: number;
  y: number;
}

export interface FormStatus {
  type: 'success' | 'error' | null;
  message: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface CardData {
  id: number;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  details: string[];
}

export interface FeatureSlide {
  highlight: string;
  text: string;
  img: string;
  reverse: boolean;
  details: string[];
}

export type TimeZone = 'Africa/Algiers' | 'UTC' | string;
