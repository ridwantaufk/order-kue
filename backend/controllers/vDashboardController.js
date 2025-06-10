require("dotenv").config();
const { Pool } = require("pg");

// Langsung bikin pool-nya di sini
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Cek koneksi saat file ini dipanggil
pool
  .connect()
  .then(() => console.log("✅ Database connected (inline PG Pool)..."))
  .catch((err) => console.error("❌ Failed to connect to database:", err));

class DashboardController {
  // Get dashboard summary data
  async getDashboardSummary(req, res) {
    try {
      const { period = "current" } = req.query;

      let query = `
        SELECT * FROM v_dashboard_summary 
        ORDER BY month_year DESC 
        LIMIT 2
      `;

      // Adjust query based on period
      switch (period) {
        case "last3months":
          query = `
            SELECT * FROM v_dashboard_summary 
            WHERE month_year >= CURRENT_DATE - INTERVAL '3 months'
            ORDER BY month_year DESC
          `;
          break;
        case "last6months":
          query = `
            SELECT * FROM v_dashboard_summary 
            WHERE month_year >= CURRENT_DATE - INTERVAL '6 months'
            ORDER BY month_year DESC
          `;
          break;
        case "lastyear":
          query = `
            SELECT * FROM v_dashboard_summary 
            WHERE month_year >= CURRENT_DATE - INTERVAL '12 months'
            ORDER BY month_year DESC
          `;
          break;
      }

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get top selling products
  async getTopProducts(req, res) {
    try {
      const { limit = 10 } = req.query;

      const query = `
        SELECT * FROM v_top_selling_products 
        LIMIT $1
      `;

      const result = await pool.query(query, [limit]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching top products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get daily sales trend
  async getDailySalesTrend(req, res) {
    try {
      const { days = 30 } = req.query;

      const query = `
        SELECT * FROM v_daily_sales_trend 
        WHERE sale_date >= CURRENT_DATE - INTERVAL '${days} days'
        ORDER BY sale_date ASC
      `;

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching daily sales trend:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get inventory status
  async getInventoryStatus(req, res) {
    try {
      const query = `SELECT * FROM v_inventory_status`;
      console.log("inventory status : ", query);
      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching inventory status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get customer analysis
  async getCustomerAnalysis(req, res) {
    try {
      const { status = "all", limit = 50 } = req.query;

      let query = `SELECT * FROM v_customer_analysis`;
      let params = [];

      if (status !== "all") {
        query += ` WHERE customer_status = $1`;
        params.push(status);
      }

      query += ` ORDER BY total_spent DESC LIMIT $${params.length + 1}`;
      params.push(limit);

      const result = await pool.query(query, params);

      // Also get summary stats
      const summaryQuery = `
        SELECT 
          COUNT(*) as total_customers,
          SUM(CASE WHEN customer_status = 'Active' THEN 1 ELSE 0 END) as active_customers,
          SUM(CASE WHEN customer_status = 'Inactive' THEN 1 ELSE 0 END) as inactive_customers,
          SUM(CASE WHEN customer_status = 'Lost' THEN 1 ELSE 0 END) as lost_customers,
          AVG(total_spent) as avg_customer_value,
          AVG(total_orders) as avg_orders_per_customer
        FROM v_customer_analysis
      `;

      const summaryResult = await pool.query(summaryQuery);

      // console.log("data backend : ", {
      //   customers: result.rows,
      //   summary: summaryResult.rows[0],
      // });

      res.json({
        customers: result.rows,
        summary: summaryResult.rows[0],
      });
    } catch (error) {
      console.error("Error fetching customer analysis:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get monthly comparison data
  async getMonthlyComparison(req, res) {
    try {
      const query = `
        SELECT 
          month_year,
          year,
          month,
          total_sales,
          total_expenses,
          net_profit,
          total_orders,
          unique_customers,
          profit_margin_percentage,
          LAG(total_sales) OVER (ORDER BY month_year) as prev_month_sales,
          LAG(total_expenses) OVER (ORDER BY month_year) as prev_month_expenses,
          LAG(net_profit) OVER (ORDER BY month_year) as prev_month_profit,
          LAG(total_orders) OVER (ORDER BY month_year) as prev_month_orders
        FROM v_dashboard_summary 
        WHERE month_year >= CURRENT_DATE - INTERVAL '12 months'
        ORDER BY month_year DESC
      `;

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching monthly comparison:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get product performance analysis
  async getProductPerformance(req, res) {
    try {
      const { period = "30", category = "all" } = req.query;

      let query = `
        SELECT 
          p.product_id,
          p.product_name,
          p.price,
          p.cost_price,
          p.stock,
          COALESCE(sales.total_sold, 0) as total_sold,
          COALESCE(sales.total_revenue, 0) as total_revenue,
          COALESCE(sales.total_orders, 0) as total_orders,
          (p.price - p.cost_price) as profit_per_unit,
          COALESCE(sales.total_sold, 0) * (p.price - p.cost_price) as total_profit,
          CASE 
            WHEN p.stock <= 5 THEN 'Critical'
            WHEN p.stock <= 10 THEN 'Low'
            WHEN p.stock <= 20 THEN 'Medium'
            ELSE 'Good'
          END as stock_status
        FROM m_products p
        LEFT JOIN (
          SELECT 
            oi.product_id,
            SUM(oi.quantity) as total_sold,
            SUM(oi.quantity * oi.price) as total_revenue,
            COUNT(DISTINCT oi.order_id) as total_orders
          FROM t_order_items oi
          JOIN t_orders o ON oi.order_id = o.order_id
          WHERE o.created_at >= CURRENT_DATE - INTERVAL '${period} days'
            AND o.status NOT IN ('Batal', 'Menunggu')
          GROUP BY oi.product_id
        ) sales ON p.product_id = sales.product_id
        WHERE p.available = true
        ORDER BY COALESCE(sales.total_sold, 0) DESC
      `;

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching product performance:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get expense breakdown
  async getExpenseBreakdown(req, res) {
    try {
      const { period = "current" } = req.query;
      console.log("req.query : ", req.query);

      // Filter tanggal untuk m_costs
      let costDateFilter = `DATE_TRUNC('month', cost_date) = DATE_TRUNC('month', CURRENT_DATE)`;
      // Filter tanggal untuk m_ingredients (asumsi pakai kolom created_at)
      let ingredientDateFilter = `DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)`;

      if (period === "last3months") {
        costDateFilter = `cost_date >= CURRENT_DATE - INTERVAL '3 months'`;
        ingredientDateFilter = `created_at >= CURRENT_DATE - INTERVAL '3 months'`;
      } else if (period === "last6months") {
        costDateFilter = `cost_date >= CURRENT_DATE - INTERVAL '6 months'`;
        ingredientDateFilter = `created_at >= CURRENT_DATE - INTERVAL '6 months'`;
      }

      // Query untuk m_costs
      const costsQuery = `
      SELECT 
        cost_name,
        SUM(amount) as total_amount,
        COUNT(*) as frequency,
        AVG(amount) as avg_amount,
        MAX(amount) as max_amount,
        MIN(amount) as min_amount
      FROM m_costs
      WHERE active = true AND ${costDateFilter}
      GROUP BY cost_name
    `;

      // Query untuk m_ingredients
      // total_amount dihitung dari quantity * price_per_unit
      const ingredientsQuery = `
      SELECT
        ingredient_name AS cost_name,
        SUM(quantity * price_per_unit) AS total_amount,
        COUNT(*) AS frequency,
        AVG(quantity * price_per_unit) AS avg_amount,
        MAX(quantity * price_per_unit) AS max_amount,
        MIN(quantity * price_per_unit) AS min_amount
      FROM m_ingredients
      WHERE ${ingredientDateFilter}
      GROUP BY ingredient_name
    `;

      // Eksekusi kedua query secara paralel
      const [costsResult, ingredientsResult] = await Promise.all([
        pool.query(costsQuery),
        pool.query(ingredientsQuery),
      ]);

      // Gabungkan hasil keduanya
      const combined = [...costsResult.rows, ...ingredientsResult.rows];

      // Jika ingin mengurutkan gabungan berdasarkan total_amount DESC
      combined.sort(
        (a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount)
      );

      console.log("Combined expense breakdown: ", combined);
      res.json(combined);
    } catch (error) {
      console.error("Error fetching expense breakdown:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get sales by hour analysis
  async getSalesByHour(req, res) {
    try {
      const { days = 30 } = req.query;

      const query = `
        SELECT 
          EXTRACT(HOUR FROM o.created_at) as hour,
          COUNT(DISTINCT o.order_id) as total_orders,
          SUM(oi.quantity * oi.price) as total_revenue,
          AVG(oi.quantity * oi.price) as avg_order_value
        FROM t_orders o
        JOIN t_order_items oi ON o.order_id = oi.order_id
        WHERE o.created_at >= CURRENT_DATE - INTERVAL '${days} days'
          AND o.status NOT IN ('Batal', 'Menunggu')
        GROUP BY EXTRACT(HOUR FROM o.created_at)
        ORDER BY hour
      `;

      const result = await pool.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching sales by hour:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get low stock alerts
  async getLowStockAlerts(req, res) {
    try {
      const { threshold = 10 } = req.query;

      const query = `
        SELECT 
          product_id,
          product_name,
          current_stock,
          stock_status,
          monthly_sold,
          months_of_stock_remaining
        FROM v_inventory_status
        WHERE current_stock <= $1
        ORDER BY current_stock ASC
      `;

      const result = await pool.query(query, [threshold]);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Get revenue forecast (simple trend-based)
  async getRevenueForecast(req, res) {
    try {
      const query = `
        WITH monthly_trend AS (
          SELECT 
            month_year,
            total_sales,
            LAG(total_sales, 1) OVER (ORDER BY month_year) as prev_month,
            LAG(total_sales, 2) OVER (ORDER BY month_year) as prev_month_2,
            LAG(total_sales, 3) OVER (ORDER BY month_year) as prev_month_3
          FROM v_dashboard_summary
          WHERE month_year >= CURRENT_DATE - INTERVAL '6 months'
          ORDER BY month_year DESC
          LIMIT 6
        ),
        growth_calculation AS (
          SELECT 
            AVG(
              CASE 
                WHEN prev_month > 0 THEN (total_sales - prev_month) / prev_month * 100
                ELSE 0 
              END
            ) as avg_growth_rate
          FROM monthly_trend
          WHERE prev_month IS NOT NULL
        )
        SELECT 
          (SELECT total_sales FROM monthly_trend ORDER BY month_year DESC LIMIT 1) as current_month_sales,
          avg_growth_rate,
          (SELECT total_sales FROM monthly_trend ORDER BY month_year DESC LIMIT 1) * 
          (1 + avg_growth_rate / 100) as forecasted_next_month
        FROM growth_calculation
      `;

      const result = await pool.query(query);
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error fetching revenue forecast:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new DashboardController();
