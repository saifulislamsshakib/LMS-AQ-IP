// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
// import React from "react";
// import {
//   CartesianGrid,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// const Dashboard = () => {
//   const { data, isSuccess, isError, isLoading } = useGetPublishedCourseQuery();

//   if (isLoading) return <h1> Loading....</h1>;
//   if (isError)
//     return <h1 className="text-red-500"> Faile to get purchased course</h1>;

//   const courses = data?.courses || [];

//   const courseData = courses.map((course) => ({
//     name: course.courseTitle,
//     price: course.coursePrice,
//   }));
//   return (
//     <div className=" mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Sales</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">400</p>
//         </CardContent>
//       </Card>
//       <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <CardHeader>
//           <CardTitle>Total Revenue</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-3xl font-bold text-blue-600">1200</p>
//         </CardContent>
//       </Card>

//       {/* graph */}
//       <Card className="shadow-lg hover:shadow-xl transition-shadow">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-gray-700">
//             Course Price
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <ResponsiveContainer width="100" height={250}>
//             <LineChart data={courseData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis
//                 dataKey="name"
//                 stroke="#6b7280"
//                 angle={-30}
//                 textAnchor="end"
//                 interval={0}
//               />
//               <YAxis stroke="#6b7280" />
//               <Tooltip formatter={(value, name) => [`Tk${value}`, name]} />
//               <Line
//                 type="monotone"
//                 dataKey="price"
//                 stroke="#4a90e2"
//                 strokeWidth={3}
//                 dot={{ stroke: "#490e2", strokeWidth: 2 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Dashboard;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPublishedCourseQuery } from "@/features/api/courseApi";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetPublishedCourseQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to load data</h1>;

  // ✅ safe data
  const courses = data?.courses || [];

  // ✅ chart data
  const courseData = courses.map((course) => ({
    name: course.courseTitle,
    price: course.coursePrice,
  }));

  // ✅ dynamic stats (optional but useful)
  // const totalSales = courses.length;
  // const totalRevenue = courses.reduce(
  //   (acc, course) => acc + (course.coursePrice || 0),
  //   0,
  // );
  const totalSales = courses.length;

  const totalRevenue = courses.reduce(
    (acc, course) => acc + (course.coursePrice || 0),
    0,
  );

  return (
    <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2">
      {/* ✅ Total Sales */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      {/* ✅ Total Revenue */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">Tk {totalRevenue}</p>
        </CardContent>
      </Card>

      {/* ✅ Chart (full width নিচে) */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow sm:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700">
            Course Price
          </CardTitle>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" angle={-30} textAnchor="end" interval={0} />

              <YAxis />

              <Tooltip formatter={(value) => [`Tk ${value}`, "Price"]} />

              <Line
                type="monotone"
                dataKey="price"
                stroke="#4a90e2"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
