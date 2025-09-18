"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Calendar, Users, Search, Target, Percent, BarChart3 } from "lucide-react";


export default function DashboardPage() {
  const [summary, setSummary] = useState<SummaryData | null>(null);

  // 💡 Currency formatter helper
  const formatCurrency = (value: number | undefined | null) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token not found in localStorage");
      return;
    }

    fetch("http://localhost:4003/api/users/targets/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json() as Promise<SummaryResponse>)
      .then((data) => {
        if (data.success) {
          setSummary(data.data);
        }
      })
      .catch((err) => console.error("Error fetching summary:", err));
  }, []);

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 font-sans dark:bg-gray-900">
      
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-2xl rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg">
              <BarChart3 className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-wide">
                eVanik Enterprise Dashboard
              </CardTitle>
              <p className="text-sm md:text-base text-gray-200 mt-1">
                Mission: ₹65 Lakhs by October 18 -{" "}
                <span className="font-semibold text-yellow-300">7 Weeks to Excellence</span>
              </p>
            </div>
          </div>
          <div className="text-right text-sm md:text-base space-y-1 text-gray-200">
            <p>Tuesday, September 16, 2025</p>
            <p>
              Working Days Remaining: <span className="font-bold text-yellow-400">12</span>
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200">
            <h1 className="font-bold text-lg md:text-xl lg:text-2xl">Performance Overview</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Achieved */}
            <Card className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-800 dark:to-blue-900 border rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <p className="text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-200">
                  {formatCurrency(summary?.Total?.achieved)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide">TOTAL ACHIEVED</p>
              </CardContent>
            </Card>

            {/* % Achievement */}
            <Card className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-800 dark:to-green-900 border rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <p className="text-2xl md:text-3xl font-bold text-green-900 dark:text-green-200">
                  {summary?.Total?.percent ? Math.round(summary.Total.percent) : "-"}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide">% ACHIEVEMENT RATE</p>
              </CardContent>
            </Card>

            {/* Remaining Target */}
            <Card className="bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-800 dark:to-yellow-900 border rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <p className="text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-200">
                  {formatCurrency(summary?.Balance)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide">REMAINING TARGET</p>
              </CardContent>
            </Card>

            {/* Required Daily Rate */}
            <Card className="bg-gradient-to-br from-red-100 to-red-50 dark:from-red-800 dark:to-red-900 border rounded-xl shadow-md hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <p className="text-2xl md:text-3xl font-bold text-red-900 dark:text-red-200">
                  {formatCurrency(summary?.RequiredRate)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide">REQUIRED DAILY RATE</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Renewal + Acquisitions Table */}
      <Card className="shadow-xl rounded-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <p>RENEWAL</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              <p>ACQUISITIONS</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <Target className="h-4 w-4 text-yellow-200" />
              <p>TOTAL TARGET</p>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4 text-green-200" />
              <p>TOTAL ACHIEVED</p>
            </div>
            <div className="flex items-center space-x-1">
              <Percent className="h-4 w-4 text-red-200" />
              <p>% ACHIEVEMENT</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm table-fixed min-w-[800px]">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
                <tr>
                  <th className="p-1 min-w-[80px]">TARGET</th>
                  <th className="p-1 min-w-[80px]">ACHIEVED</th>
                  <th className="p-1 min-w-[50px]">%</th>
                  <th className="p-1 min-w-[80px]">TARGET</th>
                  <th className="p-1 min-w-[80px]">ACHIEVED</th>
                  <th className="p-1 min-w-[50px]">%</th>
                  <th className="min-w-[10px]">TOTAL TARGET</th>
                  <th className="p-1 min-w-[100px]">TOTAL ACHIEVED</th>
                  <th className="min-w-[60px]">%ACHIEVED</th>
                  <th className="p-1 min-w-[80px]">BALANCE</th>
                  <th className="p-1 min-w-[80px]">CURRENT AVG</th>
                  <th className="p-1 min-w-[100px]">REQUIRED RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="p-1 truncate">{formatCurrency(summary?.Renewal?.target)}</td>
                  <td className="p-1 truncate">{formatCurrency(summary?.Renewal?.achieved)}</td>
                  <td className="p-1 truncate">{summary?.Renewal?.percent?.toFixed(1) || "-"}%</td>
                  <td className="truncate">{formatCurrency(summary?.Acquisition?.target)}</td>
                  <td className="p-1 truncate">{formatCurrency(summary?.Acquisition?.achieved)}</td>
                  <td className="p-1 truncate">{summary?.Acquisition?.percent?.toFixed(1) || "-"}%</td>
                  <td className="truncate">{formatCurrency(summary?.Total?.target)}</td>
                  <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                    {formatCurrency(summary?.Total?.achieved)}
                  </td>
                  <td className="p-1 text-red-600 dark:text-red-400 font-medium truncate">
                    {summary?.Total?.percent?.toFixed(1) || "-"}%
                  </td>
                  <td className="p-1 truncate">{formatCurrency(summary?.Balance)}</td>
                  <td className="p-1 truncate">{formatCurrency(summary?.CurrentAvg)}</td>
                  <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                    {formatCurrency(summary?.RequiredRate)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
