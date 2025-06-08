import React from 'react';
import Chart from 'react-apexcharts';

export default function BarChart({ chartData, chartOptions }) {
  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type="bar"
      height="100%"
      width="100%"
    />
  );
}
