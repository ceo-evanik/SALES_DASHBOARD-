"use client";

const invoices = [
  {
    date: "16-Sep-2025",
    number: "EUP/25-26/0458",
    customer: "Excel Foods",
    amount: "17,700",
    status: "Sent",
  },
  {
    date: "15-Sep-2025",
    number: "EUP/25-26/0459",
    customer: "Fresh Mart",
    amount: "22,300",
    status: "Paid",
  },
];

const receivables = [
  {
    number: "EUP/25-26/0458",
    date: "16-Sep-2025",
    customer: "Excel Foods",
    amount: "17,700",
    balance: "17,700",
    days: 0,
    salesRep: "Prashant Joshi",
  },
  {
    number: "EUP/25-26/0459",
    date: "15-Sep-2025",
    customer: "Fresh Mart",
    amount: "22,300",
    balance: "5,000",
    days: 5,
    salesRep: "Rahul Singh",
  },
];

export default function ReportPage() {
  return (
    <div className="p-2  font-sans  dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        {/* Recent Invoices Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full lg:w-1/2">
          <div className="bg-blue-900 text-white rounded-t-lg p-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 
                  00-3.375-3.375h-1.5A1.125 1.125 0 
                  0113.5 7.125v-1.5a3.375 3.375 0 
                  00-3.375-3.375H8.25m0 12.75h7.5m-7.5 
                  3H12M4.5 16.5v-2.25m0-1.5V6A2.25 
                  2.25 0 016.75 3.75h8.25A2.25 
                  2.25 0 0117.25 6v7.5m-5.188-5.323a4.5 
                  4.5 0 011.875 4.5M6.75 14.25a.75.75 
                  0 100 1.5.75.75 0 000-1.5z"
                />
              </svg>
              <span>Recent Invoices</span>
            </h3>
          </div>

          <div className="p-4 overflow-y-auto h-96">
            <table className="min-w-full text-left border border-gray-200 dark:border-gray-700">
              <thead className="text-xs uppercase sticky top-0 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-2 px-1">Date</th>
                  <th className="py-2 px-1">Invoice #</th>
                  <th className="py-2 px-1">Customer</th>
                  <th className="py-2 px-1">Amount</th>
                  <th className="py-2 px-1">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                {invoices.map((inv, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-1">{inv.date}</td>
                    <td className="py-3 px-1 font-semibold">{inv.number}</td>
                    <td className="py-3 px-1">{inv.customer}</td>
                    <td className="py-3 px-1">{inv.amount}</td>
                    <td className="py-3 px-1">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          inv.status === "Paid"
                            ? "bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200"
                            : "bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Outstanding Receivables Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md w-full lg:w-1/2">
          <div className="bg-blue-900 text-white rounded-t-lg p-4">
            <h3 className="flex items-center space-x-2 text-lg font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 
                  0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Outstanding Receivables</span>
            </h3>
          </div>

          <div className="p-4 overflow-y-auto h-96">
            <table className="min-w-full text-left border border-gray-200 dark:border-gray-700">
              <thead className="text-xs uppercase sticky top-0 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="py-2 px-1">Invoice #</th>
                  <th className="py-2 px-1">Date</th>
                  <th className="py-2 px-1">Customer</th>
                  <th className="py-2 px-1">Amount</th>
                  <th className="py-2 px-1">Balance</th>
                  <th className="py-2 px-1">Days</th>
                  <th className="py-2 px-1">Sales Rep</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
                {receivables.map((rec, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-1 font-semibold">{rec.number}</td>
                    <td className="py-3 px-1">{rec.date}</td>
                    <td className="py-3 px-1">{rec.customer}</td>
                    <td className="py-3 px-1">{rec.amount}</td>
                    <td className="py-3 px-1">{rec.balance}</td>
                    <td className="py-3 px-1 font-semibold">{rec.days}</td>
                    <td className="py-3 px-1">{rec.salesRep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
