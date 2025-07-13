<script setup>
import { Bar } from "vue-chartjs";
import { Chart, plugins, registerables } from "chart.js";

Chart.register(...registerables);

const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      data: [
        5500, 4000, 2000, 2400, 3900, 1900, 3100, 2300, 4400, 3600, 5400, 4500,
      ],
      backgroundColor: '#3B82F6',
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      onClick: () => {},
    },
  },
  
};
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
