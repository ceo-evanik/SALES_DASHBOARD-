// // types/billing.ts

//  interface Salesperson {
//   name?: string;
// }

//  interface SalesData {
//   _id: string;
//   name?: string;
//   date?: string; // ISO string
//   totalTarget?: number;
//   totalAch?: number;
//   salesperson?: Salesperson;
// }

//  interface FormattedData {
//   name: string;
//   targets: Record<string, number | null>;
//   achieved: Record<string, number | null>;
//   achPercent: Record<string, string>;
// }


// types.ts
 interface SalesData {
  _id: string;
  name?: string;
  date?: string; // ISO string
  totalTarget?: number;
  totalAch?: number;
  salesperson?: { name?: string };
  user?: { department?: string };
}

 interface FormattedData {
  name: string;
  targets: Record<string, number | null>;
  achieved: Record<string, number | null>;
  achPercent: Record<string, string>;
  department?: string;
}
