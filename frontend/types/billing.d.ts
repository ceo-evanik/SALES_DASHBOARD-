// types/billing.ts

 interface Salesperson {
  name?: string;
}

 interface SalesData {
  _id: string;
  name?: string;
  date?: string; // ISO string
  totalTarget?: number;
  totalAch?: number;
  salesperson?: Salesperson;
}

 interface FormattedData {
  name: string;
  targets: Record<string, number | null>;
  achieved: Record<string, number | null>;
  achPercent: Record<string, string>;
}
