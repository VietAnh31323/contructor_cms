import Image from "next/image";
import statistics from "@/assets/svg/statistics.svg";
import React from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  Stack,
} from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
const contactData = [
  { month: "01/24", success: 28, fail: 30, percent: 91 },
  { month: "02/24", success: 13, fail: 20, percent: 70 },
  { month: "03/24", success: 35, fail: 20, percent: 142 },
  { month: "04/24", success: 30, fail: 32, percent: 98 },
  { month: "05/24", success: 20, fail: 19, percent: 85 },
  { month: "06/24", success: 20, fail: 18, percent: 100 },
];

const pieData = [
  { name: "Hoàn thành", value: 80 },
  { name: "Chưa hoàn thành", value: 20 },
];

const COLORS = ["#ff8c00", "#e0e0e0"];
const StatCard = ({ title, value, color }: any) => (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      background: color,
      color: "#fff",
    }}
  >
    <Stack direction="row" alignItems="center" spacing={2}>
      <TrackChangesIcon />
      <Box>
        <Typography variant="body2">{title}</Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

export default function StatisticsPage() {
  return (
    // <Grid
    //   container
    //   justifyContent="center"
    //   alignItems="center"
    //   sx={{
    //     height: "100vh",
    //     overflowY: "auto",
    //     overflowX: "hidden",
    //     p: 2,
    //   }}
    // >
    <Box sx={{ p: 2, background: "#fff", minHeight: "100vh" }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Thống kê tổng quan
      </Typography>

      {/* Top Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Tổng dự án"
            value="3.500 dự án"
            color="linear-gradient(90deg,#7b2ff7,#f107a3)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Công trình" value="80 công trình" color="#16a34a" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Khách hàng" value="100 khách hàng" color="#2563eb" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Dự án đang thực hiện"
            value="15 dự án"
            color="#ef4444"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Tổng quan
            </Typography>

            {[
              { label: "Hoàn thiện", value: 90 },
              { label: "Phản hồi", value: 95 },
              { label: "Bị huỷ", value: 60 },
              { label: "Chưa bắt đầu", value: 20 },
            ].map((item, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body2">{item.label}</Typography>
                <LinearProgress
                  variant="determinate"
                  value={item.value}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    backgroundColor: "#eee",
                  }}
                />
              </Box>
            ))}
          </Card>

          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Tỷ lệ hoàn thành
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, borderRadius: 3 }}>
            <Typography fontWeight="bold" mb={2}>
              Kết quả liên hệ khách hàng
            </Typography>

            <ResponsiveContainer width="100%" height={535}>
              <BarChart data={contactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="success"
                  name="Liên hệ thành công"
                  fill="#1976d2"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="fail"
                  name="Không phản hồi"
                  fill="#cbd5e1"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="percent"
                  stroke="#ef4444"
                  strokeWidth={3}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
      </Grid>
    </Box>
    // </Grid>
  );
}
