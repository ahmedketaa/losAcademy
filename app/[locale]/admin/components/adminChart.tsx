"use client";

import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";

export default function AdminChart() {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Attend", "Absent", "Pending"],
      datasets: [
        {
          data: [20, 40, 50],
          backgroundColor: [
            documentStyle.getPropertyValue("--secondary-color"),
            documentStyle.getPropertyValue("--primary-color"),
            documentStyle.getPropertyValue("--yellow-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--blue-300"),
            documentStyle.getPropertyValue("--blue-500"),
            documentStyle.getPropertyValue("--yellow-300"),
          ],
        },
      ],
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

  return (
    <div className="card flex justify-content-center">
      <Chart
        type="pie"
        data={chartData}
        options={chartOptions}
        className="w-full md:w-30rem"
        height={"150px"}
        width={"150px"}
      />
    </div>
  );
}
