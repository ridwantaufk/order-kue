// Chakra imports
import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
// Custom components
import MiniCalendar from 'components/calendar/MiniCalendar';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdTrendingUp,
  MdTrendingDown,
  MdWarning,
  MdPeople,
  MdShoppingCart,
  MdInventory,
} from 'react-icons/md';
import CheckTable from 'views/admin/default/components/CheckTable';
import ComplexTable from 'views/admin/default/components/ComplexTable';
import DailyTraffic from 'views/admin/default/components/DailyTraffic';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import {
  RevenueChart,
  ExpenseBreakdown,
  CustomerInsights,
  SalesHourChart,
  GlobalDashboardExport,
} from 'components/dashboard/RevenueChart';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserReports() {
  // Chakra Color Mode
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const userReportBgColor = useColorModeValue('white', 'navy.700');

  // State management
  const [dashboardData, setDashboardData] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [inventoryStatus, setInventoryStatus] = useState([]);
  const [customerStats, setCustomerStats] = useState(null);
  const [expenseBreakdown, setExpenseBreakdown] = useState([]);
  const [salesByHour, setSalesByHour] = useState([]);
  const [revenueForecast, setRevenueForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  const [markedProducts, setMarkedProducts] = useState([]);

  const markedBg = useColorModeValue('#fa8748', '#f08b26');

  const toggleMark = (productName) => {
    setMarkedProducts((prev) =>
      prev.includes(productName)
        ? prev.filter((p) => p !== productName)
        : [...prev, productName],
    );
  };

  const renderProductList = (products) =>
    products.map((item, idx) => {
      const isMarked = markedProducts.includes(item.product_name);
      return (
        <span
          key={item.product_id || idx}
          onClick={() => toggleMark(item.product_name)}
          style={{
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '6px',
            backgroundColor: isMarked ? markedBg : 'transparent',
            marginRight: '6px',
          }}
        >
          {item.product_name}
          {idx < products.length - 1 ? ',' : ''}
        </span>
      );
    });

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('id-ID').format(number);
  };

  const calculateGrowthPercentage = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return Number(((current - previous) / previous) * 100 || 0).toFixed(1);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch dashboard summary
      const summaryResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/summary`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('summaryResponse.data :', summaryResponse.data);

      // Fetch top selling products
      const productsResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/top-products`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('productsResponse.data :', productsResponse.data);

      // Fetch daily sales trend
      const trendResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/daily-trend`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('trendResponse.data :', trendResponse.data);

      // Fetch inventory status
      const inventoryResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/inventory-status`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('inventoryResponse.data :', inventoryResponse.data);

      // Fetch customer analysis
      const customerResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/customer-analysis`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('customerResponse.data :', customerResponse.data);

      // Fetch expense breakdown
      const expenseResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/expense-breakdown?period=${selectedPeriod}`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('expenseResponse.data :', expenseResponse.data);

      // Fetch sales by hour
      const salesHourResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/sales-by-hour`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('salesHourResponse.data :', salesHourResponse.data);

      // Fetch revenue forecast
      const forecastResponse = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/revenue-forecast`,
        { headers: { 'ngrok-skip-browser-warning': true } },
      );
      // console.log('forecastResponse.data :', forecastResponse.data);

      // Set all data
      setDashboardData(summaryResponse.data);
      setTopProducts(productsResponse.data);
      setDailyTrend(trendResponse.data);
      setInventoryStatus(inventoryResponse.data);
      console.log('inventoryResponse.data :', inventoryResponse.data);
      setCustomerStats(customerResponse.data);
      setExpenseBreakdown(expenseResponse.data);
      setSalesByHour(salesHourResponse.data);
      setRevenueForecast(forecastResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  if (loading) {
    return (
      <Box className="fixed left-1/2 translate-x-1/3 top-1/2 -translate-y-1/3">
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" color={brandColor} />
          <Text ml={4} color={textColor}>
            Memuat data dashboard...
          </Text>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  const currentData = dashboardData?.[0] || {};
  const previousData = dashboardData?.[1] || {};

  const revenueGrowth = calculateGrowthPercentage(
    currentData.total_sales,
    previousData.total_sales,
  );
  const expensesGrowth = calculateGrowthPercentage(
    currentData.total_expenses,
    previousData.total_expenses,
  );
  const profitGrowth = calculateGrowthPercentage(
    currentData.net_profit,
    previousData.net_profit,
  );
  const ordersGrowth = calculateGrowthPercentage(
    currentData.total_orders,
    previousData.total_orders,
  );

  // console.log('inventoryStatus :', inventoryStatus);

  // Critical stock items
  const criticalStock = inventoryStatus.filter(
    (item) => item.stock_status === 'Critical',
  );
  const lowStock = inventoryStatus.filter(
    (item) => item.stock_status === 'Low',
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Period Selector */}
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          Dashboard Penjualan
        </Text>
        <Select
          w="200px"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="current">Bulan Ini</option>
          <option value="last3months">3 Bulan Terakhir</option>
          <option value="last6months">6 Bulan Terakhir</option>
          <option value="lastyear">Tahun Lalu</option>
        </Select>
      </Flex>

      <GlobalDashboardExport
        revenueData={dailyTrend}
        expenseData={expenseBreakdown}
        customerData={customerStats?.customers || []}
        customerSummary={customerStats?.summary || {}}
        salesHourData={salesByHour}
        // TAMBAHAN PROPS YANG DIPERLUKAN:
        dashboardData={dashboardData}
        topProducts={topProducts}
        inventoryStatus={inventoryStatus}
        revenueForecast={revenueForecast}
      />

      {/* Stock Alerts */}
      {(criticalStock.length > 0 || lowStock.length > 0) && (
        <Alert status="warning" mb="20px">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Peringatan Stok!</Text>
            {criticalStock.length > 0 && (
              <Text>
                {criticalStock.length} produk dengan stok kritis (≤5):{' '}
                {renderProductList(criticalStock)}
              </Text>
            )}
            {lowStock.length > 0 && (
              <Text>
                {lowStock.length} produk dengan stok rendah (≤10):{' '}
                {renderProductList(lowStock)}
              </Text>
            )}
          </Box>
        </Alert>
      )}

      {/* Main Statistics */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
        gap="20px"
        mb="20px"
      >
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdBarChart} color={brandColor} />
              }
            />
          }
          name="Pendapatan Bulan Ini"
          value={formatRupiah(currentData.total_sales || 0)}
          growth={
            revenueGrowth > 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`
          }
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Pengeluaran"
          value={formatRupiah(currentData.total_expenses || 0)}
          growth={
            expensesGrowth > 0 ? `+${expensesGrowth}%` : `${expensesGrowth}%`
          }
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={
                currentData.net_profit >= 0
                  ? 'linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
                  : 'linear-gradient(90deg, #FF6B6B 0%, #EE5A24 100%)'
              }
              icon={
                <Icon
                  w="28px"
                  h="28px"
                  as={
                    currentData.net_profit >= 0 ? MdTrendingUp : MdTrendingDown
                  }
                  color="white"
                />
              }
            />
          }
          name="Laba Bersih"
          value={formatRupiah(currentData.net_profit || 0)}
          growth={profitGrowth > 0 ? `+${profitGrowth}%` : `${profitGrowth}%`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon
                  w="32px"
                  h="32px"
                  as={MdShoppingCart}
                  color={brandColor}
                />
              }
            />
          }
          name="Total Pesanan"
          value={formatNumber(currentData.total_orders || 0)}
          growth={ordersGrowth > 0 ? `+${ordersGrowth}%` : `${ordersGrowth}%`}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
            />
          }
          name="Pelanggan Unik"
          value={formatNumber(currentData.unique_customers || 0)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdInventory} color={brandColor} />
              }
            />
          }
          name="Margin Keuntungan"
          value={`${Number(currentData.profit_margin_percentage || 0).toFixed(
            1,
          )}%`}
        />
      </SimpleGrid>

      {/* Charts Section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <RevenueChart data={dailyTrend} />
        <ExpenseBreakdown data={expenseBreakdown.slice(0, 8)} />
      </SimpleGrid>

      {/* Revenue Forecast */}
      {revenueForecast && (
        <Box bg={userReportBgColor} borderRadius="20px" p="20px" mb="20px">
          <Text fontSize="lg" fontWeight="bold" mb="15px" color={textColor}>
            Proyeksi Pendapatan
          </Text>
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px">
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.500">
                Bulan Ini
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={brandColor}>
                {formatRupiah(revenueForecast.current_month_sales)}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.500">
                Proyeksi Bulan Depan
              </Text>
              <Text fontSize="xl" fontWeight="bold" color={brandColor}>
                {formatRupiah(revenueForecast.forecasted_next_month)}
              </Text>
            </Box>
            <Box textAlign="center">
              <Text fontSize="sm" color="gray.500">
                Tingkat Pertumbuhan
              </Text>
              <Text
                fontSize="xl"
                fontWeight="bold"
                color={
                  revenueForecast.avg_growth_rate >= 0 ? 'green.500' : 'red.500'
                }
              >
                {revenueForecast.avg_growth_rate >= 0 ? '+' : ''}
                {Number(revenueForecast?.avg_growth_rate || 0).toFixed(1)}%
              </Text>
            </Box>
          </SimpleGrid>
        </Box>
      )}

      {/* Sales Analytics */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <SalesHourChart data={salesByHour} />
        <CustomerInsights
          data={customerStats?.customers || []}
          summary={customerStats?.summary || {}}
        />
      </SimpleGrid>

      {/* Tables and Analytics */}
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} gap="20px" mb="20px">
        {/* Top Products Table */}
        <Box bg={userReportBgColor} borderRadius="20px" p="20px">
          <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
            Produk Terlaris
          </Text>
          {topProducts.slice(0, 5).map((product, index) => (
            <Flex
              key={product.product_id}
              justify="space-between"
              align="center"
              mb="15px"
            >
              <Box>
                <Text fontWeight="bold" color={textColor}>
                  {product.product_name}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Terjual: {formatNumber(product.total_sold)} unit
                </Text>
              </Box>
              <Box textAlign="right">
                <Text fontWeight="bold" color={brandColor}>
                  {formatRupiah(product.total_revenue)}
                </Text>
                <Badge
                  colorScheme={product.profit_per_unit > 0 ? 'green' : 'red'}
                  variant="subtle"
                >
                  Profit: {formatRupiah(product.total_profit)}
                </Badge>
              </Box>
            </Flex>
          ))}
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px">
          <DailyTraffic />
          <Box bg={userReportBgColor} borderRadius="20px" p="20px">
            <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
              Status Inventori
            </Text>
            {inventoryStatus.slice(0, 8).map((item) => (
              <Flex
                key={item.product_id}
                justify="space-between"
                align="center"
                mb="12px"
              >
                <Box>
                  <Text fontWeight="bold" color={textColor}>
                    {item.product_name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Stok: {item.current_stock} unit
                  </Text>
                </Box>
                <Badge
                  colorScheme={
                    item.stock_status === 'Critical'
                      ? 'red'
                      : item.stock_status === 'Low'
                      ? 'orange'
                      : item.stock_status === 'Medium'
                      ? 'yellow'
                      : 'green'
                  }
                >
                  {item.stock_status}
                </Badge>
              </Flex>
            ))}
          </Box>
        </SimpleGrid>
      </SimpleGrid>
    </Box>
  );
}
