import React, { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { getRecentBookings, OverViewService } from '../../services/OverViewService'

// Simple inline Card component
const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-2xl shadow">
    <h4 className="text-sm font-medium text-gray-500">{title}</h4>
    <div className="mt-2 text-2xl font-bold">{children}</div>
  </div>
)

// helper to map "2025-06" → { year: "2025", month: "Jun" }
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function parseYearMonth(ym) {
  const [year, m] = ym.split('-')
  const idx = parseInt(m, 10) - 1
  return { year, month: monthNames[idx] }
}

const OverView = () => {
  // KPI card values
  const [kpis, setKpis] = useState({
    totalBookings: 0,
    upcomingEvents: 0,
    monthlyRevenue: 0,
    totalCustomers: 0,
  })

  // pivoted revenue data: [{ month: 'Jan', '2024': revenue, '2025': revenue }, … ]
  const [revenueData, setRevenueData] = useState([])
  // list of years found in the revenue data
  const [years, setYears] = useState([])
  // set recent bookings
  const [recentBookings, setRecentBookings] = useState([])

  useEffect(() => {
    // fetch KPI cards data
    OverViewService.getKpis()
      .then(setKpis)
      .catch(console.error)

    // fetch revenue trend
    OverViewService.getRevenueTrend()
      .then(raw => {
        // Validate that raw is an array
        if (!Array.isArray(raw)) {
          console.error("Expected array from getRevenueTrend but got:", raw)
          setRevenueData([])
          setYears([])
          return
        }

        const byMonth = {}     // temporary mapping: monthName → { month, [year]: revenue }
        const seenYears = new Set()

        raw.forEach(({ month: ym, total_price }) => {
          const { year, month } = parseYearMonth(ym)
          seenYears.add(year)

          if (!byMonth[month]) {
            byMonth[month] = { month }
          }
          // assign revenue under its year key
          byMonth[month][year] = total_price
        })

        // Ensure all months appear in calendar order (Jan–Dec) even if empty
        const fullMonths = monthNames.map(m => byMonth[m] || { month: m })
        setRevenueData(fullMonths)
        setYears(Array.from(seenYears).sort())
      })
      .catch(err => {
        console.error("Failed to load revenue trend:", err)
        setRevenueData([])
        setYears([])
      })
  }, [])

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const res = await getRecentBookings();
      setRecentBookings(res);
    } catch (err) {
      console.error('Error fetching venues:', err);
    }
  };

  // Compute maximum revenue value to set YAxis upper bound.
  const maxRevenue = React.useMemo(() => {
    const maxValue = Math.max(
      ...revenueData.flatMap(obj =>
        Object.entries(obj)
          .filter(([key]) => /^\d{4}$/.test(key)) // Filter properties that are year keys, e.g., '2024', '2025'
          .map(([, value]) => parseFloat(value))
      )
    )
    return maxValue
  }, [revenueData])

  return (
    <div className="p-4 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Bookings">{kpis.totalBookings}</Card>
        <Card title="Upcoming Events">{kpis.upcomingEvents}</Card>
        <Card title="Revenue (This Month)">Rs.{kpis.monthlyRevenue}</Card>
        <Card title="Total Customers">{kpis.totalCustomers}</Card>
      </div>

      {/* Revenue Trend Chart */}
      <div>
        <h3 className="text-lg font-medium mb-2">Revenue by Month</h3>
        <div className="bg-white p-4 rounded-2xl shadow">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={revenueData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, maxRevenue ? Math.ceil(maxRevenue * 1.1) : 1000]}
                width={60}
                tickCount={6}
              />
              <Tooltip
                formatter={(value) => [`Rs.${value}`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              {years.map(year => (
                <Line
                  key={year}
                  type="monotone"
                  dataKey={year}
                  name={year}
                  strokeWidth={2}
                  stroke={
                    year === String(new Date().getFullYear())
                      ? "#2563eb"
                      : "#a3a3a3"
                  }
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white p-4 rounded-2xl shadow overflow-x-auto">
        <h3 className="text-lg font-medium mb-2">Recent Bookings</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentBookings.map((booking) => {
              // Format booking_date as yyyy-mm-dd
              let formattedDate = booking.booking_date;
              if (formattedDate) {
                const dateObj = new Date(formattedDate);
                if (!isNaN(dateObj)) {
                  const yyyy = dateObj.getFullYear();
                  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const dd = String(dateObj.getDate()).padStart(2, '0');
                  formattedDate = `${yyyy}-${mm}-${dd}`;
                }
              }
              return (
                <tr key={booking.booking_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.booking_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formattedDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Rs.{booking.total_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {booking.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OverView
