```mermaid
classDiagram

%% === TABEL UTAMA (Object Simulasi) ===
class "order195 : TOrders" {
    order_id = 195
    order_code = "ORDER-1749550000962-8558"
    customer_name = "Agnia Clara"
    status = "Diterima"
    order_date = 2025-06-10
    address = "Margacinta No. 12"
    created_by = 8
}

class "item192 : TOrderItems" {
    order_item_id = 192
    order_id = 195
    product_id = 120
    quantity = 1
    price = 35000
}

class "item193 : TOrderItems" {
    order_item_id = 193
    order_id = 195
    product_id = 121
    quantity = 1
    price = 35000
}

class "product120 : MProducts" {
    product_id = 120
    product_name = "Brownies Chocochips"
    price = 35000
    available = false
    cost_price = 20000
    current_stock = 0
}

class "product121 : MProducts" {
    product_id = 121
    product_name = "Brownies Ceres"
    price = 35000
    available = false
    cost_price = 20000
    current_stock = 0
}

class "user8 : Users" {
    id = 8
    name = "Ridwan Taufik"
    role = "Super Admin"
}

class "cost8 : MCosts" {
    cost_id = 8
    cost_name = "Gas Elpiji 3kg"
    amount = 60000
    active = true
}

class "visitor192 : Visitors" {
    id = 192
    ip_address = "192.168.1.10"
    country = "Indonesia"
    city = "Bandung"
    page_visited = "/produk"
    visit_time = "2025-06-10 13:45"
    user_agent = "Mobile Safari"
}

%% === VIEWS DASHBOARD (Object Simulasi) ===
class "summaryJune : VDashboardSummary" {
    month_year = "2025-06"
    total_sales = 700000
    total_orders = 20
    unique_customers = 15
    avg_order_value = 35000
    total_items_sold = 30
    total_operational_cost = 600000
    total_ingredients_cost = 250000
    total_expenses = 850000
    net_profit = -150000
    profit_margin_percentage = -21.4
}

class "inventory120 : VInventoryStatus" {
    product_id = 120
    product_name = "Brownies Chocochips"
    current_stock = 0
    monthly_sold = 10
    price = 35000
    cost_price = 20000
    stock_status = "Critical"
    months_of_stock_remaining = 0.0
}

class "customerAgnia : VCustomerAnalysis" {
    customer_name = "Agnia Clara"
    total_orders = 5
    total_spent = 175000
    avg_order_value = 35000
    last_order_date = 2025-06-10
    first_order_date = 2025-05-01
    total_items_purchased = 5
    customer_status = "Active"
}

class "sales20250610 : VDailySalesTrend" {
    sale_date = "2025-06-10"
    daily_orders = 3
    daily_revenue = 105000
    daily_items_sold = 3
    daily_unique_customers = 3
}

class "expenses20250610 : VExpenses" {
    created_date = "2025-06-10"
    total_ingredients_cost = 45000
    total_operational_cost = 60000
    total_sales = 105000
    total_cost_price = 60000
    total_profit = 45000
}

class "projectionJuly : Projection" {
    month = "2025-07"
    projected_sales = 750000
    projected_profit = 120000
}

class "topSelling120 : VTopSellingProducts" {
    product_id = 120
    product_name = "Brownies Chocochips"
    total_sold = 100
    total_revenue = 3500000
    profit_per_unit = 15000
    total_profit = 1500000
}

class "export1 : ExportedReport" {
    report_type = "Laporan Penjualan"
    format = "PDF"
    exported_by = "Super Admin"
    export_time = "2025-06-11 09:00"
}

%% === RELASI TABEL UTAMA ===
"order195 : TOrders" --> "item192 : TOrderItems" : contains
"order195 : TOrders" --> "item193 : TOrderItems" : contains
"item192 : TOrderItems" --> "product120 : MProducts" : refers_to
"item193 : TOrderItems" --> "product121 : MProducts" : refers_to
"order195 : TOrders" --> "user8 : Users" : created_by
"cost8 : MCosts" --> "order195 : TOrders" : affects

%% === RELASI KE VIEWS ===
"customerAgnia : VCustomerAnalysis" --> "summaryJune : VDashboardSummary" : contributes_to
"sales20250610 : VDailySalesTrend" --> "summaryJune : VDashboardSummary" : aggregated_into
"inventory120 : VInventoryStatus" --> "summaryJune : VDashboardSummary" : inventory_for
"expenses20250610 : VExpenses" --> "summaryJune : VDashboardSummary" : expense_data
"projectionJuly : Projection" --> "summaryJune : VDashboardSummary" : predicted_from
"topSelling120 : VTopSellingProducts" --> "summaryJune : VDashboardSummary" : summary_of_sales
"visitor192 : Visitors" --> "summaryJune : VDashboardSummary" : traffic_source
"export1 : ExportedReport" --> "summaryJune : VDashboardSummary" : exported_from
```
