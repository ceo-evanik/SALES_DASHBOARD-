"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // ✅ Skeleton import

// Last 3 months in YYYY-MM format
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

// Convert YYYY-MM to short month name
const getMonthName = (monthString: string): string => {
  const [year, month] = monthString.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "short" });
};

// Indian number formatting (1,23,456)
const formatIndianNumber = (num: number | null | undefined): string =>
  num === null || num === undefined ? "-" : num.toLocaleString("en-IN");

export default function BillingPage() {
  const [data, setData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");

  // Fetch data from backend
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

  // Transform raw data into formatted data for table
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

    formattedData.push({
      name,
      targets,
      achieved,
      achPercent,
      department: records[0]?.user?.department || "Unknown",
    });
  }

  // Apply search and department filters
  const filteredData = formattedData.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all"
        ? true
        : item.department?.toLowerCase() === departmentFilter.toLowerCase();
    return matchesSearch && matchesDepartment;
  });

  const displayMonths = selectedMonth === "all" ? months : [selectedMonth];

  // ✅ Skeleton Loader while loading
  if (loading)
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-1/4" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    );

  return (
    <div className="dark:bg-gray-900 py-8 text-gray-900 dark:text-gray-100">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-400">
          Customer Revenue Overview
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by Revenue Owner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
          />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Months</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {getMonthName(m)}
              </option>
            ))}
          </select>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="all">All Departments</option>
            <option value="sales">Sales</option>
            <option value="support">Support</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
              <th
                rowSpan={2}
                className="px-4 py-3 border border-gray-200 text-sm font-semibold text-left rounded-tl-lg"
              >
                REVENUE OWNER
              </th>
              <th
                colSpan={displayMonths.length}
                className="px-4 py-3 text-center border border-gray-200 text-sm font-semibold"
              >
                Revenue Target
              </th>
              <th
                rowSpan={2}
                className="px-4 py-3 border border-gray-200 text-sm font-semibold"
              >
                Total Target
              </th>
              <th
                colSpan={displayMonths.length}
                className="px-4 py-3 text-center border border-gray-200 text-sm font-semibold"
              >
                Achievement
              </th>
              <th
                colSpan={displayMonths.length}
                className="px-4 py-3 text-center border border-gray-200 text-sm font-semibold rounded-tr-lg"
              >
                Achievement %
              </th>
            </tr>
            <tr className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white">
              {displayMonths.map((m) => (
                <th key={`target-${m}`} className="px-4 py-2 border border-gray-200 text-xs font-medium">
                  {getMonthName(m)}
                </th>
              ))}
              {displayMonths.map((m) => (
                <th key={`ach-${m}`} className="px-4 py-2 border border-gray-200 text-xs font-medium">
                  {getMonthName(m)}
                </th>
              ))}
              {displayMonths.map((m) => (
                <th key={`percent-${m}`} className="px-4 py-2 border border-gray-200 text-xs font-medium">
                  {getMonthName(m)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.length > 0 ? (
              filteredData.map((item, idx) => {
                const totalTarget = displayMonths.reduce(
                  (sum, m) => sum + (item.targets[m] ?? 0),
                  0
                );
                return (
                  <tr
                    key={item.name}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      idx % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : ""
                    }`}
                  >
                    <td className="px-4 py-2 border border-gray-300 font-medium text-blue-700 dark:text-blue-400">
                      {item.name}
                    </td>
                    {displayMonths.map((m) => (
                      <td key={`t-${item.name}-${m}`} className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300">
                        {formatIndianNumber(item.targets[m])}
                      </td>
                    ))}
                    <td className="px-4 py-2 border border-gray-300 font-semibold text-green-700 dark:text-green-400">
                      {formatIndianNumber(totalTarget)}
                    </td>
                    {displayMonths.map((m) => (
                      <td key={`a-${item.name}-${m}`} className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300">
                        {formatIndianNumber(item.achieved[m])}
                      </td>
                    ))}
                    {displayMonths.map((m) => (
                      <td key={`p-${item.name}-${m}`} className="px-4 py-2 border border-gray-300 text-gray-700 dark:text-gray-300">
                        {item.achPercent[m]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={1 + 4 * displayMonths.length + 1} className="px-4 py-2 text-center border border-gray-300 text-gray-500">
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
