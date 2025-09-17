"use client";

import React, { useEffect, useState } from "react";

interface SalesData {
  _id: string;
  name?: string;
  date?: string; // ISO string
  totalTarget?: number;
  totalAch?: number;
  salesperson?: { name?: string };
}

interface FormattedData {
  name: string;
  targets: Record<string, number | null>;
  achieved: Record<string, number | null>;
  achPercent: Record<string, string>;
}

// Helper: Get last 3 months in YYYY-MM format
const getLastThreeMonths = (): string[] => {
  const today = new Date();
  const months: string[] = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    months.push(`${d.getFullYear()}-${m}`);
  }
  return months;
};

export default function BillingPage() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:4003/api/users/targets", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch data");

        const json = await res.json();
        setData(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const months = getLastThreeMonths();

  // Transform data
  const formattedData: FormattedData[] = [];
  const groupedBySalesperson: Record<string, SalesData[]> = {};

  data.forEach((item) => {
    const name = item.name || item.salesperson?.name || "Unknown";
    if (!groupedBySalesperson[name]) groupedBySalesperson[name] = [];
    groupedBySalesperson[name].push(item);
  });

  for (const [name, records] of Object.entries(groupedBySalesperson)) {
    const targets: Record<string, number | null> = {};
    const achieved: Record<string, number | null> = {};
    const achPercent: Record<string, string> = {};

    months.forEach((month) => {
      const record = records.find((r) => r.date?.startsWith(month));
      const t = record?.totalTarget ?? null;
      const a = record?.totalAch ?? null;
      targets[month] = t;
      achieved[month] = a;
      achPercent[month] = t && a ? `${Math.round((a / t) * 100)}%` : "-";
    });

    formattedData.push({ name, targets, achieved, achPercent });
  }

  if (loading) {
    return <div className="p-8 text-gray-900 dark:text-gray-100">Loading...</div>;
  }

  return (
    <div className="dark:bg-gray-900 p-8 text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-semibold mb-4">Customer Revenue Overview</h2>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-[700px] text-sm text-left border-collapse">
          <thead>
            <tr className="bg-blue-900 text-white">
              <th rowSpan={2} className="px-4 py-2">Name</th>
              <th colSpan={months.length} className="px-4 py-2">Revenue Target</th>
              <th colSpan={months.length} className="px-4 py-2">Achieved</th>
              <th colSpan={months.length} className="px-4 py-2">Ach %</th>
            </tr>
            <tr className="bg-blue-800 text-white">
              {months.map((m) => (
                <th key={`target-${m}`} className="px-4 py-2">{m.split("-")[1]}</th>
              ))}
              {months.map((m) => (
                <th key={`ach-${m}`} className="px-4 py-2">{m.split("-")[1]}</th>
              ))}
              {months.map((m) => (
                <th key={`percent-${m}`} className="px-4 py-2">{m.split("-")[1]}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {formattedData.length > 0 ? (
              formattedData.map((item) => (
                <tr key={item.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2">{item.name}</td>
                  {months.map((m) => (
                    <td key={`t-${item.name}-${m}`} className="px-4 py-2">{item.targets[m]?.toLocaleString() ?? "-"}</td>
                  ))}
                  {months.map((m) => (
                    <td key={`a-${item.name}-${m}`} className="px-4 py-2">{item.achieved[m]?.toLocaleString() ?? "-"}</td>
                  ))}
                  {months.map((m) => (
                    <td key={`p-${item.name}-${m}`} className="px-4 py-2">{item.achPercent[m]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={1 + 3 * months.length} className="px-4 py-2 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
