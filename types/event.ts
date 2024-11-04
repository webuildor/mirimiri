export interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type EventItem = {
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  memo?: string;
  category?: {
    name: string;
    color: string;
    icon: string;
  };
  repeatOption?: {
    type: "매일" | "매주" | "매월";
    days?: string[];
    dates?: number[];
  };
}; 