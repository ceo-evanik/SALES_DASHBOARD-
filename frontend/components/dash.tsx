"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Calendar, Users, Search, Target, Percent, BarChart3 } from "lucide-react";

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);

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
      .then((res) => res.json())
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
      <Card className="bg-blue-900 text-white shadow-lg rounded-xl">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mr-4 shadow">
              <BarChart3 className="h-6 w-6 text-blue-900" />
            </div>
            <div>
              <CardTitle className="text-2xl md:text-3xl font-bold">eVanik Enterprise Dashboard</CardTitle>
              <p className="text-sm md:text-base text-gray-300">
                Mission: ₹65 Lakhs by October 18 - <span className="font-semibold">7 Weeks to Excellence</span>
              </p>
            </div>
          </div>
          <div className="text-right text-sm md:text-base space-y-1">
            <p>Tuesday, September 16, 2025</p>
            <p>
              Working Days Remaining: <span className="font-bold text-yellow-300">12</span>
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Overview */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl font-semibold text-gray-700">
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">

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

              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input placeholder="Search by Revenue Owner..." className="pl-10" />
              </div>
            </div>
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

      {/* Renewal + Acquisitions Overview */}
      <Card className="shadow-md border-none">
        <CardHeader className="bg-blue-900 text-white rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
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
              <Target className="h-4 w-4" />
              <p>TOTAL TARGET</p>
            </div>
            <div className="flex items-center space-x-1">
              <BarChart3 className="h-4 w-4" />
              <p>TOTAL ACHIEVED</p>
            </div>
            <div className="flex items-center space-x-1">
              <Percent className="h-4 w-4" />
              <p>% ACHIEVEMENT</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto"> {/* responsive scroll */}
            <table className="w-full text-left text-sm table-fixed min-w-[800px]">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
            <tr className=" dark:bg-gray-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
  <th className="p-1 min-w-[80px]">TARGET</th>
  <th className="p-1 min-w-[80px]">ACHIEVED</th>
  <th className="p-1 min-w-[50px]">%</th>
  <th className="p-1 min-w-[80px]">TARGET</th>
  <th className="p-1 min-w-[80px]">ACHIEVED</th>
  <th className="p-1 min-w-[50px]">%</th>
  <th className="p-1 min-w-[100px]">TOTAL TARGET</th>
  <th className="p-1 min-w-[100px]">TOTAL ACHIEVED</th>
  <th className=" min-w-[60px]">% ACHIEVEMENT</th>
  <th className="p-1 min-w-[80px]">BALANCE</th>
  <th className="p-1 min-w-[50px]">CURRENT AVG</th>
  <th className="p-1 min-w-[60px]">REQUIRED RATE</th>
</tr>

              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <td className="p-1 truncate">{summary?.Renewal?.target?.toLocaleString() || "-"}</td>
                  <td className="p-1 truncate">{summary?.Renewal?.achieved?.toLocaleString() || "-"}</td>
                  <td className="p-1 truncate">{summary?.Renewal?.percent?.toFixed(1) || "-"}%</td>
                  <td className="p-1 truncate">{summary?.Acquisition?.target?.toLocaleString() || "-"}</td>
                  <td className="p-1 truncate">{summary?.Acquisition?.achieved?.toLocaleString() || "-"}</td>
                  <td className="p-1 truncate">{summary?.Acquisition?.percent?.toFixed(1) || "-"}%</td>
                  <td className="p-1 truncate">{summary?.Total?.target?.toLocaleString() || "-"}</td>
                  <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                    {summary?.Total?.achieved?.toLocaleString() || "-"}
                  </td>
                  <td className="p-1 text-red-600 dark:text-red-400 font-medium truncate">
                    {summary?.Total?.percent?.toFixed(1) || "-"}%
                  </td>
                  <td className="p-1 truncate">{summary?.Balance?.toLocaleString() || "-"}</td>
                  <td className="p-1 truncate">{summary?.CurrentAvg?.toLocaleString() || "-"}</td>
                  <td className="p-1 text-green-600 dark:text-green-400 font-medium truncate">
                    {summary?.RequiredRate?.toLocaleString() || "-"}
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



