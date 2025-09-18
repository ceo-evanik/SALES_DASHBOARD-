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
    <div className="flex-1 font-sans space-y-4">

   {/* Header */}
<Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl rounded-2xl">
  <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
    <div className="flex items-center">
      <div className="h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg">
        <BarChart3 className="h-6 w-6 text-indigo-700" />
      </div>
      <div>
        <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
          eVanik Enterprise Dashboard
        </CardTitle>
        <p className="text-sm md:text-base text-gray-200">
          Mission: <span className="font-semibold text-yellow-300">₹65 Lakhs</span> by October 18 — 
          <span className="font-semibold"> 7 Weeks to Excellence</span>
        </p>
      </div>
    </div>
    <div className="text-right text-sm md:text-base space-y-1">
      <p className="font-medium text-gray-100">Tuesday, September 16, 2025</p>
      <p>
        Working Days Remaining:{" "}
        <span className="font-bold text-emerald-300">12</span>
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

<<<<<<< HEAD
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
=======
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
              <Select>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Calendar className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sep">September 2025</SelectItem>
                  <SelectItem value="aug">August 2025</SelectItem>
                  <SelectItem value="jul">July 2025</SelectItem>
                </SelectContent>
              </Select>
>>>>>>> refs/remotes/origin/main

              <Select>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Users className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  <SelectItem value="acq">Acquisition</SelectItem>
                  <SelectItem value="ren">Renewal</SelectItem>
                </SelectContent>
              </Select>

<<<<<<< HEAD
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
=======
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by Revenue Owner..." className="pl-10" />
              </div>
            </div>
>>>>>>> refs/remotes/origin/main
          </div>

  {/* Stats Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Total Achieved */}
  <Card className="bg-gradient-to-br from-blue-100 via-indigo-50 to-white border text-center shadow-md rounded-xl hover:shadow-lg transition duration-300">
    <CardContent className="p-6">
      <p className="text-2xl md:text-3xl font-bold text-gray-800">
        ₹{summary?.Total?.achieved ? Math.round(summary.Total.achieved).toLocaleString() : "-"}
      </p>
      <p className="text-sm text-gray-500 mt-2 tracking-wide">TOTAL ACHIEVED</p>
    </CardContent>
  </Card>

  {/* Achievement Rate */}
  <Card className="bg-gradient-to-br from-emerald-100 via-green-50 to-white border text-center shadow-md rounded-xl hover:shadow-lg transition duration-300">
    <CardContent className="p-6">
      <p className="text-2xl md:text-3xl font-bold text-gray-800">
        {summary?.Total?.percent ? Math.round(summary.Total.percent) : "-"}%
      </p>
      <p className="text-sm text-gray-500 mt-2 tracking-wide">% ACHIEVEMENT RATE</p>
    </CardContent>
  </Card>

  {/* Remaining Target */}
  <Card className="bg-gradient-to-br from-amber-100 via-yellow-50 to-white border text-center shadow-md rounded-xl hover:shadow-lg transition duration-300">
    <CardContent className="p-6">
      <p className="text-2xl md:text-3xl font-bold text-gray-800">
        ₹{summary?.Balance ? Math.round(summary.Balance).toLocaleString() : "-"}
      </p>
      <p className="text-sm text-gray-500 mt-2 tracking-wide">REMAINING TARGET</p>
    </CardContent>
  </Card>

  {/* Required Daily Rate */}
  <Card className="bg-gradient-to-br from-rose-100 via-red-50 to-white border text-center shadow-md rounded-xl hover:shadow-lg transition duration-300">
    <CardContent className="p-6">
      <p className="text-2xl md:text-3xl font-bold text-gray-800">
        ₹{summary?.RequiredRate ? Math.round(summary.RequiredRate).toLocaleString() : "-"}
      </p>
      <p className="text-sm text-gray-500 mt-2 tracking-wide">REQUIRED DAILY RATE</p>
    </CardContent>
  </Card>
</div>


        </CardContent>
      </Card>

      <Card className="shadow-lg border-none rounded-xl overflow-hidden">
  <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
    {/* Left: Renewal + Acquisition */}
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
        <p className="text-sm font-medium tracking-wide">RENEWAL</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="h-2 w-2 rounded-full bg-yellow-300"></span>
        <p className="text-sm font-medium tracking-wide">ACQUISITIONS</p>
      </div>
    </div>

<<<<<<< HEAD
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
=======
    {/* Right: Stats Legend */}
    <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
      <div className="flex items-center space-x-1">
        <Target className="h-4 w-4 text-yellow-300" />
        <p className="font-medium">TOTAL TARGET</p>
      </div>
      <div className="flex items-center space-x-1">
        <BarChart3 className="h-4 w-4 text-emerald-300" />
        <p className="font-medium">TOTAL ACHIEVED</p>
      </div>
      <div className="flex items-center space-x-1">
        <Percent className="h-4 w-4 text-pink-300" />
        <p className="font-medium">% ACHIEVEMENT</p>
      </div>
    </div>
  </CardHeader>
</Card>
>>>>>>> refs/remotes/origin/main

    </div>
  );
}
