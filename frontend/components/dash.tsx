// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Calendar, Users, Search, Target, Percent, BarChart3 } from "lucide-react";

// export default function DashboardPage() {
//   const [summary, setSummary] = useState<any>(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       console.error("Token not found in localStorage");
//       return;
//     }

//     fetch("http://localhost:4003/api/users/targets/summary", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setSummary(data.data);
//         }
//       })
//       .catch((err) => console.error("Error fetching summary:", err));
//   }, []);

//   return (
//     <div className="flex-1 font-sans space-y-4">

//    {/* Header */}
// <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white shadow-xl rounded-2xl">
//   <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
//     <div className="flex items-center">
//       <div className="h-12 w-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 shadow-lg">
//         <BarChart3 className="h-6 w-6 text-indigo-700" />
//       </div>
//       <div>
//         <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
//           eVanik Enterprise Dashboard
//         </CardTitle>
//         <p className="text-sm md:text-base text-gray-200">
//           Mission: <span className="font-semibold text-yellow-300">₹65 Lakhs</span> by October 18 — 
//           <span className="font-semibold"> 7 Weeks to Excellence</span>
//         </p>
//       </div>
//     </div>
//     <div className="text-right text-sm md:text-base space-y-1">
//       <p className="font-medium text-gray-100">Tuesday, September 16, 2025</p>
//       <p>
//         Working Days Remaining:{" "}
//         <span className="font-bold text-emerald-300">12</span>
//       </p>
//     </div>
//   </CardHeader>
// </Card>

//       {/* Performance Overview */}
//       <Card className="shadow-md">
//         <CardHeader>
//           <CardTitle className="text-lg md:text-xl font-semibold text-gray-700">
//             Performance Overview
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">

//           {/* Filters */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 flex-wrap">
//             <div className="flex flex-col sm:flex-row gap-4 flex-1 flex-wrap">
//               <Select>
//                 <SelectTrigger className="w-full sm:w-[200px]">
//                   <Calendar className="mr-2 h-4 w-4" />
//                   <SelectValue placeholder="Filter by Month" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="sep">September 2025</SelectItem>
//                   <SelectItem value="aug">August 2025</SelectItem>
//                   <SelectItem value="jul">July 2025</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select>
//                 <SelectTrigger className="w-full sm:w-[200px]">
//                   <Users className="mr-2 h-4 w-4" />
//                   <SelectValue placeholder="Filter by Team" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Teams</SelectItem>
//                   <SelectItem value="acq">Acquisition</SelectItem>
//                   <SelectItem value="ren">Renewal</SelectItem>
//                 </SelectContent>
//               </Select>

//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//                 <Input placeholder="Search by Revenue Owner..." className="pl-10" />
//               </div>
//             </div>
//           </div>

//  {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900 dark:to-gray-800 border text-center shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//                   ₹{summary?.Total?.achieved ? Math.round(summary.Total.achieved).toLocaleString() : "-"}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 tracking-wide">TOTAL ACHIEVED</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-900 dark:to-gray-800 border text-center shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//                   {summary?.Total?.percent ? Math.round(summary.Total.percent) : "-"}%
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 tracking-wide">% ACHIEVEMENT RATE</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-900 dark:to-gray-800 border text-center shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//                   ₹{summary?.Balance ? Math.round(summary.Balance).toLocaleString() : "-"}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 tracking-wide">REMAINING TARGET</p>
//               </CardContent>
//             </Card>

//             <Card className="bg-gradient-to-br from-red-50 to-white dark:from-red-900 dark:to-gray-800 border text-center shadow-sm">
//               <CardContent className="p-6">
//                 <p className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
//                   ₹{summary?.RequiredRate ? Math.round(summary.RequiredRate).toLocaleString() : "-"}
//                 </p>
//                 <p className="text-sm text-gray-500 dark:text-gray-300 mt-2 tracking-wide">REQUIRED DAILY RATE</p>
//               </CardContent>
//             </Card>
//           </div>


//         </CardContent>
//       </Card>

//       <Card className="shadow-lg border-none rounded-xl overflow-hidden">
//   <CardHeader className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white rounded-t-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
//     {/* Left: Renewal + Acquisition */}
//     <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
//       <div className="flex items-center space-x-2">
//         <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
//         <p className="text-sm font-medium tracking-wide">RENEWAL</p>
//       </div>
//       <div className="flex items-center space-x-2">
//         <span className="h-2 w-2 rounded-full bg-yellow-300"></span>
//         <p className="text-sm font-medium tracking-wide">ACQUISITIONS</p>
//       </div>
//     </div>

//     {/* Right: Stats Legend */}
//     <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm">
//       <div className="flex items-center space-x-1">
//         <Target className="h-4 w-4 text-yellow-300" />
//         <p className="font-medium">TOTAL TARGET</p>
//       </div>
//       <div className="flex items-center space-x-1">
//         <BarChart3 className="h-4 w-4 text-emerald-300" />
//         <p className="font-medium">TOTAL ACHIEVED</p>
//       </div>
//       <div className="flex items-center space-x-1">
//         <Percent className="h-4 w-4 text-pink-300" />
//         <p className="font-medium">% ACHIEVEMENT</p>
//       </div>
//     </div>
//   </CardHeader>
// </Card>

//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
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

    </div>
  );
}
