export interface Pregunta {
  pregunta: string;
  respuestas: string[];
  fecha: Date;
  foto: string[];
  order: number;
  id: string;
  intro?: string;
  tipoPregunta?: string;
  videoURL?: string;
}

export interface Users {
  id: string;
  pos: string;
  role?: number;
}
