// --- app/routes/dashboard.tsx ---
// Dashboard page component with summary cards and charts.
import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Import Chart.js directly
import { Card } from "~/components/ui/card"; // Using Card component
import { useTheme } from "~/libs/useTheme"; // Using useTheme hook

interface ChartInstanceMap {
  monthly?: Chart;
  status?: Chart;
}

const Dashboard: React.FC = () => {
  const chartInstances = useRef<ChartInstanceMap>({});
  const { theme } = useTheme(); // Get current theme from context

  const getChartOptions = (currentTheme: "light" | "dark") => {
    const isDark = currentTheme === "dark";
    const gridColor = isDark
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.05)";
    const tickColor = isDark ? "#A0A0A0" : "#6B7280";
    const legendColor = isDark ? "#E0E0E0" : "#374151";

    return {
      bar: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: tickColor },
          },
          x: {
            grid: { display: false },
            ticks: { color: tickColor },
          },
        },
        plugins: { legend: { display: false } },
      },
      doughnut: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom" as const,
            labels: {
              color: legendColor,
              boxWidth: 12,
              padding: 20,
            },
          },
        },
      },
    };
  };

  const createCharts = (currentTheme: "light" | "dark") => {
    // Monthly Requests Chart
    const monthlyCtx = document.getElementById(
      "monthlyRequestsChart",
    ) as HTMLCanvasElement | null;
    if (monthlyCtx) {
      if (chartInstances.current.monthly) {
        chartInstances.current.monthly.destroy(); // Destroy existing chart before creating new one
      }
      chartInstances.current.monthly = new Chart(monthlyCtx.getContext("2d")!, {
        type: "bar",
        data: {
          labels: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
          datasets: [
            {
              label: "Test Requests",
              data: [120, 150, 180, 130, 160, 214],
              backgroundColor: "rgba(0, 123, 255, 0.6)",
              borderColor: "rgba(0, 123, 255, 1)",
              borderWidth: 1,
              borderRadius: 5,
              barThickness: 20,
            },
          ],
        },
        options: getChartOptions(currentTheme).bar,
      });
    }

    // Status Overview Chart
    const statusCtx = document.getElementById(
      "statusOverviewChart",
    ) as HTMLCanvasElement | null;
    if (statusCtx) {
      if (chartInstances.current.status) {
        chartInstances.current.status.destroy(); // Destroy existing chart before creating new one
      }
      chartInstances.current.status = new Chart(statusCtx.getContext("2d")!, {
        type: "doughnut",
        data: {
          labels: ["Completed", "In Progress", "Pending", "Rejected"],
          datasets: [
            {
              data: [350, 120, 80, 25],
              backgroundColor: ["#4ade80", "#3b82f6", "#f59e0b", "#ef4444"],
              borderColor: currentTheme === "dark" ? "#1A1A1A" : "#FFFFFF",
              borderWidth: 4,
            },
          ],
        },
        options: getChartOptions(currentTheme).doughnut,
      });
    }
  };

  useEffect(() => {
    // Recreate charts when theme changes
    createCharts(theme);

    // Cleanup chart instances on component unmount
    return () => {
      if (chartInstances.current.monthly) {
        chartInstances.current.monthly.destroy();
      }
      if (chartInstances.current.status) {
        chartInstances.current.status.destroy();
      }
    };
  }, [theme]); // Dependency on theme to re-render charts

  return (
    <section>
      <h3 className="text-3xl font-semibold text-light-text-main dark:text-dark-text-main">
        Dashboard
      </h3>
      <p className="mt-2 text-light-text-secondary dark:text-dark-text-secondary">
        ภาพรวมสถานะคำขอและกิจกรรมหลักของห้องปฏิบัติการ Star-Labs
        เพื่อให้เห็นภาพรวมที่ชัดเจน
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {/* Summary Cards */}
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-brand-blue/20 text-brand-blue text-2xl">
            🧪
          </div>
          <div>
            <div className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Total Requests
            </div>
            <div className="text-3xl font-bold">1,258</div>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-brand-orange/20 text-brand-orange text-2xl">
            ⏳
          </div>
          <div>
            <div className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Pending Approval
            </div>
            <div className="text-3xl font-bold">32</div>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-500/20 text-green-500 text-2xl">
            ✅
          </div>
          <div>
            <div className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              Completed This Month
            </div>
            <div className="text-3xl font-bold">214</div>
          </div>
        </Card>
        <Card className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-500/20 text-purple-400 text-2xl">
            👥
          </div>
          <div>
            <div className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">
              New Customers
            </div>
            <div className="text-3xl font-bold">8</div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <Card className="lg:col-span-3">
          <h4 className="font-semibold text-lg mb-4">คำขอทดสอบรายเดือน</h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            แสดงจำนวนคำขอทดสอบที่ได้รับในแต่ละเดือน เพื่อติดตามแนวโน้มปริมาณงาน
          </p>
          <div className="chart-container">
            <canvas id="monthlyRequestsChart"></canvas>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h4 className="font-semibold text-lg mb-4">ภาพรวมสถานะ</h4>
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-4">
            สัดส่วนของคำขอทดสอบในสถานะต่างๆ เพื่อบ่งชี้ปัญหาคอขวด
          </p>
          <div className="chart-container">
            <canvas id="statusOverviewChart"></canvas>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
