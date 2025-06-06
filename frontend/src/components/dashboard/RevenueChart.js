// components/dashboard/RevenueChart.js
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Box,
  Text,
  useColorModeValue,
  Flex,
  Badge,
  Avatar,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Progress,
  StatHelpText,
} from '@chakra-ui/react';

const RevenueChart = ({ data, title = 'Tren Penjualan Harian' }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const revenueChartBgColor = useColorModeValue('white', 'navy.700');

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
    });
  };

  return (
    <Box bg={revenueChartBgColor} borderRadius="20px" p="20px" h="400px">
      <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
        {title}
      </Text>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sale_date" tickFormatter={formatDate} fontSize={12} />
          <YAxis tickFormatter={(value) => formatRupiah(value)} fontSize={12} />
          <Tooltip
            formatter={(value) => [formatRupiah(value), 'Pendapatan']}
            labelFormatter={(label) => `Tanggal: ${formatDate(label)}`}
          />
          <Line
            type="monotone"
            dataKey="daily_revenue"
            stroke={brandColor}
            strokeWidth={3}
            dot={{ fill: brandColor, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

const ExpenseBreakdown = ({ data, title = 'Rincian Pengeluaran' }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const expensesBgColor = useColorModeValue('white', 'navy.700');
  const progressBgColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalExpenses = data.reduce(
    (sum, item) => sum + parseFloat(item.total_amount),
    0,
  );
  const colors = [
    '#4481EB',
    '#04BEFE',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
  ];

  return (
    <Box bg={expensesBgColor} borderRadius="20px" p="20px" h="400px">
      <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
        {title}
      </Text>
      <Box overflowY="auto" h="320px">
        {data.map((item, index) => {
          const percentage = (
            (parseFloat(item.total_amount) / totalExpenses) *
            100
          ).toFixed(1);
          return (
            <Box key={item.cost_name} mb="20px">
              <Flex justify="space-between" align="center" mb="8px">
                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                  {item.cost_name}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  {formatRupiah(item.total_amount)} ({percentage}%)
                </Text>
              </Flex>
              <Progress
                value={percentage}
                colorScheme="blue"
                bg={progressBgColor}
                borderRadius="10px"
                h="8px"
              />
              <Text fontSize="xs" color="gray.500" mt="4px">
                {item.frequency} transaksi • Rata-rata:{' '}
                {formatRupiah(item.avg_amount)}
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

const CustomerInsights = ({ data, summary, title = 'Analisis Pelanggan' }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const customerInsightBgColor = useColorModeValue('white', 'navy.700');

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'yellow';
      case 'Lost':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box bg={customerInsightBgColor} borderRadius="20px" p="20px">
      <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
        {title}
      </Text>

      {/* Summary Stats */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap="20px" mb="20px">
        <Stat>
          <StatLabel fontSize="xs">Total Pelanggan</StatLabel>
          <StatNumber fontSize="lg">{summary?.total_customers || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="xs">Aktif</StatLabel>
          <StatNumber fontSize="lg" color="green.500">
            {summary?.active_customers || 0}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="xs">Tidak Aktif</StatLabel>
          <StatNumber fontSize="lg" color="yellow.500">
            {summary?.inactive_customers || 0}
          </StatNumber>
        </Stat>
        <Stat>
          <StatLabel fontSize="xs">Hilang</StatLabel>
          <StatNumber fontSize="lg" color="red.500">
            {summary?.lost_customers || 0}
          </StatNumber>
        </Stat>
      </SimpleGrid>

      {/* Top Customers */}
      <Text fontSize="md" fontWeight="bold" mb="15px" color={textColor}>
        Top Pelanggan
      </Text>
      <Box overflowY="auto" maxH="300px">
        {data.slice(0, 10).map((customer, index) => (
          <Flex
            key={customer.customer_name}
            justify="space-between"
            align="center"
            mb="15px"
          >
            <Flex align="center">
              <Avatar size="sm" name={customer.customer_name} mr="12px" />
              <Box>
                <Text fontWeight="bold" fontSize="sm" color={textColor}>
                  {customer.customer_name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {customer.total_orders} pesanan •{' '}
                  {customer.total_items_purchased} item
                </Text>
              </Box>
            </Flex>
            <Box textAlign="right">
              <Text fontWeight="bold" fontSize="sm" color={brandColor}>
                {formatRupiah(customer.total_spent)}
              </Text>
              <Badge
                size="sm"
                colorScheme={getStatusColor(customer.customer_status)}
                variant="subtle"
              >
                {customer.customer_status}
              </Badge>
            </Box>
          </Flex>
        ))}
      </Box>
    </Box>
  );
};

const SalesHourChart = ({ data, title = 'Penjualan per Jam' }) => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const salesHourChartBgColor = useColorModeValue('white', 'navy.700');

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box bg={salesHourChartBgColor} borderRadius="20px" p="20px" h="400px">
      <Text fontSize="lg" fontWeight="bold" mb="20px" color={textColor}>
        {title}
      </Text>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            tickFormatter={(value) => `${value}:00`}
            fontSize={12}
          />
          <YAxis tickFormatter={(value) => formatRupiah(value)} fontSize={12} />
          <Tooltip
            formatter={(value) => [formatRupiah(value), 'Pendapatan']}
            labelFormatter={(label) => `Jam: ${label}:00`}
          />
          <Bar
            dataKey="total_revenue"
            fill={brandColor}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export { RevenueChart, ExpenseBreakdown, CustomerInsights, SalesHourChart };
