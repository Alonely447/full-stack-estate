import { useEffect, useState } from "react";
import apiRequest from "../../lib/apiRequest";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./adminDashboard.scss";

function AdminStats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await apiRequest.get("/reports/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load statistics");
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <div className="adminStatsError">{error}</div>;
  }

  if (!stats) {
    return <div className="adminStatsLoading">Loading statistics...</div>;
  }

  // Prepare data for each chart with single value per chart
  const dataWeek = [
    { name: " ", Posts: stats.posts.week, Users: stats.users.week, Messages: stats.messages.week },
  ];

  const dataMonth = [
    { name: " ", Posts: stats.posts.month, Users: stats.users.month, Messages: stats.messages.month },
  ];

  const dataYear = [
    { name: " ", Posts: stats.posts.year, Users: stats.users.year, Messages: stats.messages.year },
  ];

  const renderBarChart = (data, title) => (
    <div style={{ width: "100%", height: 300, marginBottom: 40 }}>
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          barCategoryGap="40%"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Posts" fill="#8884d8" name="Bài viết"/>
          <Bar dataKey="Users" fill="#15c700" name="Người dùng"/>
          <Bar dataKey="Messages" fill="#fd870a" name="Tin nhắn"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="adminStats">
      <h2>Thống kê</h2>
      <div className="totals">
        <p>Tổng số bài viết: {stats.posts.total}</p>
        <p>Tổng số người dùng: {stats.users.total}</p>
        <p>Tổng số tin nhắn được gửi: {stats.messages.total}</p>
      </div>
      {renderBarChart(dataWeek, "Thống kê tuần")}
      {renderBarChart(dataMonth, "Thống kê tháng")}
      {renderBarChart(dataYear, "Thống kê năm")}
    </div>
  );
}

export default AdminStats;
