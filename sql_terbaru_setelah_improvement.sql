--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

-- Started on 2025-06-06 08:11:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 244 (class 1255 OID 175796)
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'); 
   RETURN NEW; 
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

--
-- TOC entry 245 (class 1255 OID 175797)
-- Name: update_product_availability(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_product_availability() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF NEW.stock = 0 THEN
    NEW.available := false;
  ELSE
    NEW.available := true;
  END IF;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_product_availability() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 175798)
-- Name: configurations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.configurations (
    config_id integer NOT NULL,
    url_backend text NOT NULL,
    port integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url_frontend text NOT NULL
);


ALTER TABLE public.configurations OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 175805)
-- Name: configurations_config_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.configurations_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.configurations_config_id_seq OWNER TO postgres;

--
-- TOC entry 5016 (class 0 OID 0)
-- Dependencies: 216
-- Name: configurations_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configurations_config_id_seq OWNED BY public.configurations.config_id;


--
-- TOC entry 217 (class 1259 OID 175806)
-- Name: m_costs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_costs (
    cost_id integer NOT NULL,
    cost_name character varying(100) NOT NULL,
    cost_description text,
    amount numeric(10,2) NOT NULL,
    cost_date date,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.m_costs OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 175814)
-- Name: m_costs_cost_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_costs_cost_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_costs_cost_id_seq OWNER TO postgres;

--
-- TOC entry 5017 (class 0 OID 0)
-- Dependencies: 218
-- Name: m_costs_cost_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_costs_cost_id_seq OWNED BY public.m_costs.cost_id;


--
-- TOC entry 219 (class 1259 OID 175815)
-- Name: m_ingredients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_ingredients (
    ingredient_id integer NOT NULL,
    ingredient_name character varying(100) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying(50),
    price_per_unit numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    available boolean DEFAULT true NOT NULL
);


ALTER TABLE public.m_ingredients OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 175821)
-- Name: m_ingredients_ingredient_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_ingredients_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_ingredients_ingredient_id_seq OWNER TO postgres;

--
-- TOC entry 5018 (class 0 OID 0)
-- Dependencies: 220
-- Name: m_ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_ingredients_ingredient_id_seq OWNED BY public.m_ingredients.ingredient_id;


--
-- TOC entry 221 (class 1259 OID 175822)
-- Name: m_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_products (
    product_id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    description text,
    price numeric(15,2) NOT NULL,
    stock integer DEFAULT 0,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    icon character varying(100),
    cost_price numeric(15,2) NOT NULL,
    available boolean DEFAULT false
);


ALTER TABLE public.m_products OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 175831)
-- Name: m_tools; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.m_tools (
    tool_id integer NOT NULL,
    tool_name character varying(100) NOT NULL,
    tool_description text,
    purchase_date date,
    price numeric(10,2),
    quantity integer,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    available boolean DEFAULT true NOT NULL
);


ALTER TABLE public.m_tools OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 175839)
-- Name: m_tools_tool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.m_tools_tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.m_tools_tool_id_seq OWNER TO postgres;

--
-- TOC entry 5019 (class 0 OID 0)
-- Dependencies: 223
-- Name: m_tools_tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_tools_tool_id_seq OWNED BY public.m_tools.tool_id;


--
-- TOC entry 224 (class 1259 OID 175840)
-- Name: t_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.t_order_items OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 175845)
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_order_item_id_seq OWNER TO postgres;

--
-- TOC entry 5020 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.t_order_items.order_item_id;


--
-- TOC entry 226 (class 1259 OID 175846)
-- Name: t_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_orders (
    order_id integer NOT NULL,
    order_code text NOT NULL,
    customer_name character varying(100) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) NOT NULL
);


ALTER TABLE public.t_orders OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 175853)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 5021 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.t_orders.order_id;


--
-- TOC entry 228 (class 1259 OID 175854)
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_product_id_seq OWNER TO postgres;

--
-- TOC entry 5022 (class 0 OID 0)
-- Dependencies: 228
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.m_products.product_id;


--
-- TOC entry 229 (class 1259 OID 175855)
-- Name: t_utils_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_utils_product (
    id integer NOT NULL,
    product_id integer NOT NULL,
    favorite integer
);


ALTER TABLE public.t_utils_product OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 175858)
-- Name: t_utils_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_utils_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_utils_product_id_seq OWNER TO postgres;

--
-- TOC entry 5023 (class 0 OID 0)
-- Dependencies: 230
-- Name: t_utils_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_utils_product_id_seq OWNED BY public.t_utils_product.id;


--
-- TOC entry 231 (class 1259 OID 175859)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    age integer,
    created_at timestamp(0) without time zone DEFAULT now(),
    updated_at timestamp(0) without time zone DEFAULT now(),
    username character varying(100) NOT NULL,
    password text NOT NULL,
    birth_date date,
    phone_number character varying(20),
    address text,
    role character varying(50) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 175866)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5024 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 242 (class 1259 OID 175968)
-- Name: v_customer_analysis; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_customer_analysis AS
 SELECT o.customer_name,
    count(DISTINCT o.order_id) AS total_orders,
    sum(((oi.quantity)::numeric * oi.price)) AS total_spent,
    avg(((oi.quantity)::numeric * oi.price)) AS avg_order_value,
    max(o.created_at) AS last_order_date,
    min(o.created_at) AS first_order_date,
    sum(oi.quantity) AS total_items_purchased,
        CASE
            WHEN (max(o.created_at) >= (CURRENT_DATE - '30 days'::interval)) THEN 'Active'::text
            WHEN (max(o.created_at) >= (CURRENT_DATE - '90 days'::interval)) THEN 'Inactive'::text
            ELSE 'Lost'::text
        END AS customer_status
   FROM (public.t_orders o
     JOIN public.t_order_items oi ON ((o.order_id = oi.order_id)))
  WHERE ((o.status)::text <> 'cancelled'::text)
  GROUP BY o.customer_name
  ORDER BY (sum(((oi.quantity)::numeric * oi.price))) DESC;


ALTER VIEW public.v_customer_analysis OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 175963)
-- Name: v_daily_sales_trend; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_daily_sales_trend AS
 SELECT date(o.created_at) AS sale_date,
    count(DISTINCT o.order_id) AS daily_orders,
    sum(((oi.quantity)::numeric * oi.price)) AS daily_revenue,
    sum(oi.quantity) AS daily_items_sold,
    count(DISTINCT o.customer_name) AS daily_unique_customers
   FROM (public.t_orders o
     JOIN public.t_order_items oi ON ((o.order_id = oi.order_id)))
  WHERE ((o.created_at >= (CURRENT_DATE - '30 days'::interval)) AND ((o.status)::text <> 'cancelled'::text))
  GROUP BY (date(o.created_at))
  ORDER BY (date(o.created_at)) DESC;


ALTER VIEW public.v_daily_sales_trend OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 175949)
-- Name: v_ingredients_cost_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_ingredients_cost_summary AS
 SELECT date_trunc('month'::text, created_at) AS month_year,
    EXTRACT(year FROM created_at) AS year,
    EXTRACT(month FROM created_at) AS month,
    sum((quantity * price_per_unit)) AS total_ingredients_cost,
    count(*) AS total_ingredients,
    avg(price_per_unit) AS avg_price_per_unit
   FROM public.m_ingredients
  WHERE (available = true)
  GROUP BY (date_trunc('month'::text, created_at)), (EXTRACT(year FROM created_at)), (EXTRACT(month FROM created_at))
  ORDER BY (date_trunc('month'::text, created_at)) DESC;


ALTER VIEW public.v_ingredients_cost_summary OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 175944)
-- Name: v_monthly_expenses_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_monthly_expenses_summary AS
 SELECT date_trunc('month'::text, (cost_date)::timestamp with time zone) AS month_year,
    EXTRACT(year FROM cost_date) AS year,
    EXTRACT(month FROM cost_date) AS month,
    sum(amount) AS total_operational_cost,
    count(*) AS total_expense_entries,
    avg(amount) AS avg_expense_amount
   FROM public.m_costs
  WHERE ((active = true) AND (cost_date IS NOT NULL))
  GROUP BY (date_trunc('month'::text, (cost_date)::timestamp with time zone)), (EXTRACT(year FROM cost_date)), (EXTRACT(month FROM cost_date))
  ORDER BY (date_trunc('month'::text, (cost_date)::timestamp with time zone)) DESC;


ALTER VIEW public.v_monthly_expenses_summary OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 175939)
-- Name: v_monthly_sales_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_monthly_sales_summary AS
 SELECT date_trunc('month'::text, o.created_at) AS month_year,
    EXTRACT(year FROM o.created_at) AS year,
    EXTRACT(month FROM o.created_at) AS month,
    count(DISTINCT o.order_id) AS total_orders,
    count(DISTINCT o.customer_name) AS unique_customers,
    sum(((oi.quantity)::numeric * oi.price)) AS total_revenue,
    avg(((oi.quantity)::numeric * oi.price)) AS avg_order_value,
    sum(oi.quantity) AS total_items_sold
   FROM (public.t_orders o
     JOIN public.t_order_items oi ON ((o.order_id = oi.order_id)))
  WHERE ((o.status)::text <> 'cancelled'::text)
  GROUP BY (date_trunc('month'::text, o.created_at)), (EXTRACT(year FROM o.created_at)), (EXTRACT(month FROM o.created_at))
  ORDER BY (date_trunc('month'::text, o.created_at)) DESC;


ALTER VIEW public.v_monthly_sales_summary OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 175953)
-- Name: v_dashboard_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_dashboard_summary AS
 SELECT COALESCE((s.month_year)::timestamp with time zone, e.month_year, (i.month_year)::timestamp with time zone) AS month_year,
    COALESCE(s.year, e.year, i.year) AS year,
    COALESCE(s.month, e.month, i.month) AS month,
    COALESCE(s.total_revenue, (0)::numeric) AS total_sales,
    COALESCE(s.total_orders, (0)::bigint) AS total_orders,
    COALESCE(s.unique_customers, (0)::bigint) AS unique_customers,
    COALESCE(s.avg_order_value, (0)::numeric) AS avg_order_value,
    COALESCE(s.total_items_sold, (0)::bigint) AS total_items_sold,
    COALESCE(e.total_operational_cost, (0)::numeric) AS total_operational_cost,
    COALESCE(i.total_ingredients_cost, (0)::numeric) AS total_ingredients_cost,
    (COALESCE(e.total_operational_cost, (0)::numeric) + COALESCE(i.total_ingredients_cost, (0)::numeric)) AS total_expenses,
    (COALESCE(s.total_revenue, (0)::numeric) - (COALESCE(e.total_operational_cost, (0)::numeric) + COALESCE(i.total_ingredients_cost, (0)::numeric))) AS net_profit,
        CASE
            WHEN (COALESCE(s.total_revenue, (0)::numeric) > (0)::numeric) THEN (((COALESCE(s.total_revenue, (0)::numeric) - (COALESCE(e.total_operational_cost, (0)::numeric) + COALESCE(i.total_ingredients_cost, (0)::numeric))) / COALESCE(s.total_revenue, (0)::numeric)) * (100)::numeric)
            ELSE (0)::numeric
        END AS profit_margin_percentage
   FROM ((public.v_monthly_sales_summary s
     FULL JOIN public.v_monthly_expenses_summary e ON ((s.month_year = e.month_year)))
     FULL JOIN public.v_ingredients_cost_summary i ON ((COALESCE((s.month_year)::timestamp with time zone, e.month_year) = i.month_year)))
  ORDER BY COALESCE((s.month_year)::timestamp with time zone, e.month_year, (i.month_year)::timestamp with time zone) DESC;


ALTER VIEW public.v_dashboard_summary OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 175867)
-- Name: v_expenses; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_expenses AS
 WITH date_range AS (
         SELECT (generate_series((( SELECT (min(min_dates.created_at))::date AS min
                   FROM ( SELECT m_ingredients.created_at
                           FROM public.m_ingredients
                        UNION
                         SELECT m_costs.created_at
                           FROM public.m_costs
                        UNION
                         SELECT t_order_items.created_at
                           FROM public.t_order_items
                        UNION
                         SELECT m_products.created_at
                           FROM public.m_products) min_dates))::timestamp with time zone, (( SELECT (max(max_dates.created_at))::date AS max
                   FROM ( SELECT m_ingredients.created_at
                           FROM public.m_ingredients
                        UNION
                         SELECT m_costs.created_at
                           FROM public.m_costs
                        UNION
                         SELECT t_order_items.created_at
                           FROM public.t_order_items
                        UNION
                         SELECT m_products.created_at
                           FROM public.m_products) max_dates))::timestamp with time zone, '1 day'::interval))::date AS created_date
        ), sales AS (
         SELECT (toi.created_at)::date AS created_date,
            sum((toi.price * (toi.quantity)::numeric)) AS total_sales,
            sum((mp.cost_price * (toi.quantity)::numeric)) AS total_cost_price,
            sum((toi.price - mp.cost_price)) AS total_profit
           FROM (public.t_order_items toi
             JOIN public.m_products mp ON ((mp.product_id = toi.product_id)))
          GROUP BY ((toi.created_at)::date)
        )
 SELECT dr.created_date,
    COALESCE(ingredients.total_ingredients_cost, (0)::numeric) AS total_ingredients_cost,
    COALESCE(costs.total_operational_cost, (0)::numeric) AS total_operational_cost,
    COALESCE(sales.total_sales, (0)::numeric) AS total_sales,
    COALESCE(sales.total_cost_price, (0)::numeric) AS total_cost_price,
    COALESCE(product_prices.total_product_price, (0)::numeric) AS total_product_price,
    COALESCE(sales.total_profit, (0)::numeric) AS total_profit
   FROM ((((date_range dr
     LEFT JOIN ( SELECT (mi.created_at)::date AS created_date,
            sum((mi.price_per_unit * mi.quantity)) AS total_ingredients_cost
           FROM public.m_ingredients mi
          GROUP BY ((mi.created_at)::date)) ingredients ON ((dr.created_date = ingredients.created_date)))
     LEFT JOIN ( SELECT (mc.created_at)::date AS created_date,
            sum(mc.amount) AS total_operational_cost
           FROM public.m_costs mc
          GROUP BY ((mc.created_at)::date)) costs ON ((dr.created_date = costs.created_date)))
     LEFT JOIN sales ON ((dr.created_date = sales.created_date)))
     LEFT JOIN ( SELECT (mp.created_at)::date AS created_date,
            sum(mp.price) AS total_product_price
           FROM public.m_products mp
          GROUP BY ((mp.created_at)::date)) product_prices ON ((dr.created_date = product_prices.created_date)))
  WHERE ((COALESCE(ingredients.total_ingredients_cost, (0)::numeric) <> (0)::numeric) OR (COALESCE(costs.total_operational_cost, (0)::numeric) <> (0)::numeric) OR (COALESCE(sales.total_sales, (0)::numeric) <> (0)::numeric) OR (COALESCE(sales.total_cost_price, (0)::numeric) <> (0)::numeric) OR (COALESCE(product_prices.total_product_price, (0)::numeric) <> (0)::numeric))
  ORDER BY dr.created_date;


ALTER VIEW public.v_expenses OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 175973)
-- Name: v_inventory_status; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_inventory_status AS
 SELECT p.product_id,
    p.product_name,
    p.stock AS current_stock,
    COALESCE(recent_sales.monthly_sold, (0)::bigint) AS monthly_sold,
    p.price,
    p.cost_price,
        CASE
            WHEN (p.stock <= 5) THEN 'Critical'::text
            WHEN (p.stock <= 10) THEN 'Low'::text
            WHEN (p.stock <= 20) THEN 'Medium'::text
            ELSE 'Good'::text
        END AS stock_status,
        CASE
            WHEN (COALESCE(recent_sales.monthly_sold, (0)::bigint) > 0) THEN round(((p.stock)::numeric / (recent_sales.monthly_sold)::numeric), 2)
            ELSE NULL::numeric
        END AS months_of_stock_remaining
   FROM (public.m_products p
     LEFT JOIN ( SELECT oi.product_id,
            sum(oi.quantity) AS monthly_sold
           FROM (public.t_order_items oi
             JOIN public.t_orders o ON ((oi.order_id = o.order_id)))
          WHERE ((o.created_at >= (CURRENT_DATE - '30 days'::interval)) AND ((o.status)::text <> 'cancelled'::text))
          GROUP BY oi.product_id) recent_sales ON ((p.product_id = recent_sales.product_id)))
  WHERE (p.available = true)
  ORDER BY
        CASE
            WHEN (p.stock <= 5) THEN 1
            WHEN (p.stock <= 10) THEN 2
            WHEN (p.stock <= 20) THEN 3
            ELSE 4
        END, p.product_name;


ALTER VIEW public.v_inventory_status OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 175958)
-- Name: v_top_selling_products; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_top_selling_products AS
 SELECT p.product_id,
    p.product_name,
    p.price,
    p.cost_price,
    sum(oi.quantity) AS total_sold,
    sum(((oi.quantity)::numeric * oi.price)) AS total_revenue,
    count(DISTINCT oi.order_id) AS total_orders,
    avg(oi.quantity) AS avg_quantity_per_order,
    (p.price - p.cost_price) AS profit_per_unit,
    ((sum(oi.quantity))::numeric * (p.price - p.cost_price)) AS total_profit
   FROM ((public.m_products p
     JOIN public.t_order_items oi ON ((p.product_id = oi.product_id)))
     JOIN public.t_orders o ON ((oi.order_id = o.order_id)))
  WHERE (((o.status)::text <> 'cancelled'::text) AND (p.available = true))
  GROUP BY p.product_id, p.product_name, p.price, p.cost_price
  ORDER BY (sum(oi.quantity)) DESC;


ALTER VIEW public.v_top_selling_products OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 175872)
-- Name: visitors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visitors (
    id integer NOT NULL,
    ip_address character varying(50) NOT NULL,
    country character varying(50),
    region character varying(50),
    city character varying(50),
    page_visited character varying(255),
    visit_time timestamp without time zone DEFAULT now() NOT NULL,
    user_agent text,
    latitude numeric(9,6),
    longitude numeric(9,6),
    latitude_gps double precision,
    longitude_gps double precision,
    location_details_gps jsonb
);


ALTER TABLE public.visitors OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 175878)
-- Name: visitors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.visitors_id_seq OWNER TO postgres;

--
-- TOC entry 5025 (class 0 OID 0)
-- Dependencies: 235
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- TOC entry 4771 (class 2604 OID 175879)
-- Name: configurations config_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurations ALTER COLUMN config_id SET DEFAULT nextval('public.configurations_config_id_seq'::regclass);


--
-- TOC entry 4774 (class 2604 OID 175880)
-- Name: m_costs cost_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_costs ALTER COLUMN cost_id SET DEFAULT nextval('public.m_costs_cost_id_seq'::regclass);


--
-- TOC entry 4778 (class 2604 OID 175881)
-- Name: m_ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.m_ingredients_ingredient_id_seq'::regclass);


--
-- TOC entry 4782 (class 2604 OID 175882)
-- Name: m_products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- TOC entry 4787 (class 2604 OID 175883)
-- Name: m_tools tool_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_tools ALTER COLUMN tool_id SET DEFAULT nextval('public.m_tools_tool_id_seq'::regclass);


--
-- TOC entry 4791 (class 2604 OID 175884)
-- Name: t_order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- TOC entry 4794 (class 2604 OID 175885)
-- Name: t_orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4797 (class 2604 OID 175886)
-- Name: t_utils_product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product ALTER COLUMN id SET DEFAULT nextval('public.t_utils_product_id_seq'::regclass);


--
-- TOC entry 4798 (class 2604 OID 175887)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4801 (class 2604 OID 175888)
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- TOC entry 4991 (class 0 OID 175798)
-- Dependencies: 215
-- Data for Name: configurations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configurations (config_id, url_backend, port, created_at, updated_at, url_frontend) FROM stdin;
1	https://a3c8-149-113-206-114.ngrok-free.app	5000	2024-12-02 10:09:15	2024-12-03 08:30:39	https://order-kue-brownies.vercel.app
\.


--
-- TOC entry 4993 (class 0 OID 175806)
-- Dependencies: 217
-- Data for Name: m_costs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_costs (cost_id, cost_name, cost_description, amount, cost_date, created_at, updated_at, active) FROM stdin;
5	Pengemasan	Biaya untuk pengemasan brownies	100000.00	2024-10-05	2024-10-29 16:33:56	2024-10-29 16:33:56	t
3	transportasi	biaya perhari	50000.00	2024-11-15	2024-10-29 16:33:56	2024-11-15 02:38:37	t
6	j	h	7.00	2024-11-14	2024-11-15 04:29:29	2024-11-15 04:38:28	f
1	Listrik	Biaya penggunaan listrik per bulan	150000.00	2024-10-01	2024-10-29 16:33:56	2024-11-16 05:43:01	f
7	orang	oioio	12000.00	2024-11-15	2024-11-15 04:30:30	2024-11-16 05:44:10	t
2	Gas Elpiji	Biaya penggunaan gas untuk oven 3kg	16500.00	2024-12-02	2024-10-29 16:33:56	2024-12-03 15:31:12	t
4	Bahan Somay	sogut	25400.00	2024-11-21	2024-10-29 16:33:56	2024-12-04 18:12:22	f
\.


--
-- TOC entry 4995 (class 0 OID 175815)
-- Dependencies: 219
-- Data for Name: m_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_ingredients (ingredient_id, ingredient_name, quantity, unit, price_per_unit, created_at, updated_at, available) FROM stdin;
7	Kacang Almond	1.00	kg	80000.00	2024-10-29 16:34:57	2024-11-16 08:45:31	t
5	Mentega	2.00	kg	40000.00	2024-10-29 16:34:57	2024-11-16 08:45:31	t
1	Tepung Terigu	10.00	kg	12000.00	2024-10-28 16:34:57	2024-11-16 08:45:31	t
6	Keju Parut	1.00	kg	45000.00	2024-10-29 16:34:57	2024-11-16 20:16:40	f
4	Telur Ayam	30.00	butir	2000.00	2024-10-29 16:34:57	2024-11-16 20:16:40	f
2	Gula Merah	2.00	mg	10000.00	2024-10-29 16:34:57	2024-12-04 18:09:28	t
8	cokelat bubuk	3.00	kg	65000.00	2024-11-17 02:56:41	2024-12-04 18:11:17	t
\.


--
-- TOC entry 4997 (class 0 OID 175822)
-- Dependencies: 221
-- Data for Name: m_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_products (product_id, product_name, description, price, stock, created_at, updated_at, icon, cost_price, available) FROM stdin;
3	Brownies Kacang	Brownies dengan taburan kacang almond di atasnya	35000.00	60	2024-10-24 11:27:21	2025-06-05 02:43:32	1749066212012-kacang.jpg	16000.00	t
2	Brownies Keju	Brownies dengan topping keju yang melimpah.	35000.00	6	2024-10-24 11:27:21	2025-06-05 02:44:19	1749066259751-keju.jpg	17000.00	t
5	Brownies Chocochip	Brownies taburan chocochip	30000.00	6	2024-10-24 11:27:21	2025-06-05 02:46:17	1749066376768-chocochip.jpg	16000.00	t
6	Brownies Mix 1	Chocochip, kacang almond, keju	35000.00	6	2024-10-30 13:29:04	2025-06-05 02:47:43	1749066463643-browniespersegipanjang.jpeg	16000.00	t
72	Brownies Mix 2	perpaduan kacang, keju dan chocochip yang ditabur diatasnya	35000.00	10	2025-01-23 01:48:35	2025-06-05 02:49:05	1749066544665-kacangkejuchoco2.jpg	18000.00	t
8	Brownies Mix 3	Chocochip mix, kacang almond,, dan keju	35000.00	6	2024-10-30 14:24:50	2025-06-05 02:59:22	1749067161944-browniesbox.jpeg	16000.00	t
1	Brownies Original	Brownies klasik dengan rasa cokelat yang kuat.	35000.00	6	2024-10-24 11:27:21	2025-06-05 03:00:08	1749067207975-polos.jpg	16000.00	t
71	Brownies Pandan	list belanjaan custom yang ingin dibeli	35000.00	5	2024-12-04 13:44:27	2025-06-05 03:00:37	1749067237252-1749060842919-browniespandan.jpeg	17500.00	t
4	Brownies Red Velvet	Brownies dengan rasa khas red velvet.	35000.00	6	2024-10-24 11:27:21	2025-06-05 03:05:11	1749067510884-red-velvet.jpg	16000.00	t
11	Kopi Susu Gula Aren	Kopi susu menggunakan gula aren	10000.00	6	2024-11-02 07:33:13	2025-06-05 03:06:10	1749067569978-kopi_susu_gula_aren.jpg	5000.00	t
9	Matchiato	Minuman matchiato	8000.00	6	2024-11-02 07:30:09	2025-06-05 03:07:41	1749067661307-machiato.jpg	4500.00	t
10	Cheese Tea Jeruk Nipis	Cheese tea rasa jeruk nipis	10000.00	6	2024-11-02 07:32:21	2025-06-05 03:09:14	1749067754195-cheese_tea_jeruk_nipis.jpg	5000.00	t
\.


--
-- TOC entry 4998 (class 0 OID 175831)
-- Dependencies: 222
-- Data for Name: m_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_tools (tool_id, tool_name, tool_description, purchase_date, price, quantity, created_at, updated_at, available) FROM stdin;
2	Oven	Oven untuk memanggang adonan brownies	2023-12-15	3000000.00	1	2024-10-29 16:35:22	2024-10-29 16:35:22	t
4	Timbangan Digital	Timbangan untuk mengukur bahan secara akurat	2024-01-25	150000.00	2	2024-10-29 16:35:22	2024-10-29 16:35:22	t
3	Mixer	Mixer untuk mengaduk adonan brownies	2024-01-20	500000.00	1	2024-10-29 16:35:22	2024-11-17 02:52:14	f
6	Sendok Takar	Sendok untuk mengukur bahan dalam takaran kecil	2024-03-01	10000.00	5	2024-10-29 16:35:22	2024-11-17 02:52:35	f
5	Spatula	Spatula untuk mengaduk dan meratakan adonan	2024-02-05	15000.00	3	2024-10-29 16:35:22	2024-11-17 02:53:00	t
8	well	\N	\N	\N	8	2024-11-17 02:54:06	2024-11-17 02:54:06	t
7	Mangkuk Adonan	Mangkuk besar untuk mencampur adonan	2024-02-07	20000.00	3	2024-10-29 16:35:22	2024-11-17 02:55:04	f
1	Loyang Brownies	Loyang khusus untuk memanggang brownies	2024-01-10	25000.00	5	2024-10-29 16:35:22	2024-12-04 18:11:54	t
\.


--
-- TOC entry 5000 (class 0 OID 175840)
-- Dependencies: 224
-- Data for Name: t_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_order_items (order_item_id, order_id, product_id, quantity, price, created_at, updated_at) FROM stdin;
9	60	1	1	35000.00	2024-12-12 18:08:53	2024-12-12 18:08:53
10	60	2	3	105000.00	2024-12-12 18:08:53	2024-12-12 18:08:53
11	60	3	1	35000.00	2024-12-12 18:08:53	2024-12-12 18:08:53
12	60	8	2	70000.00	2024-12-12 18:08:53	2024-12-12 18:08:53
13	60	10	3	30000.00	2024-12-12 18:08:53	2024-12-12 18:08:53
14	61	2	1	35000.00	2024-12-12 18:11:52	2024-12-12 18:11:52
15	61	3	2	70000.00	2024-12-12 18:11:52	2024-12-12 18:11:52
16	64	3	3	105000.00	2024-12-13 19:04:51	2024-12-13 19:04:51
17	64	71	1	1.00	2024-12-13 19:04:51	2024-12-13 19:04:51
18	65	2	1	35000.00	2024-12-13 19:11:21	2024-12-13 19:11:21
19	65	3	4	140000.00	2024-12-13 19:11:21	2024-12-13 19:11:21
20	65	71	4	4.00	2024-12-13 19:11:21	2024-12-13 19:11:21
21	66	2	1	35000.00	2024-12-13 19:33:14	2024-12-13 19:33:14
22	67	2	1	35000.00	2024-12-13 20:24:09	2024-12-13 20:24:09
23	68	6	1	35000.00	2024-12-13 20:25:23	2024-12-13 20:25:23
24	69	2	1	35000.00	2024-12-13 20:28:11	2024-12-13 20:28:11
25	70	2	2	70000.00	2024-12-13 20:32:46	2024-12-13 20:32:46
26	71	2	3	105000.00	2024-12-13 20:42:29	2024-12-13 20:42:29
27	72	2	1	35000.00	2024-12-13 20:43:01	2024-12-13 20:43:01
28	73	2	2	70000.00	2024-12-13 20:58:50	2024-12-13 20:58:50
29	74	2	4	140000.00	2024-12-13 21:23:19	2024-12-13 21:23:19
30	74	3	1	35000.00	2024-12-13 21:23:19	2024-12-13 21:23:19
31	75	2	4	140000.00	2024-12-13 21:39:19	2024-12-13 21:39:19
32	76	2	2	70000.00	2024-12-13 21:49:37	2024-12-13 21:49:37
33	77	3	1	35000.00	2024-12-13 22:53:51	2024-12-13 22:53:51
34	78	71	1	1.00	2024-12-13 23:03:57	2024-12-13 23:03:57
35	79	2	3	105000.00	2024-12-13 23:21:28	2024-12-13 23:21:28
36	80	2	1	35000.00	2024-12-14 00:01:58	2024-12-14 00:01:58
37	81	2	2	70000.00	2024-12-14 02:03:32	2024-12-14 02:03:32
38	82	3	2	70000.00	2024-12-14 02:04:55	2024-12-14 02:04:55
39	83	3	1	35000.00	2024-12-14 02:08:11	2024-12-14 02:08:11
40	84	2	3	105000.00	2024-12-14 02:10:22	2024-12-14 02:10:22
41	85	1	39	1365000.00	2024-12-14 02:18:06	2024-12-14 02:18:06
42	85	2	2	70000.00	2024-12-14 02:18:06	2024-12-14 02:18:06
43	85	3	5	175000.00	2024-12-14 02:18:06	2024-12-14 02:18:06
44	86	2	4	140000.00	2024-12-14 02:21:51	2024-12-14 02:21:51
45	87	1	3	105000.00	2024-12-14 02:22:54	2024-12-14 02:22:54
46	87	6	2	70000.00	2024-12-14 02:22:54	2024-12-14 02:22:54
47	88	2	2	70000.00	2024-12-14 02:26:42	2024-12-14 02:26:42
48	89	1	3	105000.00	2024-12-14 04:45:36	2024-12-14 04:45:36
49	89	2	4	140000.00	2024-12-14 04:45:36	2024-12-14 04:45:36
50	90	2	1	35000.00	2024-12-14 04:46:28	2024-12-14 04:46:28
51	91	1	2	70000.00	2024-12-14 06:00:23	2024-12-14 06:00:23
52	92	2	1	35000.00	2024-12-14 15:49:45	2024-12-14 15:49:45
53	93	2	2	70000.00	2024-12-14 16:22:58	2024-12-14 16:22:58
54	94	3	2	70000.00	2024-12-14 18:12:49	2024-12-14 18:12:49
55	95	2	1	35000.00	2024-12-14 18:36:56	2024-12-14 18:36:56
56	95	71	1	1.00	2024-12-14 18:36:56	2024-12-14 18:36:56
57	96	2	4	140000.00	2024-12-14 18:38:31	2024-12-14 18:38:31
58	97	3	1	35000.00	2024-12-14 21:35:45	2024-12-14 21:35:45
59	98	2	2	70000.00	2024-12-14 21:47:11	2024-12-14 21:47:11
60	101	2	3	105000.00	2024-12-15 05:09:16	2024-12-15 05:09:16
61	101	3	1	35000.00	2024-12-15 05:09:16	2024-12-15 05:09:16
62	102	1	4	140000.00	2024-12-15 05:10:10	2024-12-15 05:10:10
63	102	4	3	105000.00	2024-12-15 05:10:10	2024-12-15 05:10:10
64	102	11	3	30000.00	2024-12-15 05:10:10	2024-12-15 05:10:10
65	103	3	2	70000.00	2024-12-15 19:31:41	2024-12-15 19:31:41
66	104	2	2	70000.00	2024-12-15 19:44:22	2024-12-15 19:44:22
67	105	2	2	70000.00	2024-12-15 19:45:02	2024-12-15 19:45:02
68	106	2	1	35000.00	2024-12-15 23:52:11	2024-12-15 23:52:11
69	107	2	2	70000.00	2024-12-16 00:00:45	2024-12-16 00:00:45
70	108	1	4	140000.00	2024-12-16 00:04:17	2024-12-16 00:04:17
71	108	3	1	35000.00	2024-12-16 00:04:17	2024-12-16 00:04:17
72	109	2	3	105000.00	2024-12-16 00:09:03	2024-12-16 00:09:03
73	109	10	1	10000.00	2024-12-16 00:09:03	2024-12-16 00:09:03
74	110	3	1	35000.00	2024-12-16 00:09:30	2024-12-16 00:09:30
75	111	2	2	70000.00	2024-12-16 00:10:26	2024-12-16 00:10:26
76	112	3	2	70000.00	2024-12-16 01:11:05	2024-12-16 01:11:05
77	112	11	2	20000.00	2024-12-16 01:11:05	2024-12-16 01:11:05
78	113	1	3	105000.00	2024-12-16 01:42:56	2024-12-16 01:42:56
79	113	2	3	105000.00	2024-12-16 01:42:56	2024-12-16 01:42:56
80	114	2	3	105000.00	2024-12-16 01:49:22	2024-12-16 01:49:22
81	115	11	2	20000.00	2024-12-16 01:58:05	2024-12-16 01:58:05
82	116	2	2	70000.00	2024-12-16 02:00:55	2024-12-16 02:00:55
83	117	2	3	105000.00	2024-12-16 02:05:15	2024-12-16 02:05:15
84	118	3	2	70000.00	2024-12-16 02:05:43	2024-12-16 02:05:43
85	119	2	2	70000.00	2024-12-17 12:52:22	2024-12-17 12:52:22
86	119	3	1	35000.00	2024-12-17 12:52:22	2024-12-17 12:52:22
87	120	8	1	35000.00	2024-12-17 12:52:57	2024-12-17 12:52:57
88	121	1	1	35000.00	2024-12-17 12:53:20	2024-12-17 12:53:20
89	121	9	1	8000.00	2024-12-17 12:53:20	2024-12-17 12:53:20
90	122	5	1	35000.00	2024-12-17 12:53:53	2024-12-17 12:53:53
91	122	8	1	35000.00	2024-12-17 12:53:53	2024-12-17 12:53:53
92	123	11	1	10000.00	2024-12-17 12:54:20	2024-12-17 12:54:20
93	124	10	4	40000.00	2024-12-17 12:54:48	2024-12-17 12:54:48
94	124	11	1	10000.00	2024-12-17 12:54:48	2024-12-17 12:54:48
95	125	71	1	1.00	2024-12-20 07:57:28	2024-12-20 07:57:28
96	126	3	3	105000.00	2025-01-03 17:39:23	2025-01-03 17:39:23
97	127	2	1	35000.00	2025-01-14 17:54:28	2025-01-14 17:54:28
98	127	3	1	35000.00	2025-01-14 17:54:28	2025-01-14 17:54:28
99	128	4	1	35000.00	2025-01-14 17:55:19	2025-01-14 17:55:19
100	128	8	1	35000.00	2025-01-14 17:55:19	2025-01-14 17:55:19
101	128	11	1	10000.00	2025-01-14 17:55:19	2025-01-14 17:55:19
102	129	9	3	24000.00	2025-01-14 17:55:50	2025-01-14 17:55:50
103	130	6	1	35000.00	2025-01-14 17:56:12	2025-01-14 17:56:12
104	131	3	1	35000.00	2025-01-14 17:58:51	2025-01-14 17:58:51
105	132	71	2	2.00	2025-01-14 17:59:15	2025-01-14 17:59:15
106	133	2	2	70000.00	2025-01-15 20:07:16	2025-01-15 20:07:16
107	134	3	1	35000.00	2025-01-15 21:09:41	2025-01-15 21:09:41
108	135	1	3	105000.00	2025-01-22 01:31:48	2025-01-22 01:31:48
109	135	2	1	35000.00	2025-01-22 01:31:48	2025-01-22 01:31:48
110	136	2	2	70000.00	2025-01-23 23:05:07	2025-01-23 23:05:07
111	137	2	3	105000.00	2025-01-24 11:08:56	2025-01-24 11:08:56
112	137	3	10	350000.00	2025-01-24 11:08:56	2025-01-24 11:08:56
113	138	1	3	105000.00	2025-06-04 07:07:13	2025-06-04 07:07:13
114	138	2	1	35000.00	2025-06-04 07:07:13	2025-06-04 07:07:13
115	139	2	1	35000.00	2025-06-04 07:34:19	2025-06-04 07:34:19
116	140	2	2	70000.00	2025-06-04 08:15:11	2025-06-04 08:15:11
117	141	3	1	35000.00	2025-06-04 08:31:42	2025-06-04 08:31:42
118	142	2	2	70000.00	2025-06-04 08:41:21	2025-06-04 08:41:21
119	143	2	1	35000.00	2025-06-04 09:02:43	2025-06-04 09:02:43
120	144	9	1	8000.00	2025-06-04 09:42:28	2025-06-04 09:42:28
121	145	9	1	8000.00	2025-06-04 09:58:46	2025-06-04 09:58:46
122	146	1	4	140000.00	2025-06-05 03:12:59	2025-06-05 03:12:59
123	147	2	3	105000.00	2025-06-05 05:51:00	2025-06-05 05:51:00
124	147	3	2	70000.00	2025-06-05 05:51:00	2025-06-05 05:51:00
125	148	1	1	35000.00	2025-06-05 05:55:38	2025-06-05 05:55:38
126	148	2	5	175000.00	2025-06-05 05:55:38	2025-06-05 05:55:38
127	148	10	1	10000.00	2025-06-05 05:55:38	2025-06-05 05:55:38
128	148	71	1	35000.00	2025-06-05 05:55:38	2025-06-05 05:55:38
129	149	10	2	20000.00	2025-06-05 05:55:53	2025-06-05 05:55:53
\.


--
-- TOC entry 5002 (class 0 OID 175846)
-- Dependencies: 226
-- Data for Name: t_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_orders (order_id, order_code, customer_name, created_at, updated_at, status) FROM stdin;
95	ORDER-1734176216063-3778	testing	2024-12-14 18:36:56	2024-12-14 21:19:50	Selesai
97	ORDER-1734186944231-3464	widyanti	2024-12-14 21:35:44	2024-12-14 21:36:49	Selesai
101	ORDER-1734214153952-1861	gina	2024-12-15 05:09:15	2024-12-15 05:09:15	Menunggu
103	ORDER-1734265899446-7701	farhan	2024-12-15 19:31:41	2024-12-15 19:31:41	Menunggu
105	ORDER-1734266701120-6439	vernika	2024-12-15 19:45:02	2024-12-15 19:45:02	Menunggu
111	ORDER-1734282624253-5508	miya	2024-12-16 00:10:26	2024-12-16 00:40:07	Selesai
107	ORDER-1734282044141-8006	fuji	2024-12-16 00:00:44	2024-12-16 00:42:55	Selesai
109	ORDER-1734282541610-7259	jeje	2024-12-16 00:09:03	2024-12-16 00:43:00	Selesai
113	ORDER-1734288174234-2354	Jarjit sink	2024-12-16 01:42:55	2024-12-16 01:48:32	Selesai
115	ORDER-1734289083753-2068	bor	2024-12-16 01:58:05	2024-12-16 02:03:02	Selesai
117	ORDER-1734289514163-7207	beni	2024-12-16 02:05:14	2024-12-16 02:07:51	Selesai
123	ORDER-1734414859470-2069	wirawan gunaw	2024-12-17 12:54:19	2024-12-17 12:54:19	Menunggu
119	ORDER-1734414741920-8882	feri s	2024-12-17 12:52:22	2024-12-17 12:57:33	Selesai
121	ORDER-1734414800457-6843	Kirana putri	2024-12-17 12:53:20	2024-12-17 12:57:42	Selesai
125	ORDER-1734656248369-4972	Boran	2024-12-20 07:57:28	2024-12-20 07:57:28	Menunggu
129	ORDER-1736852150383-7553	Ramadhani	2025-01-14 17:55:50	2025-01-14 17:57:27	Sedang Diproses
127	ORDER-1736852067899-1408	Faridz	2025-01-14 17:54:28	2025-01-14 17:57:28	Selesai
131	ORDER-1736852330660-5898	Fita	2025-01-14 17:58:51	2025-01-14 17:58:51	Menunggu
133	ORDER-1736946435572-2637	Farida	2025-01-15 20:07:16	2025-01-15 21:01:51	Selesai
135	ORDER-1737484307617-2896	Ridwan	2025-01-22 01:31:48	2025-01-22 01:31:48	Menunggu
137	ORDER-1737691735353-8846	rizal	2025-01-24 11:08:56	2025-01-24 11:12:43	Selesai
1	ORD-2024-0001	Budi Santoso	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai
2	ORD-2024-0002	Siti Nurhaliza	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai
3	ORD-2024-0003	Andi Pratama	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai
4	ORD-2024-0004	Dewi Anggraini	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai
5	ORD-2024-0005	Rizky Maulana	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai
6	ORDER-1733807897139-7869	ridwan	2024-12-10 12:18:17	2024-12-14 11:28:18	Selesai
7	ORDER-1733807992828-4393	ridwan	2024-12-10 12:19:53	2024-12-14 11:28:18	Selesai
8	ORDER-1733808081733-9739	ridwan	2024-12-10 12:21:22	2024-12-14 11:28:18	Selesai
9	ORDER-1733812255086-6072	tiara	2024-12-10 13:30:55	2024-12-14 11:28:18	Selesai
10	ORDER-1733812456788-5035	andri	2024-12-10 13:34:17	2024-12-14 11:28:18	Selesai
11	ORDER-1733814576085-4203	andini putri	2024-12-10 14:09:36	2024-12-14 11:28:18	Selesai
12	ORDER-1733814641605-5235	putra siregar	2024-12-10 14:10:42	2024-12-14 11:28:18	Selesai
13	ORDER-1733815100435-1829	ferdiansyah	2024-12-10 14:18:20	2024-12-14 11:28:18	Selesai
14	ORDER-1733815892426-6631	aji	2024-12-10 14:31:32	2024-12-14 11:28:18	Selesai
15	ORDER-1733816200470-4453	Dimas andri	2024-12-10 14:36:40	2024-12-14 11:28:18	Selesai
16	ORDER-1733816236893-1348	Fauziah	2024-12-10 14:37:17	2024-12-14 11:28:18	Selesai
17	ORDER-1733818864574-7846	Wagon miasyah	2024-12-10 15:21:05	2024-12-14 11:28:18	Selesai
18	ORDER-1733819130580-9131	Wandi	2024-12-10 15:25:31	2024-12-14 11:28:18	Selesai
19	ORDER-1733819706071-8222	Maysyaroh Ampuni	2024-12-10 15:35:06	2024-12-14 11:28:18	Selesai
20	ORDER-1733820602859-7329	admin	2024-12-10 15:50:03	2024-12-14 11:28:18	Selesai
21	ORDER-1733820762835-2061	sayiun	2024-12-10 15:52:43	2024-12-14 11:28:18	Selesai
22	ORDER-1733821003073-8531	Sawarah	2024-12-10 15:56:43	2024-12-14 11:28:18	Selesai
23	ORDER-1733824190205-2577	Andini	2024-12-10 16:49:50	2024-12-14 11:28:18	Selesai
24	ORDER-1733825642385-6085	Farel	2024-12-10 17:14:02	2024-12-14 11:28:18	Selesai
25	ORDER-1733826481832-9237	Windi	2024-12-10 17:28:02	2024-12-14 11:28:18	Selesai
26	ORDER-1733826625579-8806	Ghefari	2024-12-10 17:30:26	2024-12-14 11:28:18	Selesai
27	ORDER-1733826676450-4389	Ferry	2024-12-10 17:31:16	2024-12-14 11:28:18	Selesai
28	ORDER-1733827516904-9771	testing	2024-12-10 17:45:17	2024-12-14 11:28:18	Selesai
29	ORDER-1733828059939-7899	Aji marumis	2024-12-10 17:54:20	2024-12-14 11:28:18	Selesai
30	ORDER-1733828660292-6912	Ghifari	2024-12-10 18:04:20	2024-12-14 11:28:18	Selesai
31	ORDER-1733829196873-9620	sinta	2024-12-10 18:13:17	2024-12-14 11:28:18	Selesai
32	ORDER-1733829628128-2269	wedus gembel	2024-12-10 18:20:28	2024-12-14 11:28:18	Selesai
33	ORDER-1733829868071-5287	Frans	2024-12-10 18:24:28	2024-12-14 11:28:18	Selesai
34	ORDER-1733830281231-8417	tester	2024-12-10 18:31:21	2024-12-14 11:28:18	Selesai
35	ORDER-1733830425640-7949	cika	2024-12-10 18:33:46	2024-12-14 11:28:18	Selesai
36	ORDER-1733831450186-4210	ajinamoto	2024-12-10 18:50:50	2024-12-14 11:28:18	Selesai
37	ORDER-1733833467091-1467	Masturi	2024-12-10 19:24:27	2024-12-14 11:28:18	Selesai
38	ORDER-1733833701140-2762	Rahmah	2024-12-10 19:28:21	2024-12-14 11:28:18	Selesai
39	ORDER-1733833748012-5387	Rendy Shaputra	2024-12-10 19:29:08	2024-12-14 11:28:18	Selesai
40	ORDER-1733833785751-5615	Felix	2024-12-10 19:29:46	2024-12-14 11:28:18	Selesai
41	ORDER-1733833910007-4617	gege	2024-12-10 19:31:50	2024-12-14 11:28:18	Selesai
42	ORDER-1733834005809-9466	Ridwan Taufik	2024-12-10 19:33:26	2024-12-14 11:28:18	Selesai
43	ORDER-1733843539584-2149	Firdaus	2024-12-10 22:12:20	2024-12-14 11:28:18	Selesai
44	ORDER-1733843881647-7648	fenny	2024-12-10 22:18:02	2024-12-14 11:28:18	Selesai
45	ORDER-1733851330408-2857	Hajjah Tuti	2024-12-11 00:22:10	2024-12-14 11:28:18	Selesai
46	ORDER-1733854479870-3288	Mayang	2024-12-11 01:14:40	2024-12-14 11:28:18	Selesai
47	ORDER-1733855422165-3091	keyla	2024-12-11 01:30:22	2024-12-14 11:28:18	Selesai
48	ORDER-1733895895703-4524	Mustika	2024-12-11 12:44:56	2024-12-14 11:28:18	Selesai
49	ORDER-1733895937007-9505	Ghezy	2024-12-11 12:45:37	2024-12-14 11:28:18	Selesai
50	ORDER-1733910071811-2038	gifari	2024-12-11 16:41:12	2024-12-14 11:28:18	Selesai
51	ORDER-1733910473078-9174	Hani	2024-12-11 16:47:53	2024-12-14 11:28:18	Selesai
52	ORDER-1733911017048-7164	jaka purnomo	2024-12-11 16:56:57	2024-12-14 11:28:18	Selesai
53	ORDER-1733915881698-9512	ridwan	2024-12-11 18:18:02	2024-12-14 11:28:18	Selesai
54	ORDER-1733924441579-1087	karin	2024-12-11 20:40:42	2024-12-14 11:28:18	Selesai
55	ORDER-1733927341894-1969	Asep suracep fandami	2024-12-11 21:29:02	2024-12-14 11:28:18	Selesai
56	ORDER-1733927420485-4695	Fery	2024-12-11 21:30:20	2024-12-14 11:28:18	Selesai
57	ORDER-1733927440016-5565	Jeje	2024-12-11 21:30:40	2024-12-14 11:28:18	Selesai
58	ORDER-1733927463511-7132	Hani	2024-12-11 21:31:04	2024-12-14 11:28:18	Selesai
59	ORDER-1734000711694-3029	asep	2024-12-12 17:51:53	2024-12-14 11:28:18	Selesai
60	ORDER-1734001731959-9646	Nida	2024-12-12 18:08:53	2024-12-14 11:28:18	Selesai
61	ORDER-1734001911104-9811	Fitri	2024-12-12 18:11:52	2024-12-14 11:28:18	Selesai
62	ORDER-1734018844810-2798	rukan	2024-12-12 22:54:05	2024-12-14 11:28:18	Selesai
63	ORDER-1734079726873-1749	ridwan	2024-12-13 15:48:47	2024-12-14 11:28:18	Selesai
64	ORDER-1734091489575-7658	farah queen	2024-12-13 19:04:51	2024-12-14 11:28:18	Selesai
65	ORDER-1734091880102-5565	miya	2024-12-13 19:11:21	2024-12-14 11:28:18	Selesai
66	ORDER-1734093192960-2471	Freya	2024-12-13 19:33:14	2024-12-14 11:28:18	Selesai
67	ORDER-1734096248961-5349	rusli ansari	2024-12-13 20:24:09	2024-12-14 11:28:18	Selesai
68	ORDER-1734096323144-2265	rusli ansari	2024-12-13 20:25:23	2024-12-14 11:28:18	Selesai
69	ORDER-1734096491279-8587	rusli ansari t	2024-12-13 20:28:11	2024-12-14 11:28:18	Selesai
70	ORDER-1734096766334-7599	fery her	2024-12-13 20:32:46	2024-12-14 11:28:18	Selesai
71	ORDER-1734097347997-2571	testing	2024-12-13 20:42:29	2024-12-14 11:28:18	Selesai
72	ORDER-1734097381135-3083	fardin	2024-12-13 20:43:01	2024-12-14 11:28:18	Selesai
73	ORDER-1734098329976-4208	andini	2024-12-13 20:58:50	2024-12-14 11:28:18	Selesai
74	ORDER-1734099797789-4731	welrom	2024-12-13 21:23:19	2024-12-14 11:28:18	Selesai
75	ORDER-1734100758951-4484	westi	2024-12-13 21:39:19	2024-12-14 11:28:18	Selesai
76	ORDER-1734101377376-6875	rudi	2024-12-13 21:49:37	2024-12-14 11:28:18	Selesai
77	ORDER-1734105230780-5145	wenwen	2024-12-13 22:53:51	2024-12-14 11:28:18	Selesai
78	ORDER-1734105837007-2711	Unregister	2024-12-13 23:03:57	2024-12-14 11:28:18	Selesai
79	ORDER-1734106887980-1495	heni	2024-12-13 23:21:28	2024-12-14 11:28:18	Selesai
80	ORDER-1734109317923-9649	Nugraha	2024-12-14 00:01:58	2024-12-14 11:28:18	Selesai
81	ORDER-1734116611653-1939	Nia	2024-12-14 02:03:32	2024-12-14 11:28:18	Selesai
82	ORDER-1734116695112-7771	himandari	2024-12-14 02:04:55	2024-12-14 11:28:18	Selesai
83	ORDER-1734116891128-3384	Jihan	2024-12-14 02:08:11	2024-12-14 11:28:18	Selesai
84	ORDER-1734117022110-2588	Cepi	2024-12-14 02:10:22	2024-12-14 11:28:18	Selesai
85	ORDER-1734117485802-1871	Minahasa	2024-12-14 02:18:06	2024-12-14 11:28:18	Selesai
86	ORDER-1734117710891-2486	kak sena	2024-12-14 02:21:51	2024-12-14 11:28:18	Selesai
87	ORDER-1734117773515-1316	genji	2024-12-14 02:22:54	2024-12-14 11:28:18	Selesai
88	ORDER-1734118001052-2580	anji	2024-12-14 02:26:42	2024-12-14 11:28:18	Selesai
89	ORDER-1734126336082-5308	Dini N	2024-12-14 04:45:36	2024-12-14 11:28:18	Selesai
90	ORDER-1734126387736-7619	windi	2024-12-14 04:46:28	2024-12-14 11:28:18	Selesai
91	ORDER-1734130822834-6795	tes	2024-12-14 06:00:23	2024-12-14 11:28:18	Selesai
92	ORDER-1734166184830-9930	ghadi	2024-12-14 15:49:45	2024-12-14 11:28:18	Selesai
93	ORDER-1734168177636-3788	hana	2024-12-14 16:22:58	2024-12-14 11:28:18	Selesai
94	ORDER-1734174767492-4341	hakam	2024-12-14 18:12:49	2024-12-14 11:28:18	Selesai
96	ORDER-1734176310264-1772	Jimi	2024-12-14 18:38:30	2024-12-14 21:37:30	Selesai
98	ORDER-1734187629711-8742	mujahidin	2024-12-14 21:47:11	2024-12-14 21:47:11	Menunggu
102	ORDER-1734214208423-5466	Zaky	2024-12-15 05:10:10	2024-12-15 05:10:10	Menunggu
104	ORDER-1734266661721-5335	jeni	2024-12-15 19:44:22	2024-12-15 19:44:22	Menunggu
106	ORDER-1734281529617-8999	wardian	2024-12-15 23:52:11	2024-12-15 23:52:11	Menunggu
110	ORDER-1734282569821-1126	denis	2024-12-16 00:09:30	2024-12-16 00:41:18	Selesai
112	ORDER-1734286264109-1317	karin	2024-12-16 01:11:05	2024-12-16 01:31:03	Selesai
108	ORDER-1734282256467-7863	Sirna	2024-12-16 00:04:17	2024-12-16 01:31:13	Selesai
114	ORDER-1734288560305-6368	Clouwd	2024-12-16 01:49:21	2024-12-16 01:53:11	Selesai
116	ORDER-1734289253714-5488	lala	2024-12-16 02:00:55	2024-12-16 02:02:55	Selesai
118	ORDER-1734289541601-9171	suci	2024-12-16 02:05:43	2024-12-16 02:08:04	Selesai
124	ORDER-1734414887919-5085	Lala	2024-12-17 12:54:48	2024-12-17 12:54:48	Menunggu
120	ORDER-1734414777047-7571	Jeni frenklyn	2024-12-17 12:52:57	2024-12-17 12:57:40	Selesai
126	ORDER-1735900762689-2465	testo	2025-01-03 17:39:23	2025-01-03 17:41:09	Selesai
130	ORDER-1736852172335-8366	Aisyah S	2025-01-14 17:56:12	2025-01-14 17:56:12	Menunggu
128	ORDER-1736852118836-8835	Mira Asyiara	2025-01-14 17:55:19	2025-01-14 17:57:37	Selesai
132	ORDER-1736852355178-4180	Adit siregar	2025-01-14 17:59:15	2025-01-14 17:59:15	Menunggu
136	ORDER-1737648307322-8646	Ridwan	2025-01-23 23:05:07	2025-01-23 23:25:28	Selesai
147	ORDER-1749077459569-9504	Kardio	2025-06-05 05:51:00	2025-06-05 12:49:42	Diterima
139	ORDER-1748997259177-7714	Andi	2025-06-04 07:34:19	2025-06-04 07:49:05	Diterima
138	ORDER-1748995632986-4486	Andi	2025-06-04 07:07:13	2025-06-04 08:14:43	Diterima
145	ORDER-1749005925431-2564	ridwan	2025-06-04 09:58:46	2025-06-04 09:59:55	Sedang diproses
144	ORDER-1749004947675-2851	Intan	2025-06-04 09:42:28	2025-06-04 10:01:14	Diterima
140	ORDER-1748999711210-8287	Riadi	2025-06-04 08:15:11	2025-06-04 08:31:23	Diterima
142	ORDER-1749001280554-8265	Andi	2025-06-04 08:41:21	2025-06-04 08:41:21	Menunggu
134	ORDER-1736950181153-8249	Andini	2025-01-15 21:09:41	2025-06-04 09:14:38	Sedang diproses
148	ORDER-1749077738181-3099	Yunita	2025-06-05 05:55:38	2025-06-05 07:31:44	Diterima
141	ORDER-1749000701786-3415	Ferra	2025-06-04 08:31:42	2025-06-04 09:29:35	Diterima
143	ORDER-1749002563341-6385	Sintia	2025-06-04 09:02:43	2025-06-04 09:29:41	Diterima
122	ORDER-1734414833237-1046	Gani abdul wahid	2024-12-17 12:53:53	2025-06-04 09:29:49	Diterima
149	ORDER-1749077753317-8437	Nia	2025-06-05 05:55:53	2025-06-05 08:16:00	Diterima
146	ORDER-1749067978892-9411	Dini Putri	2025-06-05 03:12:59	2025-06-05 12:49:38	Diterima
\.


--
-- TOC entry 5005 (class 0 OID 175855)
-- Dependencies: 229
-- Data for Name: t_utils_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_utils_product (id, product_id, favorite) FROM stdin;
2	9	2
4	4	4
8	8	6
5	10	4
9	1	192
1	71	11
6	6	5
3	11	6
11	3	26
7	5	5
10	2	30
\.


--
-- TOC entry 5007 (class 0 OID 175859)
-- Dependencies: 231
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, age, created_at, updated_at, username, password, birth_date, phone_number, address, role) FROM stdin;
3	High Access	35	2024-10-26 17:32:20	2025-06-05 08:51:35	admin	$2b$10$gqzRwvbwGtzoeURULW5up.otvrG/Ih4ekzJwbqHfTsdHh72hGUAQm	2000-02-22	081236384589	\N	Super User
5	Asri	22	2024-10-26 17:32:20	2025-06-05 08:51:50	asri	$2b$10$BOLPLjVaTpzICYscO2oiqervfjChkkDNapdk9rd7LH8CQ8OffiINu	1994-06-22	083539485772	Kiaracondong	Admin
4	Andri	28	2024-10-26 17:32:20	2025-06-05 08:51:55	andri	$2b$10$A97Y.NSvQ6Ocx6BmogqYGumWnaiK8nJFpyYjcgtWKjcyjqd04DAEi	1999-12-08	088345683762	Kampung Gadjah	Admin
1	Ridwan	25	2024-10-26 17:32:20	2025-06-05 08:52:04	ridwan	$2b$10$yQifnpQPexGByg/rpcGWAedLUCZ3V99kElbXfqKoHRFufw5E3UP4i	1985-11-21	08823476283	Buahbatu	Developer
7	Super User	\N	2025-06-05 10:22:57	2025-06-05 10:22:57	superuser	$2b$10$Afy/agVMeS/xoIUik7v3d.SlDJ4CSlK2kU/.O6YVK5fbjLYH7JCpy	2025-06-05	081312025217	Komplek Pondok Gede Jakarta Selatan	Super Admin
6	Tiara	23	2025-06-05 10:03:08	2025-06-06 03:16:47	tiara	$2b$10$H9JnefhS6o4XvUBpfh1RLuWOSWO5LoL7cfhnp0bDnhvVBGJ4o3LtO	2002-03-08			Developer
\.


--
-- TOC entry 5009 (class 0 OID 175872)
-- Dependencies: 234
-- Data for Name: visitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visitors (id, ip_address, country, region, city, page_visited, visit_time, user_agent, latitude, longitude, latitude_gps, longitude_gps, location_details_gps) FROM stdin;
1	::ffff:127.0.0.1	Unknown	Unknown	Unknown	/orderan	2024-12-12 03:12:36.452	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	\N	\N	\N	\N	\N
2	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 03:22:48.078	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	\N	\N	\N	\N	\N
3	143.198.225.44	US	CA	Santa Clara	/orderan	2024-12-12 03:45:17.874	vercel-screenshot/1.0	\N	\N	\N	\N	\N
4	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 03:47:29.019	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	\N	\N	\N	\N	\N
5	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 03:48:20.542	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	\N	\N	\N	\N	\N
6	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 03:48:36.678	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	\N	\N	\N	\N	\N
7	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 04:22:54.117	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
8	164.92.65.141	US	CA	Santa Clara	/orderan	2024-12-12 10:59:14.74	vercel-screenshot/1.0	37.393100	-121.962000	\N	\N	\N
9	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 11:01:08.816	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
10	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 11:05:39.922	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
11	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:51:03.89	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0	-6.921700	107.607100	\N	\N	\N
12	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:52:15.236	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	\N	\N	\N
13	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:54:02.351	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	\N	\N	\N
14	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:55:15.781	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	\N	\N	\N
15	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:58:48.562	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	\N	\N	\N
16	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:59:09.572	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	\N	\N	\N
17	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 12:59:40.873	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
18	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 13:06:06.072	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
19	114.10.138.233	ID	KB	Pontianak	/orderan	2024-12-12 19:54:30.847	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36	-0.031000	109.325700	\N	\N	\N
20	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:51:23.774	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
21	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:52:05.631	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
22	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:54:24.379	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
23	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:54:41.66	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
24	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:55:29.45	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
25	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:55:30.326	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
26	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-12 22:55:56.057	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
27	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-13 15:48:54.84	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
28	149.113.194.10	ID	JB	Bandung	/orderan	2024-12-13 17:46:03.743	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
29	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:16:20.236	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
30	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:24:45.836	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/22A3354 Safari/604.1	-6.921700	107.607100	\N	\N	\N
31	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:25:27.106	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/22A3354 Safari/604.1	-6.921700	107.607100	\N	\N	\N
32	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:26:39.523	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
33	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:26:48.069	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
34	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:27:23.166	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
35	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:28:22.393	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
36	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:28:38.642	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
37	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:28:47.906	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
38	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:30:24.55	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
39	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:30:30.039	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
40	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:31:12.421	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
41	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:31:19.911	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
42	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:31:36.465	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
43	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:32:11.91	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
44	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:32:56.109	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
45	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:33:27.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
46	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:36:11.355	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
47	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:36:58.141	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
48	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:38:59.037	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
49	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:41:49.092	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
50	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:42:34.757	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
51	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:42:44.888	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
52	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:43:08.232	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
53	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:43:19.075	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
54	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:46:23.954	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
55	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:46:45.641	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
56	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:47:07.973	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	\N
57	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:48:49.625	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
58	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:49:02.629	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
59	114.122.115.74	ID	JB	Bandung	/orderan	2024-12-13 20:49:39.052	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
60	114.122.115.74	ID	JB	Bandung	/orderan	2024-12-13 20:54:39.515	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
61	114.122.115.74	ID	JB	Bandung	/orderan	2024-12-13 20:55:01.343	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
62	114.122.115.74	ID	JB	Bandung	/orderan	2024-12-13 20:55:08.386	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	\N	\N	\N
63	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:55:16.765	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
64	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:57:08.668	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
65	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 20:59:04.493	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
66	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:03:05.242	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/22A3354 Safari/604.1	-6.921700	107.607100	\N	\N	\N
67	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:08:08.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
68	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:11:02.99	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
69	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:14:09.706	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
70	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:14:40.78	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
71	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:14:46.376	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
72	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:15:02.168	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
73	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:15:28.266	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
74	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:15:32.447	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
75	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:16:25.931	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
76	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:21:52.944	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
77	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:21:58.542	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
78	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:23:44.935	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
79	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:23:54.896	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
80	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:32:36.526	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
81	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:32:49.45	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
82	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:33:44.09	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
83	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:34:00.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
84	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:34:16.849	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
85	146.190.145.191	US	CA	Santa Clara	/orderan	2024-12-13 21:35:47.166	vercel-screenshot/1.0	37.393100	-121.962000	\N	\N	\N
86	146.190.145.202	US	CA	Santa Clara	/orderan	2024-12-13 21:35:47.661	vercel-screenshot/1.0	37.393100	-121.962000	\N	\N	\N
87	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:37:29.898	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
88	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:38:56.861	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
89	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:39:31.015	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
90	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:39:58.857	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
91	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:40:35.256	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
92	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:41:07.68	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
93	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:42:09.485	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
94	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:42:19.051	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
95	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:42:48.302	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
96	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:43:40.066	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
97	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:45:58.448	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
98	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:46:39.903	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
99	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:49:13.662	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
100	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 21:49:44.294	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
101	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:01:14.563	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
102	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:20:14.198	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
103	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:21:44.854	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
104	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:23:45.876	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
105	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:25:14.925	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
106	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:27:03.653	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
107	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:29:17.029	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
108	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:34:33.831	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
109	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:34:43.926	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
110	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:42:44.525	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
111	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:44:14.603	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
112	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:46:53.141	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
113	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:49:39.222	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
114	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:50:32.308	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
115	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:51:47.838	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
116	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:53:31.635	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
117	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:53:57.638	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
118	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:55:34.657	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
119	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 22:58:39.505	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
120	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:00:23.776	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
121	103.119.67.29	ID	JT	Semarang	/orderan	2024-12-13 23:03:16.942	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.41 Mobile Safari/537.36	-6.993200	110.421500	\N	\N	\N
122	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:05:12.47	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
123	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:09:53.062	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
124	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:21:12.481	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
125	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:21:36.149	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
126	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:25:46.729	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
127	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:37:25.691	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
128	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:40:03.83	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
129	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:40:43.467	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
130	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:40:53.024	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
131	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:41:35.486	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
132	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:42:38.987	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
133	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:48:03.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
134	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:51:02.271	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
135	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:52:20.22	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
136	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:56:45.614	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
137	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-13 23:58:17.463	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
138	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 00:02:04.259	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
139	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 00:27:42.32	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
140	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 00:59:32.448	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
141	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:10:51.673	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
142	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:12:32.501	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
143	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:15:17.51	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
144	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:19:14.336	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
145	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:22:53.706	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
146	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:24:59.774	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
147	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:30:37.449	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
148	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:32:56.478	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
149	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:34:21.301	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
150	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:41:01.705	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
151	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:43:29.871	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
152	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:48:14.407	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
153	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:57:47.016	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
154	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:57:56.705	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
155	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:58:38.518	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
156	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 01:59:47.481	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
157	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:03:03.626	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
158	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:03:42.856	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
159	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:04:08.201	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
160	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:04:20.475	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
161	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:04:27.419	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
162	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:04:34.976	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
163	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:05:01.125	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
164	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:05:31.109	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
165	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:05:39.042	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
166	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:05:44.643	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
167	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:06:07.722	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
168	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:06:14.469	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
169	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:06:22.661	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
170	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:08:18.142	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
171	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:08:57.497	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
172	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:10:02.111	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
173	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:10:30.053	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
174	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:12:26.766	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
175	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:17:02.181	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
176	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:18:21.632	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
177	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:21:28.587	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
178	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:22:07.66	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
179	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:22:58.703	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
180	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:24:27.124	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
181	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:25:26.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
182	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:26:12.79	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
183	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:26:23.022	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
184	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:26:46.583	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
185	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:36:01.96	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
186	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:36:17.165	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
187	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:38:57.289	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
188	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:39:15.963	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
189	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:39:54.296	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
190	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:39:59.51	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
191	146.190.145.202	US	CA	Santa Clara	/orderan	2024-12-14 02:56:20.592	vercel-screenshot/1.0	37.393100	-121.962000	\N	\N	\N
192	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 02:56:48.403	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
193	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 03:36:51.069	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	\N
194	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 03:41:01.606	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756163	107.6682484	{"city": "Tidak Diketahui", "road": "Jalan Alam Asri III", "state": "Jawa Barat", "suburb": "Tidak Diketahui", "country": "Indonesia", "village": "Buahbatu", "district": "Tidak Diketahui", "neighbourhood": "Cluster Morinda"}
195	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:00:07.853	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682505	{"lat": "-6.975545202658507", "lon": "107.66826347314749", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
196	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:02:19.812	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682502	{"lat": "-6.975545147955845", "lon": "107.66826318347782", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
390	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 23:02:59.372	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
391	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 23:05:16.254	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
197	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:10:51.004	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756159	107.6682497	"{\\"place_id\\":26789309,\\"licence\\":\\"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright\\",\\"osm_type\\":\\"way\\",\\"osm_id\\":412663572,\\"lat\\":\\"-6.97554512565356\\",\\"lon\\":\\"107.66826306537943\\",\\"class\\":\\"highway\\",\\"type\\":\\"residential\\",\\"place_rank\\":26,\\"importance\\":0.053370834668497714,\\"addresstype\\":\\"road\\",\\"name\\":\\"Jalan Alam Asri III\\",\\"display_name\\":\\"Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia\\",\\"address\\":{\\"road\\":\\"Jalan Alam Asri III\\",\\"neighbourhood\\":\\"Cluster Morinda\\",\\"village\\":\\"Buahbatu\\",\\"county\\":\\"Bandung\\",\\"state\\":\\"Jawa Barat\\",\\"ISO3166-2-lvl4\\":\\"ID-JB\\",\\"region\\":\\"Jawa\\",\\"ISO3166-2-lvl3\\":\\"ID-JW\\",\\"postcode\\":\\"40287\\",\\"country\\":\\"Indonesia\\",\\"country_code\\":\\"id\\"},\\"boundingbox\\":[\\"-6.9755880\\",\\"-6.9748501\\",\\"107.6680189\\",\\"107.6685668\\"]}"
198	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:15:04.89	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	"{}"
199	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:16:51.083	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	"{}"
299	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:05:56.384	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
307	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 01:43:04.943	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
200	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:17:13.724	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682484	"{\\"place_id\\":26739643,\\"licence\\":\\"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright\\",\\"osm_type\\":\\"way\\",\\"osm_id\\":412663572,\\"lat\\":\\"-6.975544819739873\\",\\"lon\\":\\"107.66826144545975\\",\\"class\\":\\"highway\\",\\"type\\":\\"residential\\",\\"place_rank\\":26,\\"importance\\":0.053370834668497714,\\"addresstype\\":\\"road\\",\\"name\\":\\"Jalan Alam Asri III\\",\\"display_name\\":\\"Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia\\",\\"address\\":{\\"road\\":\\"Jalan Alam Asri III\\",\\"neighbourhood\\":\\"Cluster Morinda\\",\\"village\\":\\"Buahbatu\\",\\"county\\":\\"Bandung\\",\\"state\\":\\"Jawa Barat\\",\\"ISO3166-2-lvl4\\":\\"ID-JB\\",\\"region\\":\\"Jawa\\",\\"ISO3166-2-lvl3\\":\\"ID-JW\\",\\"postcode\\":\\"40287\\",\\"country\\":\\"Indonesia\\",\\"country_code\\":\\"id\\"},\\"boundingbox\\":[\\"-6.9755880\\",\\"-6.9748501\\",\\"107.6680189\\",\\"107.6685668\\"]}"
201	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:20:49.055	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26118912, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
202	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:21:41.187	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975614	107.6682486	{"lat": "-6.975544859651755", "lon": "107.66826165680709", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26739643, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
203	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:22:42.845	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975614	107.6682486	{"lat": "-6.975544859651755", "lon": "107.66826165680709", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
204	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:41:18.005	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
205	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:42:11.72	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682497	{"lat": "-6.975545056784743", "lon": "107.66826270069502", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
392	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 23:11:22.824	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
393	114.10.145.35	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-24 11:07:07.534	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.172800	106.827200	\N	\N	{}
394	114.10.145.35	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-24 11:09:39.79	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.172800	106.827200	\N	\N	{}
395	114.10.148.35	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-24 11:10:08.534	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	-6.172800	106.827200	\N	\N	{}
206	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:42:26.015	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975616	107.6682495	{"lat": "-6.975545092628559", "lon": "107.66826289050054", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
207	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:43:38.958	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756161	107.6682498	{"lat": "-6.9755451507746615", "lon": "107.66826319840443", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
208	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:44:31.676	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
300	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:09:14.28	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
209	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:44:41.788	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.668248	{"lat": "-6.975544746802992", "lon": "107.66826105923352", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
210	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:45:48.441	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975614	107.6682512	{"lat": "-6.9755453337414925", "lon": "107.66826416727763", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
211	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:46:44.651	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
212	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:46:53.507	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975614	107.6682512	{"lat": "-6.9755453337414925", "lon": "107.66826416727763", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
213	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:47:19.672	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
214	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:47:26.255	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
215	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:47:53.517	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
216	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:48:45.131	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
217	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:49:44.498	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
218	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:50:34.044	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
219	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:50:46.299	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
220	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:50:59.913	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
221	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:52:14.088	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.9805926	107.6870959	{"lat": "-6.980599347544475", "lon": "107.68708668678553", "name": "400", "type": "secondary", "class": "highway", "osm_id": 340013843, "address": {"road": "400", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Tegalluar", "postcode": "40295", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26855034, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9848754", "-6.9792572", "107.6868012", "107.7012078"], "display_name": "400, Tegalluar, Bandung, Jawa Barat, Jawa, 40295, Indonesia"}
222	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:53:33.549	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.9805926	107.6870959	{"lat": "-6.980599347544475", "lon": "107.68708668678553", "name": "400", "type": "secondary", "class": "highway", "osm_id": 340013843, "address": {"road": "400", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Tegalluar", "postcode": "40295", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26855034, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9848754", "-6.9792572", "107.6868012", "107.7012078"], "display_name": "400, Tegalluar, Bandung, Jawa Barat, Jawa, 40295, Indonesia"}
301	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:09:47.492	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
308	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 01:49:31.458	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
313	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 03:15:13.817	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
223	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:54:16.487	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
224	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:54:44.583	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
225	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:55:03.895	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
226	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:57:32.929	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
227	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 04:57:57.792	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682505	{"lat": "-6.975545202658507", "lon": "107.66826347314749", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
396	114.10.148.35	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-24 11:11:03.131	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	-6.172800	106.827200	\N	\N	{}
397	74.125.184.190	US	SC	Charleston	/orderan	2025-01-31 08:55:41.477	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	32.777100	-79.930500	\N	\N	{}
228	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 05:46:02.01	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756138	107.6682481	{"lat": "-6.9755447615937705", "lon": "107.66826113755586", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
229	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 05:59:30.334	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
230	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:00:41.513	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
231	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:03:01.284	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
232	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:03:28.074	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
233	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 14:28:18.598	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756142	107.6682487	{"lat": "-6.975544884772859", "lon": "107.6682617898321", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
234	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 14:29:09.862	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756161	107.6682487	{"lat": "-6.975544950198236", "lon": "107.6682621362823", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
235	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 14:36:18.671	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756136	107.6682495	{"lat": "-6.975545009985979", "lon": "107.66826245287925", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
236	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 15:49:22.45	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
237	140.213.39.162	ID	JB	Bandung	/orderan	2024-12-14 15:49:34.954	Mozilla/5.0 (Linux; U; Android 12; in-id; CPH2113 Build/SKQ1.210216.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.88 Mobile Safari/537.36 HeyTapBrowser/45.11.5.3	-6.921700	107.607100	\N	\N	{}
238	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 15:49:52.575	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
239	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 15:57:51.027	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.103 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
240	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 15:58:34.879	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
302	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:10:11.419	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0	-6.921700	107.607100	\N	\N	{}
309	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 01:58:12.058	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
241	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 16:00:01.79	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26169234, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
242	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 16:00:58.385	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26169234, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
243	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 16:01:03.313	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26169234, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
244	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 16:01:13.615	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26169234, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
245	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 16:23:09.924	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756139	107.6682514	{"lat": "-6.975545366766493", "lon": "107.66826434215653", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
246	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:12:15.848	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
247	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:12:55.643	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
248	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:36:45.332	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975612	107.6682483	{"lat": "-6.975544736080276", "lon": "107.66826100245301", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
249	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:37:09.79	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756117	107.6682474	{"lat": "-6.975544561641967", "lon": "107.6682600787413", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
303	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:10:31.551	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0	-6.921700	107.607100	\N	\N	{}
250	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:37:41.86	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.975612	107.6682483	{"lat": "-6.975544736080276", "lon": "107.66826100245301", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
251	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:38:44.39	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756114	107.6682481	{"lat": "-6.97554467895119", "lon": "107.66826069993456", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
252	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:41:02.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756122	107.6682474	{"lat": "-6.9755445788591715", "lon": "107.66826016991241", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
253	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 18:51:42.006	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
254	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 20:06:24.722	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756105	107.6682471	{"lat": "-6.975544465618015", "lon": "107.66825957026099", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
255	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 20:12:37.495	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26118912, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
256	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 21:00:47.331	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756112	107.6682473	{"lat": "-6.975544526190543", "lon": "107.66825989101365", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
257	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 21:21:51.661	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.9756112	107.6682473	{"lat": "-6.975544526190543", "lon": "107.66825989101365", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
304	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:10:44.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0	-6.921700	107.607100	\N	\N	{}
310	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 02:01:04.396	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
258	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 21:35:51.272	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26170250, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
259	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 21:43:21.382	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26170250, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
260	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 21:47:17.625	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26170250, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
261	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 22:01:25.079	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.9756117	107.6682474	{"lat": "-6.975544561641967", "lon": "107.6682600787413", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
262	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 23:46:48.725	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
263	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 23:49:02.121	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
264	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 23:49:28.842	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
265	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 23:49:46.832	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
266	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 03:52:10.173	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756134	107.6682465	{"lat": "-6.975544456072476", "lon": "107.66825951971403", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
267	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 03:53:39.822	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756132	107.6682469	{"lat": "-6.975544522122477", "lon": "107.66825986947183", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
305	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 01:10:43.503	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
311	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 02:05:22.666	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
314	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 16:26:19.777	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
268	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 04:27:49.352	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756154	107.6682458	{"lat": "-6.975544397301748", "lon": "107.66825920850252", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
269	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 04:34:29.15	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.1944491	106.8229198	{"lat": "-6.194464089515583", "lon": "106.82292211529135", "name": "", "type": "primary", "class": "highway", "osm_id": 1075646690, "address": {"city": "Daerah Khusus ibukota Jakarta", "region": "Jawa", "suburb": "Menteng", "country": "Indonesia", "village": "Gondangdia", "postcode": "10350", "city_block": "RW 05", "country_code": "id", "city_district": "Jakarta Pusat", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JK"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26170250, "importance": 0.05341646982528416, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.1945300", "-6.1944519", "106.8228263", "106.8233183"], "display_name": "RW 05, Gondangdia, Menteng, Jakarta Pusat, Daerah Khusus ibukota Jakarta, Jawa, 10350, Indonesia"}
270	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 05:08:47.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756132	107.6682469	{"lat": "-6.975544522122477", "lon": "107.66825986947183", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
271	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 05:09:28.853	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.9756117	107.6682474	{"lat": "-6.975544561641967", "lon": "107.6682600787413", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
272	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 05:10:15.377	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.9756117	107.6682474	{"lat": "-6.975544561641967", "lon": "107.6682600787413", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
273	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 14:54:57.97	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
274	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 14:55:07.806	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
306	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 01:11:18.566	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
312	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 02:05:49.602	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
275	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 14:55:13.682	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
276	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 14:55:30.832	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.134 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
277	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-15 14:56:00.813	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.134 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
278	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:04:56.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756129	107.6682492	{"lat": "-6.975544931179231", "lon": "107.66826203557002", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
279	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:10:54.184	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756138	107.6682471	{"lat": "-6.975544579251564", "lon": "107.66826017199027", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
280	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:28:22.459	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9573236	107.657059	{"lat": "-6.9573999559559505", "lon": "107.65698059602464", "name": "Jalan Marga Cinta", "type": "tertiary", "class": "highway", "osm_id": 271678843, "address": {"city": "Bandung", "road": "Jalan Marga Cinta", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Margasari", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26841285, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9588919", "-6.9557504", "107.6547179", "107.6594529"], "display_name": "Jalan Marga Cinta, Margasari, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
281	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:29:57.932	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682457	{"lat": "-6.975544313642152", "lon": "107.66825876549578", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
282	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:31:18.77	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682457	{"lat": "-6.975544313642152", "lon": "107.66825876549578", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
283	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:31:51.436	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756126	107.6682474	{"lat": "-6.975544592632935", "lon": "107.66826024284929", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
284	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:32:01.524	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756126	107.6682474	{"lat": "-6.975544592632935", "lon": "107.66826024284929", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
285	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:39:33.894	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9573236	107.657059	{"lat": "-6.9573999559559505", "lon": "107.65698059602464", "name": "Jalan Marga Cinta", "type": "tertiary", "class": "highway", "osm_id": 271678843, "address": {"city": "Bandung", "road": "Jalan Marga Cinta", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Margasari", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26841285, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9588919", "-6.9557504", "107.6547179", "107.6594529"], "display_name": "Jalan Marga Cinta, Margasari, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
286	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:44:28.703	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9573236	107.657059	{"lat": "-6.9573999559559505", "lon": "107.65698059602464", "name": "Jalan Marga Cinta", "type": "tertiary", "class": "highway", "osm_id": 271678843, "address": {"city": "Bandung", "road": "Jalan Marga Cinta", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Margasari", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26841285, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9588919", "-6.9557504", "107.6547179", "107.6594529"], "display_name": "Jalan Marga Cinta, Margasari, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
287	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:44:43.72	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756129	107.6682473	{"lat": "-6.975544584729038", "lon": "107.6682602009954", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
288	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:45:11.356	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682463	{"lat": "-6.975544423047477", "lon": "107.66825934483514", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
289	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:45:19.289	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682463	{"lat": "-6.975544423047477", "lon": "107.66825934483514", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
290	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 23:36:03.331	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
291	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 23:51:05.528	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
292	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 23:52:28.033	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
293	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 23:55:44.58	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
294	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 23:59:39.314	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
295	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:00:32.708	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
296	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:03:59.649	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
297	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:04:28.175	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
298	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-16 00:04:41.065	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
315	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:52:30.957	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
316	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:53:02.457	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
317	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:53:27.943	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
318	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:53:59.369	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
319	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:54:24.596	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
320	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:54:52.603	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
321	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:55:34.275	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
322	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:55:47.49	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
323	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:55:50.928	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
324	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:55:58.492	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
325	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:56:28.369	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.921700	107.607100	-6.9613879	107.657059	{"lat": "-6.961266513746067", "lon": "107.65711164841453", "name": "Jalan Cijawura Hilir", "type": "residential", "class": "highway", "osm_id": 185934068, "address": {"city": "Bandung", "road": "Jalan Cijawura Hilir", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Cijaura", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26711605, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9615131", "-6.9596627", "107.6550702", "107.6589155"], "display_name": "Jalan Cijawura Hilir, Cijaura, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
326	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:57:10.874	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
327	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 12:57:18.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
328	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-17 13:00:00.184	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
329	149.113.195.88	ID	JB	Bandung	/orderan	2024-12-18 16:29:33.297	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	\N	\N	{}
330	114.122.110.189	ID	JB	Bandung	/orderan	2024-12-20 07:56:59.532	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	-6.9755563	107.668238	{"lat": "-6.97554093995898", "lon": "107.6682409006665", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
331	114.122.110.189	ID	JB	Bandung	/orderan	2024-12-20 07:57:42.095	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0.0.0 Mobile Safari/537.36	-6.921700	107.607100	-6.97555	107.6682442	{"lat": "-6.975541853543885", "lon": "107.66824573841727", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
332	66.249.68.36	US	Tidak Diketahui	Tidak Diketahui	/orderan	2024-12-27 03:15:02.185	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.139 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	37.751000	-97.822000	\N	\N	{}
333	66.249.68.4	US	Tidak Diketahui	Tidak Diketahui	/orderan	2024-12-27 03:15:15.63	Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/131.0.6778.139 Safari/537.36	37.751000	-97.822000	\N	\N	{}
334	66.249.79.193	US	Tidak Diketahui	Tidak Diketahui	/orderan	2024-12-27 03:15:16.925	Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.139 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)	37.751000	-97.822000	\N	\N	{}
335	140.0.72.142	ID	JI	Sidoarjo	/orderan	2024-12-27 23:30:01.08	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
336	140.0.65.227	ID	JI	Surabaya	/orderan	2025-01-03 17:38:59.027	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
337	140.0.65.227	ID	JI	Surabaya	/orderan	2025-01-03 17:39:34.573	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
338	140.0.65.227	ID	JI	Surabaya	/orderan	2025-01-03 17:40:07.014	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.248400	112.741900	\N	\N	{}
339	140.0.65.227	ID	JI	Surabaya	/orderan	2025-01-03 17:40:37.941	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.248400	112.741900	\N	\N	{}
340	180.251.231.218	ID	JB	Cirebon	/orderan	2025-01-06 06:11:21.747	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	-6.705400	108.549600	\N	\N	{}
341	114.10.146.12	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-08 18:00:44.033	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.172800	106.827200	\N	\N	{}
342	114.10.147.12	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-01-08 18:09:12.301	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.172800	106.827200	\N	\N	{}
343	140.0.64.110	ID	JI	Surabaya	/orderan	2025-01-12 15:44:02.005	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
344	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 15:53:27.534	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
345	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:54:06.332	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
346	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:54:41.495	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
347	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:55:25.635	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
348	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:55:54.893	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
349	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:56:17.08	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
350	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:56:57.222	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.248400	112.741900	\N	\N	{}
351	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:58:55.357	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
352	140.0.65.37	ID	JI	Surabaya	/orderan	2025-01-14 17:59:20.881	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.248400	112.741900	\N	\N	{}
353	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 20:25:37.153	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
354	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 20:39:07.084	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
355	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 20:44:53.47	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
356	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 21:09:24.491	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
357	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 21:09:56.247	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
358	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 21:10:02.865	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
359	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 21:25:25.412	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
360	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 21:26:05.642	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
361	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-15 23:26:48.861	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
362	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:16:22.839	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
363	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:23:16.011	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
364	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:24:16.682	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
365	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:26:04.862	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
366	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:33:54.119	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
367	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:38:31.672	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
368	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:40:02.63	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
369	140.0.73.31	ID	JI	Sidoarjo	/orderan	2025-01-16 02:41:31.904	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-7.446900	112.718100	\N	\N	{}
370	172.253.15.226	US	SC	Charleston	/orderan	2025-01-16 11:57:10	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36	32.777100	-79.930500	\N	\N	{}
371	103.184.56.54	ID	JB	Bandung	/orderan	2025-01-16 14:12:20.476	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.921700	107.607100	\N	\N	{}
372	103.184.56.54	ID	JB	Bandung	/orderan	2025-01-16 14:49:57.457	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.921700	107.607100	\N	\N	{}
373	103.184.56.54	ID	JB	Bandung	/orderan	2025-01-16 14:50:12.254	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.921700	107.607100	\N	\N	{}
374	103.184.56.54	ID	JB	Bandung	/orderan	2025-01-16 14:50:23.712	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-6.921700	107.607100	\N	\N	{}
375	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 01:15:35.803	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
376	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 01:19:57.347	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36	-7.446900	112.718100	\N	\N	{}
377	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 01:19:59.437	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
378	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 01:45:32.711	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
379	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 01:48:38.388	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
380	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 04:56:36.52	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
381	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 04:56:54.783	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
382	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-22 04:57:00.821	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
383	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 01:43:29.337	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
384	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 01:44:46.477	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
385	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 01:51:41.662	Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/17.5 Mobile/15A5370a Safari/602.1	-7.446900	112.718100	\N	\N	{}
386	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 01:54:39.713	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
387	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 05:57:50.63	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
388	140.0.68.13	ID	JI	Sidoarjo	/orderan	2025-01-23 06:02:03.651	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:134.0) Gecko/20100101 Firefox/134.0	-7.446900	112.718100	\N	\N	{}
389	74.125.19.33	US	NC	Morganton	/orderan	2025-01-23 13:56:20.858	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36	35.753100	-81.695400	\N	\N	{}
\.


--
-- TOC entry 5026 (class 0 OID 0)
-- Dependencies: 216
-- Name: configurations_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configurations_config_id_seq', 1, true);


--
-- TOC entry 5027 (class 0 OID 0)
-- Dependencies: 218
-- Name: m_costs_cost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_costs_cost_id_seq', 7, true);


--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 220
-- Name: m_ingredients_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_ingredients_ingredient_id_seq', 8, true);


--
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 223
-- Name: m_tools_tool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_tools_tool_id_seq', 8, true);


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 225
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 129, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 227
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 149, true);


--
-- TOC entry 5032 (class 0 OID 0)
-- Dependencies: 228
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 72, true);


--
-- TOC entry 5033 (class 0 OID 0)
-- Dependencies: 230
-- Name: t_utils_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_utils_product_id_seq', 11, true);


--
-- TOC entry 5034 (class 0 OID 0)
-- Dependencies: 232
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- TOC entry 5035 (class 0 OID 0)
-- Dependencies: 235
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitors_id_seq', 397, true);


--
-- TOC entry 4804 (class 2606 OID 175890)
-- Name: configurations configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurations
    ADD CONSTRAINT configurations_pkey PRIMARY KEY (config_id);


--
-- TOC entry 4806 (class 2606 OID 175892)
-- Name: m_costs m_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_costs
    ADD CONSTRAINT m_costs_pkey PRIMARY KEY (cost_id);


--
-- TOC entry 4808 (class 2606 OID 175894)
-- Name: m_ingredients m_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_ingredients
    ADD CONSTRAINT m_ingredients_pkey PRIMARY KEY (ingredient_id);


--
-- TOC entry 4812 (class 2606 OID 175896)
-- Name: m_tools m_tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_tools
    ADD CONSTRAINT m_tools_pkey PRIMARY KEY (tool_id);


--
-- TOC entry 4814 (class 2606 OID 175898)
-- Name: t_order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- TOC entry 4816 (class 2606 OID 175900)
-- Name: t_orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- TOC entry 4818 (class 2606 OID 175902)
-- Name: t_orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4810 (class 2606 OID 175904)
-- Name: m_products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4820 (class 2606 OID 175906)
-- Name: t_utils_product t_utils_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_pkey PRIMARY KEY (id);


--
-- TOC entry 4822 (class 2606 OID 175908)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4824 (class 2606 OID 175910)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4826 (class 2606 OID 175912)
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- TOC entry 4833 (class 2620 OID 175913)
-- Name: m_products check_stock_availability; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_stock_availability BEFORE INSERT OR UPDATE OF stock ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.update_product_availability();


--
-- TOC entry 4830 (class 2620 OID 175914)
-- Name: configurations set_updated_at_configurations; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_configurations BEFORE UPDATE ON public.configurations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4831 (class 2620 OID 175915)
-- Name: m_costs set_updated_at_m_costs; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_costs BEFORE UPDATE ON public.m_costs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4832 (class 2620 OID 175916)
-- Name: m_ingredients set_updated_at_m_ingredients; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_ingredients BEFORE UPDATE ON public.m_ingredients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4837 (class 2620 OID 175917)
-- Name: t_orders set_updated_at_m_orders; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_orders BEFORE UPDATE ON public.t_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4834 (class 2620 OID 175918)
-- Name: m_products set_updated_at_m_products; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_products BEFORE UPDATE ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4835 (class 2620 OID 175919)
-- Name: m_tools set_updated_at_m_tools; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_tools BEFORE UPDATE ON public.m_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4836 (class 2620 OID 175920)
-- Name: t_order_items set_updated_at_t_order_items; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_t_order_items BEFORE UPDATE ON public.t_order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4838 (class 2620 OID 175921)
-- Name: users set_updated_at_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- TOC entry 4827 (class 2606 OID 175922)
-- Name: t_order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.t_orders(order_id) ON DELETE CASCADE;


--
-- TOC entry 4828 (class 2606 OID 175927)
-- Name: t_order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id);


--
-- TOC entry 4829 (class 2606 OID 175932)
-- Name: t_utils_product t_utils_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id) ON DELETE CASCADE;


-- Completed on 2025-06-06 08:11:20

--
-- PostgreSQL database dump complete
--

