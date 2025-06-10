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
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MdPrint, MdPictureAsPdf, MdTableChart } from 'react-icons/md';
import { Button, HStack } from '@chakra-ui/react';

// Export Functions
const exportFunctions = {
  // Print Function
  handlePrint: (elementId, title) => {
    const printContent = document.getElementById(elementId);
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .chart-container { margin-bottom: 30px; }
            .export-buttons { display: none !important; }
            @media print {
              body { margin: 0; }
              .chart-container { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <div class="chart-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  },

  // PDF Export Function
  handlePDFExport: async (elementId, filename, title) => {
    const element = document.getElementById(elementId);
    const buttons = element.querySelector('.export-buttons');

    // Hide buttons temporarily
    if (buttons) buttons.style.display = 'none';

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Add title
      pdf.setFontSize(16);
      pdf.text(title, 20, 20);

      // Calculate image dimensions
      const imgWidth = 170;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);
      pdf.save(`${filename}.pdf`);
    } finally {
      // Show buttons again
      if (buttons) buttons.style.display = 'flex';
    }
  },

  // Excel Export Functions
  handleExcelExport: (data, filename, title, type) => {
    let processedData = [];

    switch (type) {
      case 'revenue':
        processedData = data.map((item) => ({
          Tanggal: new Date(item.sale_date).toLocaleDateString('id-ID'),
          'Pendapatan Harian': item.daily_revenue,
          'Jumlah Transaksi': item.daily_orders || 0,
          'Rata-rata per Transaksi':
            item.daily_revenue / (item.daily_orders || 1),
        }));
        break;

      case 'expense':
        const total = data.reduce(
          (sum, item) => sum + parseFloat(item.total_amount),
          0,
        );
        processedData = data.map((item) => ({
          'Jenis Pengeluaran': item.cost_name,
          'Total Amount': parseFloat(item.total_amount),
          Frekuensi: item.frequency,
          'Rata-rata': parseFloat(item.avg_amount),
          Persentase:
            ((parseFloat(item.total_amount) / total) * 100).toFixed(2) + '%',
        }));
        break;

      case 'customer':
        processedData = data.map((item, index) => ({
          Ranking: index + 1,
          'Nama Pelanggan': item.customer_name,
          'Total Pembelian': item.total_spent,
          'Jumlah Pesanan': item.total_orders,
          'Total Item': item.total_items_purchased,
          Status: item.customer_status,
          'Rata-rata per Pesanan': (
            item.total_spent / item.total_orders
          ).toFixed(0),
        }));
        break;

      case 'sales-hour':
        processedData = data.map((item) => ({
          Jam: `${item.hour}:00`,
          'Total Pendapatan': item.total_revenue,
          'Jumlah Transaksi': item.total_orders || 0,
          'Rata-rata per Transaksi':
            item.total_revenue / (item.total_orders || 1),
        }));
        break;

      default:
        processedData = data;
    }

    const ws = XLSX.utils.json_to_sheet(processedData);

    // Auto-fit column widths
    const range = XLSX.utils.decode_range(ws['!ref']);
    const colDeltas = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let max = 0;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (cell && cell.v) {
          max = Math.max(max, cell.v.toString().length);
        }
      }
      colDeltas.push({ wch: Math.min(max + 2, 50) });
    }
    ws['!cols'] = colDeltas;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, title);

    // Add summary sheet for some types
    if (type === 'customer' && data.length > 0) {
      const summaryData = [
        ['Ringkasan Analisis Pelanggan', ''],
        ['Total Pelanggan', data.length],
        [
          'Total Pendapatan',
          data.reduce((sum, item) => sum + item.total_spent, 0),
        ],
        [
          'Rata-rata Pendapatan per Pelanggan',
          (
            data.reduce((sum, item) => sum + item.total_spent, 0) / data.length
          ).toFixed(0),
        ],
        [
          'Total Pesanan',
          data.reduce((sum, item) => sum + item.total_orders, 0),
        ],
        [
          'Total Item Terjual',
          data.reduce((sum, item) => sum + item.total_items_purchased, 0),
        ],
      ];

      const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
      summaryWs['!cols'] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, summaryWs, 'Ringkasan');
    }

    XLSX.writeFile(wb, `${filename}.xlsx`);
  },
};

const ExportButtons = ({
  onPrint,
  onPDFExport,
  onExcelExport,
  title,
  size = 'sm',
}) => {
  const buttonBg = useColorModeValue('gray.300', 'navy.300');

  return (
    <HStack spacing="10px" className="export-buttons" mb="20px">
      <Button
        leftIcon={<MdPrint />}
        size={size}
        bg={buttonBg}
        onClick={onPrint}
        _hover={{ bg: useColorModeValue('gray.50', 'navy.600') }}
      >
        Print
      </Button>
      <Button
        leftIcon={<MdPictureAsPdf />}
        size={size}
        colorScheme="red"
        onClick={onPDFExport}
      >
        PDF
      </Button>
      <Button
        leftIcon={<MdTableChart />}
        size={size}
        colorScheme="green"
        onClick={onExcelExport}
      >
        Excel
      </Button>
    </HStack>
  );
};

// PERBAIKAN UNTUK GLOBAL DASHBOARD EXPORT
// File: components/dashboard/RevenueChart.js

// 1. TAMBAHKAN PROPS BARU UNTUK GlobalDashboardExport COMPONENT
const GlobalDashboardExport = ({
  revenueData,
  expenseData,
  customerData,
  customerSummary,
  salesHourData,
  // TAMBAHAN PROPS YANG DIPERLUKAN:
  dashboardData,
  topProducts,
  inventoryStatus,
  revenueForecast,
  onExportAll,
}) => {
  const buttonBg = useColorModeValue('white', 'navy.700');
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  // PERBAIKAN FUNGSI GLOBAL PRINT
  const handleGlobalPrint = async () => {
    const printWindow = window.open('', '_blank');

    // FORMAT DATA UNTUK PRINT
    const formatRupiah = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID');
    };

    // BUAT KONTEN HTML LENGKAP
    let printContent = `
      <div class="dashboard-summary">
        <h2>Ringkasan Dashboard</h2>
        <table class="summary-table">
          <tr><th>Pendapatan Bulan Ini</th><td>${formatRupiah(
            dashboardData?.[0]?.total_sales || 0,
          )}</td></tr>
          <tr><th>Total Pengeluaran</th><td>${formatRupiah(
            dashboardData?.[0]?.total_expenses || 0,
          )}</td></tr>
          <tr><th>Laba Bersih</th><td>${formatRupiah(
            dashboardData?.[0]?.net_profit || 0,
          )}</td></tr>
          <tr><th>Total Pesanan</th><td>${
            dashboardData?.[0]?.total_orders || 0
          }</td></tr>
          <tr><th>Pelanggan Unik</th><td>${
            dashboardData?.[0]?.unique_customers || 0
          }</td></tr>
        </table>
      </div>

      <div class="revenue-section">
        <h2>Data Penjualan Harian</h2>
        <table class="data-table">
          <thead>
            <tr><th>Tanggal</th><th>Pendapatan</th><th>Transaksi</th></tr>
          </thead>
          <tbody>
            ${revenueData
              .map(
                (item) => `
              <tr>
                <td>${formatDate(item.sale_date)}</td>
                <td>${formatRupiah(item.daily_revenue)}</td>
                <td>${item.daily_orders || 0}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="expense-section">
        <h2>Rincian Pengeluaran</h2>
        <table class="data-table">
          <thead>
            <tr><th>Jenis Pengeluaran</th><th>Total</th><th>Frekuensi</th><th>Rata-rata</th></tr>
          </thead>
          <tbody>
            ${expenseData
              .map(
                (item) => `
              <tr>
                <td>${item.cost_name}</td>
                <td>${formatRupiah(item.total_amount)}</td>
                <td>${item.frequency}</td>
                <td>${formatRupiah(item.avg_amount)}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="products-section">
        <h2>Produk Terlaris</h2>
        <table class="data-table">
          <thead>
            <tr><th>Produk</th><th>Terjual</th><th>Pendapatan</th><th>Profit</th></tr>
          </thead>
          <tbody>
            ${topProducts
              .slice(0, 10)
              .map(
                (item) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.total_sold} unit</td>
                <td>${formatRupiah(item.total_revenue)}</td>
                <td>${formatRupiah(item.total_profit)}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="customer-section">
        <h2>Top Pelanggan</h2>
        <table class="data-table">
          <thead>
            <tr><th>Nama</th><th>Total Belanja</th><th>Pesanan</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${customerData
              .slice(0, 15)
              .map(
                (item) => `
              <tr>
                <td>${item.customer_name}</td>
                <td>${formatRupiah(item.total_spent)}</td>
                <td>${item.total_orders}</td>
                <td>${item.customer_status}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>

      <div class="inventory-section">
        <h2>Status Inventori</h2>
        <table class="data-table">
          <thead>
            <tr><th>Produk</th><th>Stok</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${inventoryStatus
              .map(
                (item) => `
              <tr>
                <td>${item.product_name}</td>
                <td>${item.current_stock} unit</td>
                <td>${item.stock_status}</td>
              </tr>
            `,
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Complete Dashboard Report - ${new Date().toLocaleDateString(
            'id-ID',
          )}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
            }
            h1 { 
              color: #2D3748; 
              text-align: center; 
              margin-bottom: 30px; 
              font-size: 24px;
            }
            h2 { 
              color: #4A5568; 
              margin-top: 30px; 
              margin-bottom: 15px;
              font-size: 16px;
              border-bottom: 2px solid #E2E8F0;
              padding-bottom: 5px;
            }
            .data-table, .summary-table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 20px;
            }
            .data-table th, .data-table td, .summary-table th, .summary-table td { 
              border: 1px solid #E2E8F0; 
              padding: 8px; 
              text-align: left;
            }
            .data-table th, .summary-table th { 
              background-color: #F7FAFC; 
              font-weight: bold;
            }
            .summary-table th { width: 40%; }
            .dashboard-summary { margin-bottom: 30px; }
            @media print {
              body { margin: 0; }
              .data-table { page-break-inside: avoid; }
              h2 { page-break-after: avoid; }
            }
          </style>
        </head>
        <body>
          <h1>Complete Dashboard Report - ${new Date().toLocaleDateString(
            'id-ID',
          )}</h1>
          ${printContent}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  // PERBAIKAN FUNGSI GLOBAL PDF
  const handleGlobalPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const formatRupiah = (value) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(value);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID');
    };

    // HALAMAN 1: RINGKASAN DASHBOARD
    pdf.setFontSize(20);
    pdf.text('Dashboard Report', 105, 30, { align: 'center' });
    pdf.setFontSize(12);
    pdf.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 105, 40, {
      align: 'center',
    });

    // Ringkasan Utama
    pdf.setFontSize(14);
    pdf.text('RINGKASAN DASHBOARD', 20, 60);

    let yPos = 75;
    pdf.setFontSize(10);
    const summaryData = [
      [
        'Pendapatan Bulan Ini',
        formatRupiah(dashboardData?.[0]?.total_sales || 0),
      ],
      [
        'Total Pengeluaran',
        formatRupiah(dashboardData?.[0]?.total_expenses || 0),
      ],
      ['Laba Bersih', formatRupiah(dashboardData?.[0]?.net_profit || 0)],
      ['Total Pesanan', (dashboardData?.[0]?.total_orders || 0).toString()],
      [
        'Pelanggan Unik',
        (dashboardData?.[0]?.unique_customers || 0).toString(),
      ],
    ];

    summaryData.forEach(([label, value]) => {
      pdf.text(label + ':', 20, yPos);
      pdf.text(value, 120, yPos);
      yPos += 8;
    });

    // HALAMAN 2: DATA PENJUALAN
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('DATA PENJUALAN HARIAN', 20, 30);

    yPos = 45;
    pdf.setFontSize(8);
    pdf.text('Tanggal', 20, yPos);
    pdf.text('Pendapatan', 80, yPos);
    pdf.text('Transaksi', 140, yPos);
    yPos += 5;

    revenueData.slice(0, 30).forEach((item) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 30;
      }
      pdf.text(formatDate(item.sale_date), 20, yPos);
      pdf.text(formatRupiah(item.daily_revenue), 80, yPos);
      pdf.text((item.daily_orders || 0).toString(), 140, yPos);
      yPos += 6;
    });

    // HALAMAN 3: PENGELUARAN
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('RINCIAN PENGELUARAN', 20, 30);

    yPos = 45;
    pdf.setFontSize(8);
    pdf.text('Jenis Pengeluaran', 20, yPos);
    pdf.text('Total', 100, yPos);
    pdf.text('Frekuensi', 140, yPos);
    pdf.text('Rata-rata', 170, yPos);
    yPos += 5;

    expenseData.forEach((item) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 30;
      }
      pdf.text(item.cost_name.substring(0, 25), 20, yPos);
      pdf.text(formatRupiah(item.total_amount), 100, yPos);
      pdf.text(item.frequency.toString(), 140, yPos);
      pdf.text(formatRupiah(item.avg_amount), 170, yPos);
      yPos += 6;
    });

    // HALAMAN 4: TOP PRODUCTS
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('PRODUK TERLARIS', 20, 30);

    yPos = 45;
    pdf.setFontSize(8);
    pdf.text('Produk', 20, yPos);
    pdf.text('Terjual', 80, yPos);
    pdf.text('Pendapatan', 120, yPos);
    pdf.text('Profit', 160, yPos);
    yPos += 5;

    topProducts.slice(0, 25).forEach((item) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 30;
      }
      pdf.text(item.product_name.substring(0, 20), 20, yPos);
      pdf.text(item.total_sold + ' unit', 80, yPos);
      pdf.text(formatRupiah(item.total_revenue), 120, yPos);
      pdf.text(formatRupiah(item.total_profit), 160, yPos);
      yPos += 6;
    });

    // HALAMAN 5: CUSTOMERS
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text('TOP PELANGGAN', 20, 30);

    yPos = 45;
    pdf.setFontSize(8);
    pdf.text('Nama Pelanggan', 20, yPos);
    pdf.text('Total Belanja', 80, yPos);
    pdf.text('Pesanan', 130, yPos);
    pdf.text('Status', 160, yPos);
    yPos += 5;

    customerData.slice(0, 25).forEach((item) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 30;
      }
      pdf.text(item.customer_name.substring(0, 20), 20, yPos);
      pdf.text(formatRupiah(item.total_spent), 80, yPos);
      pdf.text(item.total_orders.toString(), 130, yPos);
      pdf.text(item.customer_status, 160, yPos);
      yPos += 6;
    });

    pdf.save(
      `complete-dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`,
    );
  };

  // PERBAIKAN FUNGSI GLOBAL EXCEL
  const handleGlobalExcel = () => {
    const wb = XLSX.utils.book_new();
    const timestamp = new Date().toISOString().split('T')[0];

    // Helper function to safely convert to number
    const toNumber = (value) => {
      if (value === null || value === undefined || value === '') return 0;
      const num = Number(value);
      return isNaN(num) ? 0 : num;
    };

    // 1. DASHBOARD SUMMARY SHEET
    const dashboardSummaryData = [
      ['COMPLETE DASHBOARD REPORT', ''],
      ['Generated Date', new Date().toLocaleDateString('id-ID')],
      ['Generated Time', new Date().toLocaleTimeString('id-ID')],
      ['', ''],
      ['RINGKASAN UTAMA', ''],
      ['Pendapatan Bulan Ini', toNumber(dashboardData?.[0]?.total_sales)],
      ['Total Pengeluaran', toNumber(dashboardData?.[0]?.total_expenses)],
      ['Laba Bersih', toNumber(dashboardData?.[0]?.net_profit)],
      ['Total Pesanan', toNumber(dashboardData?.[0]?.total_orders)],
      ['Pelanggan Unik', toNumber(dashboardData?.[0]?.unique_customers)],
      [
        'Margin Keuntungan (%)',
        toNumber(dashboardData?.[0]?.profit_margin_percentage),
      ],
      ['', ''],
      ['PROYEKSI PENDAPATAN', ''],
      ['Bulan Ini', toNumber(revenueForecast?.current_month_sales)],
      [
        'Proyeksi Bulan Depan',
        toNumber(revenueForecast?.forecasted_next_month),
      ],
      ['Tingkat Pertumbuhan (%)', toNumber(revenueForecast?.avg_growth_rate)],
    ];

    const summaryWs = XLSX.utils.aoa_to_sheet(dashboardSummaryData);
    summaryWs['!cols'] = [{ wch: 30 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, 'Dashboard Summary');

    // 2. COMPLETE REVENUE SHEET
    console.log('revenueDatas:', revenueData);
    if (revenueData && Array.isArray(revenueData) && revenueData.length > 0) {
      try {
        const revenueProcessed = revenueData.map((item) => ({
          Tanggal: new Date(item.sale_date).toLocaleDateString('id-ID'),
          'Pendapatan Harian': toNumber(item.daily_revenue),
          'Jumlah Transaksi': toNumber(item.daily_orders),
          'Rata-rata per Transaksi':
            toNumber(item.daily_orders) > 0
              ? Math.round(
                  toNumber(item.daily_revenue) / toNumber(item.daily_orders),
                )
              : 0,
          Hari: new Date(item.sale_date).toLocaleDateString('id-ID', {
            weekday: 'long',
          }),
        }));

        // Tambah total dan statistik
        const totalRevenue = revenueData.reduce(
          (sum, item) => sum + toNumber(item.daily_revenue),
          0,
        );
        const totalTransactions = revenueData.reduce(
          (sum, item) => sum + toNumber(item.daily_orders),
          0,
        );

        revenueProcessed.push({
          Tanggal: '=== TOTAL ===',
          'Pendapatan Harian': totalRevenue,
          'Jumlah Transaksi': totalTransactions,
          'Rata-rata per Transaksi':
            totalTransactions > 0
              ? Math.round(totalRevenue / totalTransactions)
              : 0,
          Hari: '',
        });

        const revenueWs = XLSX.utils.json_to_sheet(revenueProcessed);
        revenueWs['!cols'] = [
          { wch: 15 },
          { wch: 20 },
          { wch: 18 },
          { wch: 22 },
          { wch: 12 },
        ];
        XLSX.utils.book_append_sheet(wb, revenueWs, 'Revenue Complete');
        console.log('Revenue sheet berhasil dibuat');
      } catch (error) {
        console.error('Error creating revenue sheet:', error);
      }
    } else {
      console.log('Revenue data kosong atau tidak valid');
      // Buat sheet kosong dengan header
      const emptyRevenueData = [
        [
          'Tanggal',
          'Pendapatan Harian',
          'Jumlah Transaksi',
          'Rata-rata per Transaksi',
          'Hari',
        ],
        ['Data tidak tersedia', '', '', '', ''],
      ];
      const emptyRevenueWs = XLSX.utils.aoa_to_sheet(emptyRevenueData);
      emptyRevenueWs['!cols'] = [
        { wch: 15 },
        { wch: 20 },
        { wch: 18 },
        { wch: 22 },
        { wch: 12 },
      ];
      XLSX.utils.book_append_sheet(wb, emptyRevenueWs, 'Revenue Complete');
    }

    // 3. COMPLETE EXPENSE SHEET
    if (expenseData && Array.isArray(expenseData) && expenseData.length > 0) {
      try {
        const total = expenseData.reduce(
          (sum, item) => sum + toNumber(item.total_amount),
          0,
        );
        const expenseProcessed = expenseData.map((item) => ({
          'Jenis Pengeluaran': item.cost_name || 'N/A',
          'Total Amount': toNumber(item.total_amount),
          Frekuensi: toNumber(item.frequency),
          'Rata-rata': toNumber(item.avg_amount),
          'Persentase (%)':
            total > 0
              ? Number(((toNumber(item.total_amount) / total) * 100).toFixed(2))
              : 0,
          'Total dari Keseluruhan': total,
        }));

        const expenseWs = XLSX.utils.json_to_sheet(expenseProcessed);
        expenseWs['!cols'] = [
          { wch: 25 },
          { wch: 18 },
          { wch: 12 },
          { wch: 18 },
          { wch: 15 },
          { wch: 20 },
        ];
        XLSX.utils.book_append_sheet(wb, expenseWs, 'Expenses Complete');
        console.log('Expense sheet berhasil dibuat');
      } catch (error) {
        console.error('Error creating expense sheet:', error);
      }
    } else {
      console.log('Expense data kosong atau tidak valid');
      const emptyExpenseData = [
        [
          'Jenis Pengeluaran',
          'Total Amount',
          'Frekuensi',
          'Rata-rata',
          'Persentase (%)',
          'Total dari Keseluruhan',
        ],
        ['Data tidak tersedia', '', '', '', '', ''],
      ];
      const emptyExpenseWs = XLSX.utils.aoa_to_sheet(emptyExpenseData);
      emptyExpenseWs['!cols'] = [
        { wch: 25 },
        { wch: 18 },
        { wch: 12 },
        { wch: 18 },
        { wch: 15 },
        { wch: 20 },
      ];
      XLSX.utils.book_append_sheet(wb, emptyExpenseWs, 'Expenses Complete');
    }

    // 4. COMPLETE TOP PRODUCTS SHEET
    if (topProducts && Array.isArray(topProducts) && topProducts.length > 0) {
      try {
        const productsProcessed = topProducts.map((item, index) => ({
          Ranking: index + 1,
          'Nama Produk': item.product_name || 'N/A',
          'Total Terjual (Unit)': toNumber(item.total_sold),
          'Total Pendapatan': toNumber(item.total_revenue),
          'Total Profit': toNumber(item.total_profit),
          'Profit per Unit': toNumber(item.profit_per_unit),
          'Margin Profit (%)':
            toNumber(item.total_revenue) > 0
              ? Number(
                  (
                    (toNumber(item.total_profit) /
                      toNumber(item.total_revenue)) *
                    100
                  ).toFixed(2),
                )
              : 0,
        }));

        const productsWs = XLSX.utils.json_to_sheet(productsProcessed);
        productsWs['!cols'] = [
          { wch: 10 },
          { wch: 30 },
          { wch: 18 },
          { wch: 18 },
          { wch: 15 },
          { wch: 15 },
          { wch: 18 },
        ];
        XLSX.utils.book_append_sheet(wb, productsWs, 'Top Products Complete');
        console.log('Products sheet berhasil dibuat');
      } catch (error) {
        console.error('Error creating products sheet:', error);
      }
    } else {
      console.log('Products data kosong atau tidak valid');
      const emptyProductsData = [
        [
          'Ranking',
          'Nama Produk',
          'Total Terjual (Unit)',
          'Total Pendapatan',
          'Total Profit',
          'Profit per Unit',
          'Margin Profit (%)',
        ],
        ['', 'Data tidak tersedia', '', '', '', '', ''],
      ];
      const emptyProductsWs = XLSX.utils.aoa_to_sheet(emptyProductsData);
      emptyProductsWs['!cols'] = [
        { wch: 10 },
        { wch: 30 },
        { wch: 18 },
        { wch: 18 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
      ];
      XLSX.utils.book_append_sheet(
        wb,
        emptyProductsWs,
        'Top Products Complete',
      );
    }

    // 5. COMPLETE CUSTOMER SHEET
    if (
      customerData &&
      Array.isArray(customerData) &&
      customerData.length > 0
    ) {
      try {
        const customerProcessed = customerData.map((item, index) => ({
          Ranking: index + 1,
          'Nama Pelanggan': item.customer_name || 'N/A',
          'Total Pembelian': toNumber(item.total_spent),
          'Jumlah Pesanan': toNumber(item.total_orders),
          'Total Item': toNumber(item.total_items_purchased),
          'Status Pelanggan': item.customer_status || 'N/A',
          'Rata-rata per Pesanan':
            toNumber(item.total_orders) > 0
              ? Math.round(
                  toNumber(item.total_spent) / toNumber(item.total_orders),
                )
              : 0,
          'Rata-rata Item per Pesanan':
            toNumber(item.total_orders) > 0
              ? Number(
                  (
                    toNumber(item.total_items_purchased) /
                    toNumber(item.total_orders)
                  ).toFixed(1),
                )
              : 0,
        }));

        const customerWs = XLSX.utils.json_to_sheet(customerProcessed);
        customerWs['!cols'] = [
          { wch: 10 },
          { wch: 25 },
          { wch: 18 },
          { wch: 15 },
          { wch: 12 },
          { wch: 15 },
          { wch: 22 },
          { wch: 25 },
        ];
        XLSX.utils.book_append_sheet(wb, customerWs, 'Customers Complete');
        console.log('Customer sheet berhasil dibuat');

        // Customer Summary Sheet
        if (customerSummary) {
          try {
            const totalCustomerRevenue = customerData.reduce(
              (sum, item) => sum + toNumber(item.total_spent),
              0,
            );
            const totalCustomerOrders = customerData.reduce(
              (sum, item) => sum + toNumber(item.total_orders),
              0,
            );
            const totalItemsSold = customerData.reduce(
              (sum, item) => sum + toNumber(item.total_items_purchased),
              0,
            );

            const customerSummaryData = [
              ['RINGKASAN ANALISIS PELANGGAN', ''],
              ['Total Pelanggan', toNumber(customerSummary.total_customers)],
              ['Pelanggan Aktif', toNumber(customerSummary.active_customers)],
              [
                'Pelanggan Tidak Aktif',
                toNumber(customerSummary.inactive_customers),
              ],
              ['Pelanggan Hilang', toNumber(customerSummary.lost_customers)],
              ['', ''],
              ['ANALISIS MENDALAM', ''],
              ['Total Pendapatan dari Semua Pelanggan', totalCustomerRevenue],
              [
                'Rata-rata Pendapatan per Pelanggan',
                customerData.length > 0
                  ? Math.round(totalCustomerRevenue / customerData.length)
                  : 0,
              ],
              ['Total Pesanan Keseluruhan', totalCustomerOrders],
              ['Total Item Terjual', totalItemsSold],
              [
                'Rata-rata Pesanan per Pelanggan',
                customerData.length > 0
                  ? Number(
                      (totalCustomerOrders / customerData.length).toFixed(1),
                    )
                  : 0,
              ],
            ];
            const customerSummaryWs =
              XLSX.utils.aoa_to_sheet(customerSummaryData);
            customerSummaryWs['!cols'] = [{ wch: 35 }, { wch: 25 }];
            XLSX.utils.book_append_sheet(
              wb,
              customerSummaryWs,
              'Customer Summary',
            );
            console.log('Customer summary sheet berhasil dibuat');
          } catch (error) {
            console.error('Error creating customer summary sheet:', error);
          }
        }
      } catch (error) {
        console.error('Error creating customer sheet:', error);
      }
    } else {
      console.log('Customer data kosong atau tidak valid');
      const emptyCustomerData = [
        [
          'Ranking',
          'Nama Pelanggan',
          'Total Pembelian',
          'Jumlah Pesanan',
          'Total Item',
          'Status Pelanggan',
          'Rata-rata per Pesanan',
          'Rata-rata Item per Pesanan',
        ],
        ['', 'Data tidak tersedia', '', '', '', '', '', ''],
      ];
      const emptyCustomerWs = XLSX.utils.aoa_to_sheet(emptyCustomerData);
      emptyCustomerWs['!cols'] = [
        { wch: 10 },
        { wch: 25 },
        { wch: 18 },
        { wch: 15 },
        { wch: 12 },
        { wch: 15 },
        { wch: 22 },
        { wch: 25 },
      ];
      XLSX.utils.book_append_sheet(wb, emptyCustomerWs, 'Customers Complete');
    }

    // 6. COMPLETE INVENTORY SHEET
    if (
      inventoryStatus &&
      Array.isArray(inventoryStatus) &&
      inventoryStatus.length > 0
    ) {
      try {
        const inventoryProcessed = inventoryStatus.map((item) => ({
          'Nama Produk': item.product_name || 'N/A',
          'Stok Saat Ini': toNumber(item.current_stock),
          'Status Stok': item.stock_status || 'N/A',
          'Kategori Peringatan':
            item.stock_status === 'Critical'
              ? 'URGENT'
              : item.stock_status === 'Low'
              ? 'PERHATIAN'
              : item.stock_status === 'Medium'
              ? 'PANTAU'
              : 'AMAN',
        }));

        const inventoryWs = XLSX.utils.json_to_sheet(inventoryProcessed);
        inventoryWs['!cols'] = [
          { wch: 30 },
          { wch: 15 },
          { wch: 15 },
          { wch: 20 },
        ];
        XLSX.utils.book_append_sheet(wb, inventoryWs, 'Inventory Status');
        console.log('Inventory sheet berhasil dibuat');
      } catch (error) {
        console.error('Error creating inventory sheet:', error);
      }
    } else {
      console.log('Inventory data kosong atau tidak valid');
      const emptyInventoryData = [
        ['Nama Produk', 'Stok Saat Ini', 'Status Stok', 'Kategori Peringatan'],
        ['Data tidak tersedia', '', '', ''],
      ];
      const emptyInventoryWs = XLSX.utils.aoa_to_sheet(emptyInventoryData);
      emptyInventoryWs['!cols'] = [
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
      ];
      XLSX.utils.book_append_sheet(wb, emptyInventoryWs, 'Inventory Status');
    }

    // 7. SALES BY HOUR COMPLETE SHEET
    if (
      salesHourData &&
      Array.isArray(salesHourData) &&
      salesHourData.length > 0
    ) {
      try {
        const salesHourProcessed = salesHourData.map((item) => ({
          'Jam Operasional': `${toNumber(item.hour)}:00 - ${
            toNumber(item.hour) + 1
          }:00`,
          Jam: toNumber(item.hour),
          'Total Pendapatan': toNumber(item.total_revenue),
          'Jumlah Transaksi': toNumber(item.total_orders),
          'Rata-rata per Transaksi':
            toNumber(item.total_orders) > 0
              ? Math.round(
                  toNumber(item.total_revenue) / toNumber(item.total_orders),
                )
              : 0,
          'Persentase dari Total Harian': 0, // Will be calculated below
        }));

        // Hitung persentase
        const totalDailyRevenue = salesHourData.reduce(
          (sum, item) => sum + toNumber(item.total_revenue),
          0,
        );

        salesHourProcessed.forEach((item) => {
          item['Persentase dari Total Harian'] =
            totalDailyRevenue > 0
              ? Number(
                  (
                    (item['Total Pendapatan'] / totalDailyRevenue) *
                    100
                  ).toFixed(2),
                )
              : 0;
        });

        const salesHourWs = XLSX.utils.json_to_sheet(salesHourProcessed);
        salesHourWs['!cols'] = [
          { wch: 20 },
          { wch: 8 },
          { wch: 18 },
          { wch: 18 },
          { wch: 22 },
          { wch: 25 },
        ];
        XLSX.utils.book_append_sheet(wb, salesHourWs, 'Sales by Hour Complete');
        console.log('Sales by hour sheet berhasil dibuat');
      } catch (error) {
        console.error('Error creating sales by hour sheet:', error);
      }
    } else {
      console.log('Sales by hour data kosong atau tidak valid');
      const emptySalesHourData = [
        [
          'Jam Operasional',
          'Jam',
          'Total Pendapatan',
          'Jumlah Transaksi',
          'Rata-rata per Transaksi',
          'Persentase dari Total Harian',
        ],
        ['Data tidak tersedia', '', '', '', '', ''],
      ];
      const emptySalesHourWs = XLSX.utils.aoa_to_sheet(emptySalesHourData);
      emptySalesHourWs['!cols'] = [
        { wch: 20 },
        { wch: 8 },
        { wch: 18 },
        { wch: 18 },
        { wch: 22 },
        { wch: 25 },
      ];
      XLSX.utils.book_append_sheet(
        wb,
        emptySalesHourWs,
        'Sales by Hour Complete',
      );
    }

    // Save file
    try {
      XLSX.writeFile(wb, `complete-dashboard-report-${timestamp}.xlsx`);
      console.log(
        'File Excel berhasil dibuat:',
        `complete-dashboard-report-${timestamp}.xlsx`,
      );
    } catch (error) {
      console.error('Error saving Excel file:', error);
    }
  };

  return (
    <Box bg={buttonBg} borderRadius="20px" p="20px" mb="20px" shadow="md">
      <Flex justify="space-between" align="center">
        <Box>
          <Text fontSize="lg" fontWeight="bold" color={textColor} mb="5px">
            Export Dashboard Lengkap
          </Text>
          <Text fontSize="sm" color="gray.500">
            Export semua data dashboard lengkap dalam berbagai format
          </Text>
        </Box>
        <HStack spacing="10px">
          <Button
            leftIcon={<MdPrint />}
            size="md"
            colorScheme="gray"
            onClick={handleGlobalPrint}
            _hover={{ bg: 'gray.50' }}
          >
            Print Semua Data
          </Button>
          <Button
            leftIcon={<MdPictureAsPdf />}
            size="md"
            colorScheme="red"
            onClick={handleGlobalPDF}
          >
            Export PDF
          </Button>
          <Button
            leftIcon={<MdTableChart />}
            size="md"
            colorScheme="green"
            onClick={handleGlobalExcel}
          >
            Export Excel
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

const RevenueChart = ({ data, title = 'Tren Penjualan Harian' }) => {
  const textColor = useColorModeValue('#1A202C', '#F6E05E'); // dark gray & gold
  const axisTextColor = useColorModeValue('#2D3748', '#FBD38D'); // darker gray & soft orange
  const brandColor = useColorModeValue('#E53E3E', '#63B3ED'); // red (light) & blue (dark)
  const dotColor = useColorModeValue('#9B2C2C', '#90CDF4'); // dark red & light blue
  const tooltipBg = useColorModeValue('#FFFFFF', '#2D3748'); // white & dark gray
  const revenueChartBgColor = useColorModeValue('#FFF5F5', '#1A202C'); // very light pink & dark gray-blue

  const chartId = `revenue-chart-${Date.now()}`;

  const formatRupiah = (value) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
    });

  return (
    <Box
      bg={revenueChartBgColor}
      borderRadius="20px"
      p="20px"
      h="480px"
      id={chartId}
    >
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <ExportButtons
          onPrint={() => exportFunctions.handlePrint(chartId, title)}
          onPDFExport={() =>
            exportFunctions.handlePDFExport(chartId, 'revenue-chart', title)
          }
          onExcelExport={() =>
            exportFunctions.handleExcelExport(
              data,
              'revenue-data',
              'Revenue',
              'revenue',
            )
          }
          title={title}
        />
      </Flex>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={axisTextColor} />
          <XAxis
            dataKey="sale_date"
            tickFormatter={formatDate}
            fontSize={12}
            stroke={axisTextColor}
          />
          <YAxis
            tickFormatter={formatRupiah}
            fontSize={12}
            stroke={axisTextColor}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderRadius: '8px',
              color: textColor,
            }}
            formatter={(value) => [formatRupiah(value), 'Pendapatan']}
            labelFormatter={(label) => `Tanggal: ${formatDate(label)}`}
          />
          <Line
            type="monotone"
            dataKey="daily_revenue"
            stroke={brandColor}
            strokeWidth={4}
            dot={{ fill: dotColor, stroke: brandColor, strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7 }}
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
  const chartId = `expense-chart-${Date.now()}`;

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

  return (
    <Box
      bg={expensesBgColor}
      borderRadius="20px"
      p="20px"
      h="480px"
      id={chartId}
    >
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <ExportButtons
          onPrint={() => exportFunctions.handlePrint(chartId, title)}
          onPDFExport={() =>
            exportFunctions.handlePDFExport(chartId, 'expense-breakdown', title)
          }
          onExcelExport={() =>
            exportFunctions.handleExcelExport(
              data,
              'expense-data',
              'Expenses',
              'expense',
            )
          }
          title={title}
        />
      </Flex>
      <Box overflowY="auto" h="380px">
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
  const chartId = `customer-chart-${Date.now()}`;

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
    <Box bg={customerInsightBgColor} borderRadius="20px" p="20px" id={chartId}>
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <ExportButtons
          onPrint={() => exportFunctions.handlePrint(chartId, title)}
          onPDFExport={() =>
            exportFunctions.handlePDFExport(chartId, 'customer-insights', title)
          }
          onExcelExport={() =>
            exportFunctions.handleExcelExport(
              data,
              'customer-data',
              'Customers',
              'customer',
              summary,
            )
          }
          title={title}
        />
      </Flex>

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
  // console.log('SalesHourChart data:', data);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = useColorModeValue('brand.500', 'white');
  const salesHourChartBgColor = useColorModeValue('white', 'navy.700');
  const chartId = `sales-hour-chart-${Date.now()}`;

  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Box
      bg={salesHourChartBgColor}
      borderRadius="20px"
      p="20px"
      h="480px"
      id={chartId}
    >
      <Flex justify="space-between" align="center" mb="20px">
        <Text fontSize="lg" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <ExportButtons
          onPrint={() => exportFunctions.handlePrint(chartId, title)}
          onPDFExport={() =>
            exportFunctions.handlePDFExport(chartId, 'sales-hour-chart', title)
          }
          onExcelExport={() =>
            exportFunctions.handleExcelExport(
              data,
              'sales-hour-data',
              'Sales Hour',
              'sales-hour',
            )
          }
          title={title}
        />
      </Flex>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#63b3ed" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#2b6cb0" stopOpacity={0.8} />
            </linearGradient>
          </defs>

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
            fill="url(#barGradient)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export {
  RevenueChart,
  ExpenseBreakdown,
  CustomerInsights,
  SalesHourChart,
  GlobalDashboardExport,
};
