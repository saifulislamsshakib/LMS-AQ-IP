import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetInstructorDashboardQuery } from "@/features/api/purchaseApi";
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
  const { data, isError, isLoading } = useGetInstructorDashboardQuery();

  if (isLoading) return <h1>Loading...</h1>;
  if (isError) return <h1 className="text-red-500">Failed to load data</h1>;

  const totalSales = data?.totalSales || 0;
  const totalRevenue = data?.totalRevenue || 0;

  const courseData = data?.courseStats || [];

  return (
    <div className="mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2">
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-600">Tk {totalRevenue}</p>
        </CardContent>
      </Card>

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
                dataKey="revenue"
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
