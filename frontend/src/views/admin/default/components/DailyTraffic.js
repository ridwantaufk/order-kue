import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Chakra imports
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spinner,
  Grid,
  GridItem,
  Badge,
  Tooltip,
  HStack,
  VStack,
  Divider,
} from '@chakra-ui/react';
import BarChart from 'components/charts/BarChart';
// Custom components
import Card from 'components/card/Card.js';
// Assets
import {
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiGlobalLine,
  RiMapPinLine,
  RiPhoneLine,
  RiComputerLine,
  RiTimeLine,
} from 'react-icons/ri';

export default function DailyTraffic(props) {
  const { ...rest } = props;

  // State untuk menyimpan data
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
  });
  const [dailyData, setDailyData] = useState([]);
  const [visitorDetails, setVisitorDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [growthPercentage, setGrowthPercentage] = useState(0);
  const [insights, setInsights] = useState({
    topCountries: [],
    topCities: [],
    topPages: [],
    deviceTypes: { mobile: 0, desktop: 0 },
    uniqueIPs: 0,
  });

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Fetch data dari API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch visitor stats dan daily data secara bersamaan
        const [statsResponse, dailyResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/stats`),
          axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/visitors/daily`),
        ]);

        setVisitorStats(statsResponse.data);
        setDailyData(dailyResponse.data);

        // Hitung persentase pertumbuhan berdasarkan data 7 hari terakhir
        const dailyDataArray = dailyResponse.data;
        if (dailyDataArray.length >= 2) {
          const today = dailyDataArray[dailyDataArray.length - 1].count;
          const yesterday = dailyDataArray[dailyDataArray.length - 2].count;

          if (yesterday > 0) {
            const growth = ((today - yesterday) / yesterday) * 100;
            setGrowthPercentage(growth);
          }
        }

        // Simulasi data insights berdasarkan pola data yang Anda berikan
        // Dalam implementasi nyata, ini harus dari API terpisah
        setInsights({
          topCountries: [
            {
              country: 'Indonesia',
              code: 'ID',
              count: statsResponse.data.totalVisitors,
            },
          ],
          topCities: [
            {
              city: 'Sidoarjo',
              region: 'Jawa Timur',
              count: Math.floor(statsResponse.data.totalVisitors * 0.6),
            },
            {
              city: 'Bandung',
              region: 'Jawa Barat',
              count: Math.floor(statsResponse.data.totalVisitors * 0.4),
            },
          ],
          topPages: [
            { page: '/orderan', count: statsResponse.data.totalVisitors },
          ],
          deviceTypes: {
            mobile: Math.floor(statsResponse.data.totalVisitors * 0.7),
            desktop: Math.floor(statsResponse.data.totalVisitors * 0.3),
          },
          uniqueIPs: Math.floor(statsResponse.data.totalVisitors * 0.8),
        });
      } catch (err) {
        console.error('Error fetching visitor data:', err);
        setError('Failed to load visitor data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Refresh data setiap 5 menit
    const interval = setInterval(fetchData, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Format data untuk chart
  const formatChartData = () => {
    if (!dailyData.length) return [];

    return [
      {
        name: 'Daily Visitors',
        data: dailyData.map((item) => item.count),
      },
    ];
  };

  const formatChartOptions = () => {
    const categories = dailyData.map((item) => {
      const date = new Date(item.date);
      return date.toLocaleDateString('id-ID', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    });

    return {
      chart: {
        toolbar: {
          show: false,
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: undefined,
          backgroundColor: '#000000',
        },
        onDatasetHover: {
          style: {
            fontSize: '12px',
            fontFamily: undefined,
          },
        },
        theme: 'dark',
      },
      xaxis: {
        categories: categories,
        show: false,
        labels: {
          show: true,
          style: {
            colors: '#A3AED0',
            fontSize: '14px',
            fontWeight: '500',
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },
      yaxis: {
        show: false,
        color: 'black',
        labels: {
          show: true,
          style: {
            colors: '#CBD5E0',
            fontSize: '14px',
          },
        },
      },
      grid: {
        show: false,
        strokeDashArray: 5,
        yaxis: {
          lines: {
            show: true,
          },
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          type: 'vertical',
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          colorStops: [
            [
              {
                offset: 0,
                color: '#4318FF',
                opacity: 1,
              },
              {
                offset: 100,
                color: 'rgba(67, 24, 255, 1)',
                opacity: 0.28,
              },
            ],
          ],
        },
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          columnWidth: '40px',
        },
      },
    };
  };

  if (loading) {
    return (
      <Card align="center" direction="column" w="100%" {...rest}>
        <Flex justify="center" align="center" h="400px">
          <VStack spacing={4}>
            <Spinner size="lg" color="blue.500" />
            <Text color="gray.500">Loading visitor analytics...</Text>
          </VStack>
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card align="center" direction="column" w="100%" {...rest}>
        <Flex justify="center" align="center" h="400px">
          <VStack spacing={4}>
            <Icon as={RiTimeLine} boxSize={12} color="red.500" />
            <Text color="red.500" fontWeight="600">
              {error}
            </Text>
            <Text color="gray.500" fontSize="sm">
              Please check your connection and try again
            </Text>
          </VStack>
        </Flex>
      </Card>
    );
  }

  return (
    <Grid templateColumns="1fr" gap={6} w="100%" {...rest}>
      {/* Main Traffic Card */}
      <GridItem>
        <Card align="center" direction="column" w="100%">
          <Flex
            justify="space-between"
            align="start"
            px="10px"
            pt="5px"
            w="100%"
          >
            <Flex flexDirection="column" align="start" me="20px">
              <Flex w="100%">
                <Text
                  me="auto"
                  color="secondaryGray.600"
                  fontSize="sm"
                  fontWeight="500"
                >
                  Daily Traffic Analytics
                </Text>
              </Flex>
              <Flex align="end">
                <Text
                  color={textColor}
                  fontSize="34px"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  {visitorStats.todayVisitors.toLocaleString()}
                </Text>
                <Text
                  ms="6px"
                  color="secondaryGray.600"
                  fontSize="sm"
                  fontWeight="500"
                >
                  Today
                </Text>
              </Flex>
              <HStack spacing={4} mt={2}>
                <Text color="secondaryGray.600" fontSize="xs">
                  Total: {visitorStats.totalVisitors.toLocaleString()} visitors
                </Text>
                <Text color="secondaryGray.600" fontSize="xs">
                  Unique IPs: {insights.uniqueIPs.toLocaleString()}
                </Text>
              </HStack>
            </Flex>
            <Flex align="center">
              <Icon
                as={growthPercentage >= 0 ? RiArrowUpSFill : RiArrowDownSFill}
                color={growthPercentage >= 0 ? 'green.500' : 'red.500'}
              />
              <Text
                color={growthPercentage >= 0 ? 'green.500' : 'red.500'}
                fontSize="sm"
                fontWeight="700"
              >
                {growthPercentage >= 0 ? '+' : ''}
                {growthPercentage.toFixed(1)}%
              </Text>
            </Flex>
          </Flex>

          {/* <Box h="200px" mt="20px" w="100%">
            {dailyData.length > 0 ? (
              <BarChart
                chartData={formatChartData()}
                chartOptions={formatChartOptions()}
              />
            ) : (
              <Flex justify="center" align="center" h="100%">
                <Text color="secondaryGray.600">No data available</Text>
              </Flex>
            )}
          </Box> */}
        </Card>
      </GridItem>

      {/* Insights Grid */}
      <GridItem>
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
          {/* Geographic Insights */}
          <Card>
            <VStack align="start" spacing={3} w="100%">
              <HStack>
                <Icon as={RiGlobalLine} color="blue.500" />
                <Text fontWeight="600" fontSize="md">
                  Geographic Distribution
                </Text>
              </HStack>
              <Divider />
              <VStack align="start" spacing={2} w="100%">
                {insights.topCities.map((city, index) => (
                  <Flex key={index} justify="space-between" w="100%">
                    <HStack>
                      <Icon as={RiMapPinLine} color="gray.500" size="sm" />
                      <Text fontSize="sm">
                        {city.city}, {city.region}
                      </Text>
                    </HStack>
                    <Badge colorScheme="blue" size="sm">
                      {city.count}
                    </Badge>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Card>

          {/* Device Analytics */}
          <Card>
            <VStack align="start" spacing={3} w="100%">
              <HStack>
                <Icon as={RiPhoneLine} color="green.500" />
                <Text fontWeight="600" fontSize="md">
                  Device Types
                </Text>
              </HStack>
              <Divider />
              <VStack align="start" spacing={2} w="100%">
                <Flex justify="space-between" w="100%">
                  <HStack>
                    <Icon as={RiPhoneLine} color="green.500" size="sm" />
                    <Text fontSize="sm">Mobile</Text>
                  </HStack>
                  <Badge colorScheme="green" size="sm">
                    {insights.deviceTypes.mobile} (
                    {Math.round(
                      (insights.deviceTypes.mobile /
                        visitorStats.totalVisitors) *
                        100,
                    )}
                    %)
                  </Badge>
                </Flex>
                <Flex justify="space-between" w="100%">
                  <HStack>
                    <Icon as={RiComputerLine} color="purple.500" size="sm" />
                    <Text fontSize="sm">Desktop</Text>
                  </HStack>
                  <Badge colorScheme="purple" size="sm">
                    {insights.deviceTypes.desktop} (
                    {Math.round(
                      (insights.deviceTypes.desktop /
                        visitorStats.totalVisitors) *
                        100,
                    )}
                    %)
                  </Badge>
                </Flex>
              </VStack>
            </VStack>
          </Card>

          {/* Popular Pages */}
          <Card>
            <VStack align="start" spacing={3} w="100%">
              <HStack>
                <Icon as={RiTimeLine} color="orange.500" />
                <Text fontWeight="600" fontSize="md">
                  Popular Pages
                </Text>
              </HStack>
              <Divider />
              <VStack align="start" spacing={2} w="100%">
                {insights.topPages.map((page, index) => (
                  <Flex key={index} justify="space-between" w="100%">
                    <Text
                      fontSize="sm"
                      fontFamily="mono"
                      bg="gray.100"
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {page.page}
                    </Text>
                    <Badge colorScheme="orange" size="sm">
                      {page.count} visits
                    </Badge>
                  </Flex>
                ))}
              </VStack>
            </VStack>
          </Card>
        </Grid>
      </GridItem>
    </Grid>
  );
}
