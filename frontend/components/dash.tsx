"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { BarChart3, Target, Percent } from "lucide-react";

// ✅ Shadcn Skeleton import
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // ✅ loading state

  // ✅ Date & Remaining working days in current month
  const [todayDate, setTodayDate] = useState<string>("");
  const [remainingWorkingDaysInMonth, setRemainingWorkingDaysInMonth] = useState<number>(0);

  // -----------------------------
  // Fetch summary data
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("Token not found");

    fetch("http://localhost:4003/api/users/targets/summary", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSummary(data.data);
      })
      .catch((err) => console.error("Error fetching summary:", err))
      .finally(() => setLoading(false)); // ✅ stop loader
  }, []);

  // -----------------------------
  // Compute today string + remaining working days in current month
  // -----------------------------
  useEffect(() => {
    const now = new Date();

    // ✅ Current date in format: "Thursday, September 18, 2025"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(now);
    setTodayDate(formattedDate);

    // ✅ Calculate remaining working days (Sunday off only)
    const year = now.getFullYear();
    const month = now.getMonth(); // 0 = Jan
    const lastDayOfMonth = new Date(year, month + 1, 0); // last date of current month

    let count = 0;
    const current = new Date(now);
    current.setHours(0, 0, 0, 0);
    current.setDate(current.getDate() + 1); // start from tomorrow

    while (current <= lastDayOfMonth) {
      const day = current.getDay(); // 0 = Sunday
      if (day !== 0) {
        count++; // ✅ count all days except Sunday
      }
      current.setDate(current.getDate() + 1);
    }

    setRemainingWorkingDaysInMonth(count);
  }, []);

  // -----------------------------
  // Currency format helper
  // -----------------------------
  const formatINR = (num: number | undefined | null) =>
    num !== undefined && num !== null
      ? "₹" + Math.round(num).toLocaleString("en-IN")
      : "-";

  // -----------------------------
  // Skeleton Loader UI
  // -----------------------------
  const LoaderCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="rounded-2xl shadow-lg">
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // -----------------------------
  // JSX UI
  // -----------------------------
  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 font-sans dark:bg-gray-900">
      
      {/* Header */}
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
                <span className="font-semibold text-yellow-300">
                  {Math.ceil(remainingWorkingDaysInMonth / 6)} Weeks to Excellence
                </span>
              </p>
            </div>
          </div>
          <div className="text-right text-sm md:text-base space-y-1 text-gray-200">
            <p>{todayDate}</p> {/* ✅ Dynamic date */}
            <p>
              Working Days Remaining:{" "}
              <span className="font-bold text-yellow-400">{remainingWorkingDaysInMonth}</span>
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <Card className="shadow-xl rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-200">
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <LoaderCards /> // ✅ Skeleton loader
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Achieved */}
              <Card className="bg-gradient-to-br from-indigo-200 via-blue-100 to-purple-50 dark:from-indigo-900 dark:via-blue-800 dark:to-purple-900 border rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <p className="text-2xl md:text-3xl font-extrabold text-indigo-900 dark:text-indigo-200">
                    {formatINR(summary?.Total?.achieved)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide font-medium">
                    TOTAL ACHIEVED
                  </p>
                </CardContent>
              </Card>

              {/* % Achievement */}
              <Card className="bg-gradient-to-br from-green-200 via-lime-100 to-teal-50 dark:from-green-900 dark:via-lime-800 dark:to-teal-900 border rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <p className="text-2xl md:text-3xl font-extrabold text-green-900 dark:text-green-200">
                    {summary?.Total?.percent ? Math.round(summary.Total.percent) : "-"}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide font-medium">
                    ACHIEVEMENT RATE
                  </p>
                </CardContent>
              </Card>

              {/* Remaining Target */}
              <Card className="bg-gradient-to-br from-yellow-200 via-amber-100 to-orange-50 dark:from-yellow-900 dark:via-amber-800 dark:to-orange-900 border rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <p className="text-2xl md:text-3xl font-extrabold text-yellow-900 dark:text-yellow-200">
                    {formatINR(summary?.Balance)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide font-medium">
                    REMAINING TARGET
                  </p>
                </CardContent>
              </Card>

              {/* Required Daily Rate */}
              <Card className="bg-gradient-to-br from-red-200 via-rose-100 to-pink-50 dark:from-red-900 dark:via-rose-800 dark:to-pink-900 border rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <CardContent className="p-6">
                  <p className="text-2xl md:text-3xl font-extrabold text-red-900 dark:text-red-200">
                    {formatINR(summary?.RequiredRate)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 tracking-wide font-medium">
                    REQUIRED DAILY RATE
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
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
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm table-fixed min-w-[800px]">
                <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="p-1 min-w-[80px]">TARGET</th>
                    <th className="p-1 min-w-[80px]">ACHIEVED</th>
                    <th className="p-1 min-w-[50px]">%</th>
                    <th className="p-1 min-w-[10px]">TOTAL TARGET</th>
                    <th className="p-1 min-w-[100px]">TOTAL ACHIEVED</th>
                    <th className="min-w-[60px]">%ACHIEVEMENT</th>
                    <th className="p-1 min-w-[80px]">BALANCE</th>
                    <th className="p-1 min-w-[80px]">CURRENT AVG</th>
                    <th className="p-1 min-w-[100px]">REQUIRED RATE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="p-1 truncate">{formatINR(summary?.Acquisition?.target)}</td>
                    <td className="p-1 truncate">{formatINR(summary?.Acquisition?.achieved)}</td>
                    <td className="p-1 truncate">{summary?.Acquisition?.percent?.toFixed(1) || "-"}%</td>
                    <td className="p-1 truncate">{formatINR(summary?.Total?.target)}</td>
                    <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                      {formatINR(summary?.Total?.achieved)}
                    </td>
                    <td className="p-1 text-red-600 dark:text-red-400 font-medium truncate">
                      {summary?.Total?.percent?.toFixed(1) || "-"}%
                    </td>
                    <td className="p-1 truncate">{formatINR(summary?.Balance)}</td>
                    <td className="p-1 truncate">{formatINR(summary?.CurrentAvg)}</td>
                    <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                      {formatINR(summary?.RequiredRate)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
