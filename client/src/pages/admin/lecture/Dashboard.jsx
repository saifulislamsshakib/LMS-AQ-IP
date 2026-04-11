import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const Dashboard = () => {
  return (
    <div className=" mt-10 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Dashboard;
