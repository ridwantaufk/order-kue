--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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
-- Name: configurations_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.configurations_config_id_seq OWNED BY public.configurations.config_id;


--
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
-- Name: m_costs_cost_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_costs_cost_id_seq OWNED BY public.m_costs.cost_id;


--
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
-- Name: m_ingredients_ingredient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_ingredients_ingredient_id_seq OWNED BY public.m_ingredients.ingredient_id;


--
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
    available boolean DEFAULT false,
    category character varying(20)
);


ALTER TABLE public.m_products OWNER TO postgres;

--
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
-- Name: m_tools_tool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.m_tools_tool_id_seq OWNED BY public.m_tools.tool_id;


--
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
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.t_order_items.order_item_id;


--
-- Name: t_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_orders (
    order_id integer NOT NULL,
    order_code text NOT NULL,
    customer_name character varying(100) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) NOT NULL,
    customer_phone character varying(20) NOT NULL,
    customer_address text NOT NULL,
    location_latitude numeric(10,8),
    location_longitude numeric(11,8),
    order_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    device_info text
);


ALTER TABLE public.t_orders OWNER TO postgres;

--
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
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.t_orders.order_id;


--
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
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.m_products.product_id;


--
-- Name: t_utils_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.t_utils_product (
    id integer NOT NULL,
    product_id integer NOT NULL,
    favorite integer
);


ALTER TABLE public.t_utils_product OWNER TO postgres;

--
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
-- Name: t_utils_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_utils_product_id_seq OWNED BY public.t_utils_product.id;


--
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
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: v_customer_analysis; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_customer_analysis AS
 SELECT o.customer_name,
    count(DISTINCT o.order_id) AS total_orders,
    sum(oi.price) AS total_spent,
    (sum(oi.price) / (count(DISTINCT o.order_id))::numeric) AS avg_order_value,
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
  WHERE ((o.status)::text <> ALL ((ARRAY['Batal'::character varying, 'Menunggu'::character varying])::text[]))
  GROUP BY o.customer_name
  ORDER BY (sum(oi.price)) DESC;


ALTER VIEW public.v_customer_analysis OWNER TO postgres;

--
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
  WHERE ((o.status)::text <> ALL (ARRAY['Batal'::text, 'Menunggu'::text]))
  GROUP BY (date_trunc('month'::text, o.created_at)), (EXTRACT(year FROM o.created_at)), (EXTRACT(month FROM o.created_at))
  ORDER BY (date_trunc('month'::text, o.created_at)) DESC;


ALTER VIEW public.v_monthly_sales_summary OWNER TO postgres;

--
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
  ORDER BY
        CASE
            WHEN (p.stock <= 5) THEN 1
            WHEN (p.stock <= 10) THEN 2
            WHEN (p.stock <= 20) THEN 3
            ELSE 4
        END, p.product_name;


ALTER VIEW public.v_inventory_status OWNER TO postgres;

--
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
-- Name: visitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;


--
-- Name: configurations config_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurations ALTER COLUMN config_id SET DEFAULT nextval('public.configurations_config_id_seq'::regclass);


--
-- Name: m_costs cost_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_costs ALTER COLUMN cost_id SET DEFAULT nextval('public.m_costs_cost_id_seq'::regclass);


--
-- Name: m_ingredients ingredient_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.m_ingredients_ingredient_id_seq'::regclass);


--
-- Name: m_products product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: m_tools tool_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_tools ALTER COLUMN tool_id SET DEFAULT nextval('public.m_tools_tool_id_seq'::regclass);


--
-- Name: t_order_items order_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: t_orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: t_utils_product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product ALTER COLUMN id SET DEFAULT nextval('public.t_utils_product_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);


--
-- Data for Name: configurations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.configurations (config_id, url_backend, port, created_at, updated_at, url_frontend) FROM stdin;
1	https://a3c8-149-113-206-114.ngrok-free.app	5000	2024-12-02 10:09:15	2024-12-03 08:30:39	https://order-kue-brownies.vercel.app
\.


--
-- Data for Name: m_costs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_costs (cost_id, cost_name, cost_description, amount, cost_date, created_at, updated_at, active) FROM stdin;
4	Bahan Somay	sogut	25400.00	2024-11-21	2024-10-29 16:33:56	2024-12-04 18:12:22	f
5	Pengemasan	Biaya untuk pengemasan brownies	100000.00	2025-06-08	2024-10-29 16:33:56	2025-06-08 02:21:19	t
3	transportasi	biaya perhari	50000.00	2025-06-08	2024-10-29 16:33:56	2025-06-08 02:21:22	t
2	Gas Elpiji	Biaya penggunaan gas untuk oven 3kg	16500.00	2025-06-08	2024-10-29 16:33:56	2025-06-08 02:21:33	t
7	orang	oioio	12000.00	2025-06-08	2024-11-15 04:30:30	2025-06-08 02:21:37	t
1	Listrik	Biaya penggunaan listrik per bulan	150000.00	2025-06-08	2024-10-29 16:33:56	2025-06-08 02:21:42	f
6	j	h	7.00	2025-06-08	2024-11-15 04:29:29	2025-06-08 02:21:47	f
\.


--
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
-- Data for Name: m_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_products (product_id, product_name, description, price, stock, created_at, updated_at, icon, cost_price, available, category) FROM stdin;
4	Brownies Red Velvet	Brownies dengan rasa khas red velvet.	35000.00	2	2024-10-24 11:27:21	2025-06-09 23:29:11	1749067510884-red-velvet.jpg	16000.00	t	makanan
5	Brownies Chocochips	Brownies taburan chocochip asli	35000.00	0	2024-10-24 11:27:21	2025-06-09 23:29:14	1749066376768-chocochip.jpg	18000.00	f	makanan
3	Brownies Kacang	Brownies dengan taburan kacang almond di atasnya	35000.00	0	2024-10-24 11:27:21	2025-06-09 23:29:16	1749066212012-kacang.jpg	16000.00	f	makanan
72	Brownies Mix 2	perpaduan kacang, keju dan chocochip yang ditabur diatasnya	35000.00	0	2025-01-23 01:48:35	2025-06-09 23:29:23	1749066544665-kacangkejuchoco2.jpg	18000.00	f	makanan
8	Brownies Mix 3	Chocochip mix, kacang almond,, dan keju	35000.00	5	2024-10-30 14:24:50	2025-06-09 23:29:24	1749067161944-browniesbox.jpeg	16000.00	t	makanan
6	Brownies Mix 1	Chocochip, kacang almond, keju	35000.00	0	2024-10-30 13:29:04	2025-06-09 23:29:29	1749066463643-browniespersegipanjang.jpeg	16000.00	f	makanan
1	Brownies Original	Brownies klasik dengan rasa cokelat yang kuat.	35000.00	6	2024-10-24 11:27:21	2025-06-09 23:29:29	1749067207975-polos.jpg	16000.00	t	makanan
2	Brownies Keju	Brownies dengan topping keju yang melimpah.	35000.00	0	2024-10-24 11:27:21	2025-06-09 23:29:32	1749066259751-keju.jpg	17000.00	f	makanan
71	Brownies Pandan	list belanjaan custom yang ingin dibeli	35000.00	5	2024-12-04 13:44:27	2025-06-09 23:29:33	1749067237252-1749060842919-browniespandan.jpeg	17500.00	t	makanan
10	Cheese Tea Jeruk Nipis	Cheese tea rasa jeruk nipis	10000.00	0	2024-11-02 07:32:21	2025-06-09 23:29:39	1749067754195-cheese_tea_jeruk_nipis.jpg	5000.00	f	minuman
9	Matchiato	Minuman matchiato	8000.00	0	2024-11-02 07:30:09	2025-06-09 23:29:43	1749067661307-machiato.jpg	4500.00	f	minuman
11	Kopi Susu Gula Aren	Kopi susu menggunakan gula aren	10000.00	3	2024-11-02 07:33:13	2025-06-09 23:33:38	1749067569978-kopi_susu_gula_aren.jpg	5000.00	t	minuman
75	Brownies Ceres	Taburan ceres sebagai penambah manis	35000.00	5	2025-06-09 23:59:38	2025-06-10 00:02:32	1749488552112-brownies_ceres.jpg	17500.00	t	makanan
\.


--
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
130	150	3	1	35000.00	2025-06-06 12:32:06	2025-06-06 12:32:06
131	150	5	1	30000.00	2025-06-06 12:32:06	2025-06-06 12:32:06
132	151	6	17	595000.00	2025-06-06 12:32:32	2025-06-06 12:32:32
133	152	3	2	70000.00	2025-06-06 13:43:23	2025-06-06 13:43:23
134	153	2	1	35000.00	2025-06-06 15:42:14	2025-06-06 15:42:14
135	153	3	4	140000.00	2025-06-06 15:42:14	2025-06-06 15:42:14
136	153	6	1	35000.00	2025-06-06 15:42:14	2025-06-06 15:42:14
137	154	4	2	70000.00	2025-06-06 15:44:37	2025-06-06 15:44:37
138	155	8	1	35000.00	2025-06-06 15:45:07	2025-06-06 15:45:07
139	156	2	1	35000.00	2025-06-06 16:30:25	2025-06-06 16:30:25
140	157	3	1	35000.00	2025-06-07 06:29:44	2025-06-07 06:29:44
141	158	4	2	70000.00	2025-06-07 07:23:10	2025-06-07 07:23:10
142	158	9	2	16000.00	2025-06-07 07:23:10	2025-06-07 07:23:10
143	158	71	1	35000.00	2025-06-07 07:23:10	2025-06-07 07:23:10
144	159	4	1	35000.00	2025-06-07 07:29:52	2025-06-07 07:29:52
145	159	8	2	70000.00	2025-06-07 07:29:52	2025-06-07 07:29:52
146	159	10	1	10000.00	2025-06-07 07:29:52	2025-06-07 07:29:52
147	160	2	2	70000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
148	160	3	3	105000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
149	160	5	1	30000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
150	160	6	1	35000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
151	160	9	4	32000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
152	160	10	2	20000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
153	160	11	2	20000.00	2025-06-07 07:59:16	2025-06-07 07:59:16
154	161	9	2	16000.00	2025-06-07 12:05:40	2025-06-07 12:05:40
155	162	2	6	210000.00	2025-06-07 17:51:27	2025-06-07 17:51:27
156	163	2	7	245000.00	2025-06-07 17:54:41	2025-06-07 17:54:41
157	164	6	1	35000.00	2025-06-07 18:18:17	2025-06-07 18:18:17
158	165	6	1	35000.00	2025-06-07 18:25:12	2025-06-07 18:25:12
159	166	2	7	245000.00	2025-06-07 18:26:11	2025-06-07 18:26:11
160	167	2	7	245000.00	2025-06-07 19:47:10	2025-06-07 19:47:10
161	168	72	10	350000.00	2025-06-08 00:19:50	2025-06-08 00:19:50
162	169	6	4	140000.00	2025-06-08 01:04:49	2025-06-08 01:04:49
163	169	8	3	105000.00	2025-06-08 01:04:49	2025-06-08 01:04:49
164	169	10	4	40000.00	2025-06-08 01:04:49	2025-06-08 01:04:49
165	170	6	1	35000.00	2025-06-08 01:07:26	2025-06-08 01:07:26
166	171	2	1	35000.00	2025-06-08 08:41:18	2025-06-08 08:41:18
167	172	2	1	35000.00	2025-06-09 14:01:52	2025-06-09 14:01:52
168	172	3	1	35000.00	2025-06-09 14:01:52	2025-06-09 14:01:52
169	173	8	2	70000.00	2025-06-09 14:02:24	2025-06-09 14:02:24
170	174	2	1	35000.00	2025-06-09 14:23:42	2025-06-09 14:23:42
171	175	5	1	30000.00	2025-06-09 14:40:42	2025-06-09 14:40:42
172	176	3	1	35000.00	2025-06-09 14:49:59	2025-06-09 14:49:59
173	177	2	1	35000.00	2025-06-09 14:54:27	2025-06-09 14:54:27
174	178	2	1	35000.00	2025-06-09 15:01:33	2025-06-09 15:01:33
175	179	3	1	35000.00	2025-06-09 15:15:33	2025-06-09 15:15:33
176	180	2	1	35000.00	2025-06-09 15:41:55	2025-06-09 15:41:55
177	180	4	3	105000.00	2025-06-09 15:41:55	2025-06-09 15:41:55
178	181	2	1	35000.00	2025-06-09 16:22:05	2025-06-09 16:22:05
179	182	2	1	35000.00	2025-06-09 16:53:02	2025-06-09 16:53:02
180	183	11	2	20000.00	2025-06-09 16:53:30	2025-06-09 16:53:30
181	184	11	1	10000.00	2025-06-09 17:00:44	2025-06-09 17:00:44
182	185	5	1	30000.00	2025-06-09 17:02:57	2025-06-09 17:02:57
183	186	71	1	35000.00	2025-06-09 18:42:18	2025-06-09 18:42:18
184	187	4	1	35000.00	2025-06-09 18:57:36	2025-06-09 18:57:36
185	188	8	1	35000.00	2025-06-09 19:13:44	2025-06-09 19:13:44
186	189	8	1	35000.00	2025-06-09 19:14:33	2025-06-09 19:14:33
187	190	3	1	35000.00	2025-06-09 19:21:50	2025-06-09 19:21:50
188	191	11	2	20000.00	2025-06-09 19:26:57	2025-06-09 19:26:57
189	192	71	1	35000.00	2025-06-09 19:34:16	2025-06-09 19:34:16
190	193	5	6	180000.00	2025-06-09 21:29:57	2025-06-09 21:29:57
191	194	75	11	385000.00	2025-06-10 00:03:35	2025-06-10 00:03:35
\.


--
-- Data for Name: t_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_orders (order_id, order_code, customer_name, created_at, updated_at, status, customer_phone, customer_address, location_latitude, location_longitude, order_date, device_info) FROM stdin;
95	ORDER-1734176216063-3778	testing	2024-12-14 18:36:56	2024-12-14 21:19:50	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
97	ORDER-1734186944231-3464	widyanti	2024-12-14 21:35:44	2024-12-14 21:36:49	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
101	ORDER-1734214153952-1861	gina	2024-12-15 05:09:15	2024-12-15 05:09:15	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
103	ORDER-1734265899446-7701	farhan	2024-12-15 19:31:41	2024-12-15 19:31:41	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
105	ORDER-1734266701120-6439	vernika	2024-12-15 19:45:02	2024-12-15 19:45:02	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
111	ORDER-1734282624253-5508	miya	2024-12-16 00:10:26	2024-12-16 00:40:07	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
107	ORDER-1734282044141-8006	fuji	2024-12-16 00:00:44	2024-12-16 00:42:55	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
109	ORDER-1734282541610-7259	jeje	2024-12-16 00:09:03	2024-12-16 00:43:00	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
113	ORDER-1734288174234-2354	Jarjit sink	2024-12-16 01:42:55	2024-12-16 01:48:32	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
115	ORDER-1734289083753-2068	bor	2024-12-16 01:58:05	2024-12-16 02:03:02	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
117	ORDER-1734289514163-7207	beni	2024-12-16 02:05:14	2024-12-16 02:07:51	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
123	ORDER-1734414859470-2069	wirawan gunaw	2024-12-17 12:54:19	2024-12-17 12:54:19	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
119	ORDER-1734414741920-8882	feri s	2024-12-17 12:52:22	2024-12-17 12:57:33	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
121	ORDER-1734414800457-6843	Kirana putri	2024-12-17 12:53:20	2024-12-17 12:57:42	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
125	ORDER-1734656248369-4972	Boran	2024-12-20 07:57:28	2024-12-20 07:57:28	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
129	ORDER-1736852150383-7553	Ramadhani	2025-01-14 17:55:50	2025-01-14 17:57:27	Sedang Diproses			\N	\N	2025-06-07 06:09:51.920971	\N
127	ORDER-1736852067899-1408	Faridz	2025-01-14 17:54:28	2025-01-14 17:57:28	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
131	ORDER-1736852330660-5898	Fita	2025-01-14 17:58:51	2025-01-14 17:58:51	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
133	ORDER-1736946435572-2637	Farida	2025-01-15 20:07:16	2025-01-15 21:01:51	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
135	ORDER-1737484307617-2896	Ridwan	2025-01-22 01:31:48	2025-01-22 01:31:48	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
137	ORDER-1737691735353-8846	rizal	2025-01-24 11:08:56	2025-01-24 11:12:43	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
1	ORD-2024-0001	Budi Santoso	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
2	ORD-2024-0002	Siti Nurhaliza	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
3	ORD-2024-0003	Andi Pratama	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
4	ORD-2024-0004	Dewi Anggraini	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
5	ORD-2024-0005	Rizky Maulana	2024-10-24 11:27:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
6	ORDER-1733807897139-7869	ridwan	2024-12-10 12:18:17	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
7	ORDER-1733807992828-4393	ridwan	2024-12-10 12:19:53	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
8	ORDER-1733808081733-9739	ridwan	2024-12-10 12:21:22	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
9	ORDER-1733812255086-6072	tiara	2024-12-10 13:30:55	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
10	ORDER-1733812456788-5035	andri	2024-12-10 13:34:17	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
11	ORDER-1733814576085-4203	andini putri	2024-12-10 14:09:36	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
12	ORDER-1733814641605-5235	putra siregar	2024-12-10 14:10:42	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
13	ORDER-1733815100435-1829	ferdiansyah	2024-12-10 14:18:20	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
14	ORDER-1733815892426-6631	aji	2024-12-10 14:31:32	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
15	ORDER-1733816200470-4453	Dimas andri	2024-12-10 14:36:40	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
16	ORDER-1733816236893-1348	Fauziah	2024-12-10 14:37:17	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
17	ORDER-1733818864574-7846	Wagon miasyah	2024-12-10 15:21:05	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
18	ORDER-1733819130580-9131	Wandi	2024-12-10 15:25:31	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
19	ORDER-1733819706071-8222	Maysyaroh Ampuni	2024-12-10 15:35:06	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
20	ORDER-1733820602859-7329	admin	2024-12-10 15:50:03	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
21	ORDER-1733820762835-2061	sayiun	2024-12-10 15:52:43	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
22	ORDER-1733821003073-8531	Sawarah	2024-12-10 15:56:43	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
23	ORDER-1733824190205-2577	Andini	2024-12-10 16:49:50	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
24	ORDER-1733825642385-6085	Farel	2024-12-10 17:14:02	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
25	ORDER-1733826481832-9237	Windi	2024-12-10 17:28:02	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
26	ORDER-1733826625579-8806	Ghefari	2024-12-10 17:30:26	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
27	ORDER-1733826676450-4389	Ferry	2024-12-10 17:31:16	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
28	ORDER-1733827516904-9771	testing	2024-12-10 17:45:17	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
29	ORDER-1733828059939-7899	Aji marumis	2024-12-10 17:54:20	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
30	ORDER-1733828660292-6912	Ghifari	2024-12-10 18:04:20	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
31	ORDER-1733829196873-9620	sinta	2024-12-10 18:13:17	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
32	ORDER-1733829628128-2269	wedus gembel	2024-12-10 18:20:28	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
33	ORDER-1733829868071-5287	Frans	2024-12-10 18:24:28	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
34	ORDER-1733830281231-8417	tester	2024-12-10 18:31:21	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
35	ORDER-1733830425640-7949	cika	2024-12-10 18:33:46	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
36	ORDER-1733831450186-4210	ajinamoto	2024-12-10 18:50:50	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
37	ORDER-1733833467091-1467	Masturi	2024-12-10 19:24:27	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
38	ORDER-1733833701140-2762	Rahmah	2024-12-10 19:28:21	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
39	ORDER-1733833748012-5387	Rendy Shaputra	2024-12-10 19:29:08	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
40	ORDER-1733833785751-5615	Felix	2024-12-10 19:29:46	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
41	ORDER-1733833910007-4617	gege	2024-12-10 19:31:50	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
42	ORDER-1733834005809-9466	Ridwan Taufik	2024-12-10 19:33:26	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
43	ORDER-1733843539584-2149	Firdaus	2024-12-10 22:12:20	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
44	ORDER-1733843881647-7648	fenny	2024-12-10 22:18:02	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
45	ORDER-1733851330408-2857	Hajjah Tuti	2024-12-11 00:22:10	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
46	ORDER-1733854479870-3288	Mayang	2024-12-11 01:14:40	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
47	ORDER-1733855422165-3091	keyla	2024-12-11 01:30:22	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
48	ORDER-1733895895703-4524	Mustika	2024-12-11 12:44:56	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
49	ORDER-1733895937007-9505	Ghezy	2024-12-11 12:45:37	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
50	ORDER-1733910071811-2038	gifari	2024-12-11 16:41:12	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
51	ORDER-1733910473078-9174	Hani	2024-12-11 16:47:53	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
52	ORDER-1733911017048-7164	jaka purnomo	2024-12-11 16:56:57	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
53	ORDER-1733915881698-9512	ridwan	2024-12-11 18:18:02	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
54	ORDER-1733924441579-1087	karin	2024-12-11 20:40:42	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
55	ORDER-1733927341894-1969	Asep suracep fandami	2024-12-11 21:29:02	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
56	ORDER-1733927420485-4695	Fery	2024-12-11 21:30:20	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
57	ORDER-1733927440016-5565	Jeje	2024-12-11 21:30:40	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
58	ORDER-1733927463511-7132	Hani	2024-12-11 21:31:04	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
59	ORDER-1734000711694-3029	asep	2024-12-12 17:51:53	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
60	ORDER-1734001731959-9646	Nida	2024-12-12 18:08:53	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
61	ORDER-1734001911104-9811	Fitri	2024-12-12 18:11:52	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
62	ORDER-1734018844810-2798	rukan	2024-12-12 22:54:05	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
63	ORDER-1734079726873-1749	ridwan	2024-12-13 15:48:47	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
64	ORDER-1734091489575-7658	farah queen	2024-12-13 19:04:51	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
65	ORDER-1734091880102-5565	miya	2024-12-13 19:11:21	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
66	ORDER-1734093192960-2471	Freya	2024-12-13 19:33:14	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
67	ORDER-1734096248961-5349	rusli ansari	2024-12-13 20:24:09	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
68	ORDER-1734096323144-2265	rusli ansari	2024-12-13 20:25:23	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
69	ORDER-1734096491279-8587	rusli ansari t	2024-12-13 20:28:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
70	ORDER-1734096766334-7599	fery her	2024-12-13 20:32:46	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
71	ORDER-1734097347997-2571	testing	2024-12-13 20:42:29	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
72	ORDER-1734097381135-3083	fardin	2024-12-13 20:43:01	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
73	ORDER-1734098329976-4208	andini	2024-12-13 20:58:50	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
74	ORDER-1734099797789-4731	welrom	2024-12-13 21:23:19	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
75	ORDER-1734100758951-4484	westi	2024-12-13 21:39:19	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
76	ORDER-1734101377376-6875	rudi	2024-12-13 21:49:37	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
77	ORDER-1734105230780-5145	wenwen	2024-12-13 22:53:51	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
78	ORDER-1734105837007-2711	Unregister	2024-12-13 23:03:57	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
79	ORDER-1734106887980-1495	heni	2024-12-13 23:21:28	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
80	ORDER-1734109317923-9649	Nugraha	2024-12-14 00:01:58	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
81	ORDER-1734116611653-1939	Nia	2024-12-14 02:03:32	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
82	ORDER-1734116695112-7771	himandari	2024-12-14 02:04:55	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
83	ORDER-1734116891128-3384	Jihan	2024-12-14 02:08:11	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
84	ORDER-1734117022110-2588	Cepi	2024-12-14 02:10:22	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
85	ORDER-1734117485802-1871	Minahasa	2024-12-14 02:18:06	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
86	ORDER-1734117710891-2486	kak sena	2024-12-14 02:21:51	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
87	ORDER-1734117773515-1316	genji	2024-12-14 02:22:54	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
88	ORDER-1734118001052-2580	anji	2024-12-14 02:26:42	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
89	ORDER-1734126336082-5308	Dini N	2024-12-14 04:45:36	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
90	ORDER-1734126387736-7619	windi	2024-12-14 04:46:28	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
91	ORDER-1734130822834-6795	tes	2024-12-14 06:00:23	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
92	ORDER-1734166184830-9930	ghadi	2024-12-14 15:49:45	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
93	ORDER-1734168177636-3788	hana	2024-12-14 16:22:58	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
94	ORDER-1734174767492-4341	hakam	2024-12-14 18:12:49	2024-12-14 11:28:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
96	ORDER-1734176310264-1772	Jimi	2024-12-14 18:38:30	2024-12-14 21:37:30	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
98	ORDER-1734187629711-8742	mujahidin	2024-12-14 21:47:11	2024-12-14 21:47:11	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
102	ORDER-1734214208423-5466	Zaky	2024-12-15 05:10:10	2024-12-15 05:10:10	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
104	ORDER-1734266661721-5335	jeni	2024-12-15 19:44:22	2024-12-15 19:44:22	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
106	ORDER-1734281529617-8999	wardian	2024-12-15 23:52:11	2024-12-15 23:52:11	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
110	ORDER-1734282569821-1126	denis	2024-12-16 00:09:30	2024-12-16 00:41:18	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
112	ORDER-1734286264109-1317	karin	2024-12-16 01:11:05	2024-12-16 01:31:03	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
108	ORDER-1734282256467-7863	Sirna	2024-12-16 00:04:17	2024-12-16 01:31:13	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
114	ORDER-1734288560305-6368	Clouwd	2024-12-16 01:49:21	2024-12-16 01:53:11	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
116	ORDER-1734289253714-5488	lala	2024-12-16 02:00:55	2024-12-16 02:02:55	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
118	ORDER-1734289541601-9171	suci	2024-12-16 02:05:43	2024-12-16 02:08:04	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
124	ORDER-1734414887919-5085	Lala	2024-12-17 12:54:48	2024-12-17 12:54:48	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
120	ORDER-1734414777047-7571	Jeni frenklyn	2024-12-17 12:52:57	2024-12-17 12:57:40	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
126	ORDER-1735900762689-2465	testo	2025-01-03 17:39:23	2025-01-03 17:41:09	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
130	ORDER-1736852172335-8366	Aisyah S	2025-01-14 17:56:12	2025-01-14 17:56:12	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
128	ORDER-1736852118836-8835	Mira Asyiara	2025-01-14 17:55:19	2025-01-14 17:57:37	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
132	ORDER-1736852355178-4180	Adit siregar	2025-01-14 17:59:15	2025-01-14 17:59:15	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
136	ORDER-1737648307322-8646	Ridwan	2025-01-23 23:05:07	2025-01-23 23:25:28	Selesai			\N	\N	2025-06-07 06:09:51.920971	\N
147	ORDER-1749077459569-9504	Kardio	2025-06-05 05:51:00	2025-06-05 12:49:42	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
139	ORDER-1748997259177-7714	Andi	2025-06-04 07:34:19	2025-06-04 07:49:05	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
138	ORDER-1748995632986-4486	Andi	2025-06-04 07:07:13	2025-06-04 08:14:43	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
145	ORDER-1749005925431-2564	ridwan	2025-06-04 09:58:46	2025-06-04 09:59:55	Sedang diproses			\N	\N	2025-06-07 06:09:51.920971	\N
144	ORDER-1749004947675-2851	Intan	2025-06-04 09:42:28	2025-06-04 10:01:14	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
140	ORDER-1748999711210-8287	Riadi	2025-06-04 08:15:11	2025-06-04 08:31:23	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
142	ORDER-1749001280554-8265	Andi	2025-06-04 08:41:21	2025-06-04 08:41:21	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
157	ORDER-1749252583369-7064	Nia Anindia	2025-06-07 06:29:44	2025-06-07 07:28:07	Diterima	088328346873	Jl. Bangka No. 33	-6.97561943	107.66843036	2025-06-07 06:29:43.218	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
134	ORDER-1736950181153-8249	Andini	2025-01-15 21:09:41	2025-06-04 09:14:38	Sedang diproses			\N	\N	2025-06-07 06:09:51.920971	\N
151	ORDER-1749187951336-3556	Miya	2025-06-06 12:32:32	2025-06-06 13:15:56	Batal			\N	\N	2025-06-07 06:09:51.920971	\N
148	ORDER-1749077738181-3099	Yunita	2025-06-05 05:55:38	2025-06-05 07:31:44	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
141	ORDER-1749000701786-3415	Ferra	2025-06-04 08:31:42	2025-06-04 09:29:35	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
143	ORDER-1749002563341-6385	Sintia	2025-06-04 09:02:43	2025-06-04 09:29:41	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
122	ORDER-1734414833237-1046	Gani abdul wahid	2024-12-17 12:53:53	2025-06-04 09:29:49	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
158	ORDER-1749255789789-2835	jinia	2025-06-07 07:23:10	2025-06-07 07:28:24	Diterima	088384576383	Kost & Kontrakan Pak Mus Jl. Rancabolang Barat No.25	\N	\N	2025-06-07 07:23:09.693	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
150	ORDER-1749187926058-6575	yunita	2025-06-06 12:32:06	2025-06-06 13:31:02	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
149	ORDER-1749077753317-8437	Nia	2025-06-05 05:55:53	2025-06-05 08:16:00	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
146	ORDER-1749067978892-9411	Dini Putri	2025-06-05 03:12:59	2025-06-05 12:49:38	Diterima			\N	\N	2025-06-07 06:09:51.920971	\N
152	ORDER-1749192202795-5287	Fera sasriati	2025-06-06 13:43:23	2025-06-06 13:44:35	Sedang diproses			\N	\N	2025-06-07 06:09:51.920971	\N
153	ORDER-1749199334014-5438	sdf	2025-06-06 15:42:14	2025-06-06 15:42:14	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
154	ORDER-1749199476957-2315	Nanda	2025-06-06 15:44:37	2025-06-06 15:44:37	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
155	ORDER-1749199506391-4586	garta	2025-06-06 15:45:07	2025-06-06 15:45:07	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
156	ORDER-1749202225122-3818	testing	2025-06-06 16:30:25	2025-06-06 16:30:25	Menunggu			\N	\N	2025-06-07 06:09:51.920971	\N
160	ORDER-1749257955775-1669	Kurniawan	2025-06-07 07:59:16	2025-06-07 19:40:06	Sedang dikirim	08624998188	Derwati gang hj. udin no. 14	-6.96363835	107.67740965	2025-06-07 07:59:15.6	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
159	ORDER-1749256192142-5921	Masaji	2025-06-07 07:29:52	2025-06-07 19:39:58	Diterima	089837683823	Jl. Kecoa 22 No. 33	-6.97561943	107.66843036	2025-06-07 07:29:51.963	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
161	ORDER-1749272739801-5638	Dita Nur	2025-06-07 12:05:40	2025-06-07 12:06:16	Sedang diproses	088387462837	Jl. Mars III No. 7	-6.94657723	107.66541481	2025-06-07 12:05:39.68	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
162	ORDER-1749293486563-2160	Tiara	2025-06-07 17:51:27	2025-06-07 17:52:45	Batal	083458909211	Ciganitri gang janawara no. ix	-6.97211542	107.65051782	2025-06-07 17:51:26.504	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
167	ORDER-1749300429960-5708	zxczxc	2025-06-07 19:47:10	2025-06-07 20:07:33	Menunggu	088657564566	zxczxc	\N	\N	2025-06-07 19:47:09.94	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
175	ORDER-1749454842045-8092	tedting	2025-06-09 14:40:42	2025-06-09 15:18:57	Diterima	088552341888	testing 2	-6.20011753	106.81234360	2025-06-09 14:40:42.041	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
174	ORDER-1749453821497-7882	gahara	2025-06-09 14:23:42	2025-06-09 14:49:30	Diterima	088234687934	maragahyu raya jl. neptunus no 03	-6.95076220	107.66599540	2025-06-09 14:23:41.475	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
168	ORDER-1749316789931-3378	Bcob	2025-06-08 00:19:50	2025-06-08 01:03:22	Diterima	088563827346	Jl. Alam Asri Raya III No. 15	-6.97561943	107.66843036	2025-06-08 00:19:49.895	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
180	ORDER-1749458514691-7087	Nurhasanah	2025-06-09 15:41:55	2025-06-09 16:54:58	Sedang diproses	082584651324	tanjung duren 3 no 12	-6.20581745	106.81200027	2025-06-09 15:41:54.651	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
170	ORDER-1749319646139-6306	Nugraha	2025-06-08 01:07:26	2025-06-08 01:08:10	Sedang diproses	089567456445	Waduk jati asih	-7.28442590	107.27444940	2025-06-08 01:07:26.125	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
163	ORDER-1749293680442-6756	Tiara	2025-06-07 17:54:41	2025-06-07 18:17:06	Diterima	083747562827	Ciganitri Gg. Jawara No. XI	-6.97204620	107.65048456	2025-06-07 17:54:40.413	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
169	ORDER-1749319488987-4276	Muhammad Fahmi	2025-06-08 01:04:49	2025-06-08 08:40:34	Diterima	088238476238	Perum peruri 2 no. 3	-6.95531021	107.67021275	2025-06-08 01:04:48.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
171	ORDER-1749346878249-9561	indah	2025-06-08 08:41:18	2025-06-08 10:55:10	Sedang diproses	088675645367	cagra	-6.96685454	107.67691612	2025-06-08 08:41:18.215	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
164	ORDER-1749295096783-4550	Guard	2025-06-07 18:18:17	2025-06-07 18:24:45	Batal	087345534534	GBI	-6.97286089	107.66835022	2025-06-07 18:18:16.758	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
178	ORDER-1749456092696-2474	hahaags	2025-06-09 15:01:33	2025-06-09 15:22:21	Diterima	08856745663	asd	\N	\N	2025-06-09 15:01:32.666	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
166	ORDER-1749295570433-2302	xfg	2025-06-07 18:26:11	2025-06-07 19:40:00	Diterima	088567345345	xxcv	-6.17588364	106.81024933	2025-06-07 18:26:10.416	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
165	ORDER-1749295511809-8288	asd	2025-06-07 18:25:12	2025-06-07 19:40:08	Sedang dikirim	085674563452	zxczxc	-6.97275439	107.67064619	2025-06-07 18:25:11.785	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
173	ORDER-1749452544233-2855	tes	2025-06-09 14:02:24	2025-06-09 14:07:15	Diterima	089674564564	qwerty	-6.18697675	106.80805206	2025-06-09 14:02:24.208	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
172	ORDER-1749452511391-5174	testing	2025-06-09 14:01:52	2025-06-09 15:00:40	Diterima	08823462837	testing	-6.92296754	107.61318684	2025-06-09 14:01:51.334	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
176	ORDER-1749455398649-8639	asdasd	2025-06-09 14:49:59	2025-06-09 15:22:26	Diterima	088674564534	asd	-6.30615324	106.79191589	2025-06-09 14:49:58.597	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
182	ORDER-1749462782057-8611	laras	2025-06-09 16:53:02	2025-06-09 16:55:40	Batal	088789767866	testing23	-6.17673696	106.78710938	2025-06-09 16:53:02.024	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
185	ORDER-1749463376707-6493	nana	2025-06-09 17:02:57	2025-06-09 17:02:57	Menunggu	085855546767	jl. melati bandung	\N	\N	2025-06-09 17:02:56.833	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
179	ORDER-1749456932555-8964	jika	2025-06-09 15:15:33	2025-06-09 15:16:37	Diterima	08867456345	testing	-6.19038997	106.79088593	2025-06-09 15:15:32.518	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
184	ORDER-1749463243951-1985	dddr	2025-06-09 17:00:44	2025-06-09 17:06:19	Sedang diproses	085213728454	Cikapundung	\N	\N	2025-06-09 17:00:44.065	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
186	ORDER-1749469337677-3992	tes	2025-06-09 18:42:18	2025-06-09 18:42:18	Menunggu	085454319643	tes	-6.19420315	106.79019928	2025-06-09 18:42:17.847	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
183	ORDER-1749462809505-3419	kak rin	2025-06-09 16:53:30	2025-06-09 18:43:33	Sedang diproses	085675645645	rin jl. 123	\N	\N	2025-06-09 16:53:29.469	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
177	ORDER-1749455667463-1780	fgfg	2025-06-09 14:54:27	2025-06-09 18:57:00	Diterima	088567463466	dfg	-6.17946759	106.79414749	2025-06-09 14:54:27.362	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
187	ORDER-1749470256116-6367	haf	2025-06-09 18:57:36	2025-06-09 18:57:36	Menunggu	085422985668	batu indah	\N	\N	2025-06-09 18:57:36.31	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
181	ORDER-1749460924700-8414	Laly	2025-06-09 16:22:05	2025-06-09 21:38:08	Sedang dikirim	088347628347	Cijagra, bandung	\N	\N	2025-06-09 16:22:04.668	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
189	ORDER-1749471272613-2841	farah queen	2025-06-09 19:14:33	2025-06-09 19:16:12	Sedang diproses	088283467283	asdasd	-6.18629411	106.79758072	2025-06-09 19:14:32.567	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
190	ORDER-1749471710134-2067	ghjghj	2025-06-09 19:21:50	2025-06-09 19:22:57	Sedang diproses	086756745645	cengkareng	\N	\N	2025-06-09 19:21:50.098	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
188	ORDER-1749471223716-1913	coba tes notif	2025-06-09 19:13:44	2025-06-09 21:27:26	Sedang dikirim	085554878578	tessst	-6.19579508	106.80891037	2025-06-09 19:13:43.921	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1
192	ORDER-1749472456220-9202	testing	2025-06-09 19:34:16	2025-06-09 19:34:16	Menunggu	088567564534	gajah mada	\N	\N	2025-06-09 19:34:16.187	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
191	ORDER-1749472016339-1817	pesan kopiko	2025-06-09 19:26:56	2025-06-09 19:44:16	Sedang dikirim	088567456456	jl. jendral ahmad yani	\N	\N	2025-06-09 19:26:56.3	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
193	ORDER-1749479397141-1608	Syariffudin	2025-06-09 21:29:57	2025-06-09 21:40:16	Sedang diproses	088239487283	laswi bandung	\N	\N	2025-06-09 21:29:57.104	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
194	ORDER-1749488614417-2222	Hana	2025-06-10 00:03:35	2025-06-10 00:03:35	Menunggu	088898687576	Jl. Merdeka barat	-6.20865032	106.81886673	2025-06-10 00:03:34.387	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
\.


--
-- Data for Name: t_utils_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_utils_product (id, product_id, favorite) FROM stdin;
4	4	4
8	8	6
5	10	4
9	1	192
2	9	3
10	2	31
1	71	11
12	72	2
6	6	6
7	5	7
13	75	2
3	11	6
11	3	27
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, age, created_at, updated_at, username, password, birth_date, phone_number, address, role) FROM stdin;
7	Super User	1	2025-06-05 10:22:57	2025-06-07 04:02:47	superuser	$2b$10$vNTW28ceiLdaCU1zVuqAkuvSiymMDleWkDGL3NzamlTfhhVMQLJqW	2024-06-05	081312025217	Di homebase	Super User
3	High Access	35	2024-10-26 17:32:20	2025-06-05 08:51:35	admin	$2b$10$gqzRwvbwGtzoeURULW5up.otvrG/Ih4ekzJwbqHfTsdHh72hGUAQm	2000-02-22	081236384589	\N	Super User
5	Asri	22	2024-10-26 17:32:20	2025-06-05 08:51:50	asri	$2b$10$BOLPLjVaTpzICYscO2oiqervfjChkkDNapdk9rd7LH8CQ8OffiINu	1994-06-22	083539485772	Kiaracondong	Admin
4	Andri	28	2024-10-26 17:32:20	2025-06-05 08:51:55	andri	$2b$10$A97Y.NSvQ6Ocx6BmogqYGumWnaiK8nJFpyYjcgtWKjcyjqd04DAEi	1999-12-08	088345683762	Kampung Gadjah	Admin
1	Ridwan	25	2024-10-26 17:32:20	2025-06-05 08:52:04	ridwan	$2b$10$yQifnpQPexGByg/rpcGWAedLUCZ3V99kElbXfqKoHRFufw5E3UP4i	1985-11-21	08823476283	Buahbatu	Developer
6	Tiara	23	2025-06-05 10:03:08	2025-06-06 03:16:47	tiara	$2b$10$H9JnefhS6o4XvUBpfh1RLuWOSWO5LoL7cfhnp0bDnhvVBGJ4o3LtO	2002-03-08			Developer
\.


--
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
444	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:23:48.684	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
449	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:50:22.555	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
228	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 05:46:02.01	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756138	107.6682481	{"lat": "-6.9755447615937705", "lon": "107.66826113755586", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
229	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 05:59:30.334	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
230	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:00:41.513	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
231	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:03:01.284	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
232	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 06:03:28.074	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.921700	107.607100	-6.975640769633749	107.66826777865295	{"lat": "-6.975549278526163", "lon": "107.66828505628855", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
233	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 14:28:18.598	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756142	107.6682487	{"lat": "-6.975544884772859", "lon": "107.6682617898321", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
234	139.195.36.71	ID	JB	Bandung	/orderan	2024-12-14 14:29:09.862	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756161	107.6682487	{"lat": "-6.975544950198236", "lon": "107.6682621362823", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
398	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:32:45.733	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	\N	\N	{}
450	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:53:57.635	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
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
438	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:07:11.898	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
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
439	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:08:20.814	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
445	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:39:51.207	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
451	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:54:11.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
454	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:01:41.839	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
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
440	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:11:57.753	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
446	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:41:11.929	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
279	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:10:54.184	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756138	107.6682471	{"lat": "-6.975544579251564", "lon": "107.66826017199027", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
280	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:28:22.459	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9573236	107.657059	{"lat": "-6.9573999559559505", "lon": "107.65698059602464", "name": "Jalan Marga Cinta", "type": "tertiary", "class": "highway", "osm_id": 271678843, "address": {"city": "Bandung", "road": "Jalan Marga Cinta", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Margasari", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26841285, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9588919", "-6.9557504", "107.6547179", "107.6594529"], "display_name": "Jalan Marga Cinta, Margasari, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
281	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:29:57.932	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682457	{"lat": "-6.975544313642152", "lon": "107.66825876549578", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
282	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:31:18.77	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756135	107.6682457	{"lat": "-6.975544313642152", "lon": "107.66825876549578", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
283	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:31:51.436	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756126	107.6682474	{"lat": "-6.975544592632935", "lon": "107.66826024284929", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
284	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:32:01.524	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9756126	107.6682474	{"lat": "-6.975544592632935", "lon": "107.66826024284929", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "state": "Jawa Barat", "county": "Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26703312, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
285	139.195.221.155	ID	JB	Bandung	/orderan	2024-12-15 19:39:33.894	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:133.0) Gecko/20100101 Firefox/133.0	-6.921700	107.607100	-6.9573236	107.657059	{"lat": "-6.9573999559559505", "lon": "107.65698059602464", "name": "Jalan Marga Cinta", "type": "tertiary", "class": "highway", "osm_id": 271678843, "address": {"city": "Bandung", "road": "Jalan Marga Cinta", "state": "Jawa Barat", "region": "Jawa", "country": "Indonesia", "village": "Margasari", "postcode": "40287", "subdistrict": "Buahbatu", "country_code": "id", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26841285, "importance": 0.05339803845273514, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9588919", "-6.9557504", "107.6547179", "107.6594529"], "display_name": "Jalan Marga Cinta, Margasari, Buahbatu, Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
441	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:20:31.979	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
447	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:49:38.511	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
452	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:54:36.283	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
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
442	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:20:47.577	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
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
399	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:34:04.308	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
400	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:34:42.656	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
401	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:35:13.147	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
402	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:36:05.767	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	\N	\N	{}
403	::ffff:127.0.0.1	Tidak Diketahui	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-08 12:39:23.347	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	\N	\N	-6.975597	107.668423	{"lat": "-6.9755761", "lon": "107.6684270", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
404	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:39:48.844	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
405	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:39:54.871	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26739643, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
406	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:40:19.085	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
407	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:40:25.967	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
408	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:40:40.32	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
409	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 12:40:44.675	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
410	::ffff:103.147.9.162	ID	JB	Bandung	/orderan	2025-06-08 12:48:38.966	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	-6.921700	107.607100	\N	\N	{}
443	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:22:47.942	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
448	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:50:12.454	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
453	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:00:02.351	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
411	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 13:35:48.143	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 26789309, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
412	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 14:37:34.152	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
413	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 14:39:08.774	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
414	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 14:40:09.737	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	-6.975619426161369	107.66843036381418	{"lat": "-6.9755782", "lon": "107.6684382", "name": "Jalan Alam Asri III", "type": "residential", "class": "highway", "osm_id": 412663572, "address": {"road": "Jalan Alam Asri III", "town": "Bojongsoang", "state": "Jawa Barat", "county": "Kabupaten Bandung", "region": "Jawa", "country": "Indonesia", "village": "Buahbatu", "postcode": "40287", "country_code": "id", "neighbourhood": "Cluster Morinda", "ISO3166-2-lvl3": "ID-JW", "ISO3166-2-lvl4": "ID-JB"}, "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright", "osm_type": "way", "place_id": 27001125, "importance": 0.053370834668497714, "place_rank": 26, "addresstype": "road", "boundingbox": ["-6.9755880", "-6.9748501", "107.6680189", "107.6685668"], "display_name": "Jalan Alam Asri III, Cluster Morinda, Buahbatu, Bojongsoang, Kabupaten Bandung, Jawa Barat, Jawa, 40287, Indonesia"}
415	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 16:29:16.981	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
416	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-08 17:15:34.549	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
417	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 04:38:17.133	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
418	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 04:38:20.006	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
419	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 04:56:27.493	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
420	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 11:32:26.484	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
421	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 11:32:37.901	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
422	::ffff:114.10.148.19	ID	Tidak Diketahui	Tidak Diketahui	/orderan	2025-06-09 13:47:36.5	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-6.172800	106.827200	\N	\N	{}
423	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 13:48:36.396	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
424	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 13:49:03.032	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
425	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 13:49:15.47	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
426	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 13:57:40.031	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
427	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:01:11.952	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
428	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:01:56.864	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
429	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:02:29.119	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
430	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:02:34.243	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
431	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:02:39.948	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
432	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:02:56.753	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
433	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:03:55.324	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
434	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:04:22.758	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
435	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:04:42.844	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
436	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:06:01.045	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
437	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 14:06:21.928	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
455	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:03:44.794	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
456	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:05:44.234	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
457	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:05:49.793	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
458	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:06:02.601	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
459	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:07:05.095	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
460	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:07:46.114	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
461	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:08:13.707	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
462	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:08:29.957	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
463	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:09:12.598	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0	-7.446900	112.718100	\N	\N	{}
464	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:10:32.078	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0	-7.446900	112.718100	\N	\N	{}
465	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:13:17.664	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
466	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:13:28.735	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
467	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:14:16.713	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
468	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:14:20.542	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
469	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:15:49.243	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
470	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:16:03.679	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
471	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:16:06.829	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
472	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:18:45.856	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
473	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:18:54.431	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
474	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:19:21.169	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
475	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:41:16.758	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
476	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 15:42:05.403	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
477	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:16:23.847	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
478	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:22:10.964	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
479	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:48:02.577	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
480	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:51:50.553	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
481	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:51:58.088	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
482	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:53:08.219	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
483	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 16:53:35.376	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
484	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:00:20.779	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
485	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:01:14.825	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
486	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:01:23.628	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
487	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:01:51.197	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
488	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:02:03.65	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
489	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:05:25.839	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
490	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:05:57.677	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
491	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:06:09.225	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
492	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 17:52:33.55	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
493	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:36:51.859	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
494	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:41:48.895	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
495	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:41:51.178	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
496	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:41:52.68	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
497	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:43:13.275	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
498	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:54:23.08	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
499	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:56:31.961	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
500	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:56:39.218	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
501	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:56:49.657	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
502	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 18:57:08.422	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
503	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:12:50.02	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
504	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:12:59.322	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
505	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:13:14.294	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
506	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:13:15.279	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
507	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:13:55.085	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
508	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:14:38.802	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
509	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:16:21.51	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
510	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:16:26.306	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
511	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:18:44.996	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
512	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:19:32.702	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
513	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:21:19.882	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
514	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:21:24.443	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
515	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:21:58.339	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
516	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:22:09.689	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
517	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:22:48.099	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
518	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:23:15.467	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
519	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:24:57.983	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
520	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:25:19.973	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
521	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:27:11.612	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
522	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:27:15.657	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
523	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:28:41.705	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
524	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:30:39.577	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
525	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:34:01.04	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
526	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:34:21.543	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
527	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:34:28.077	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
528	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 19:42:52.893	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
529	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:27:37.448	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
530	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:29:14.743	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
531	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:29:28.207	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
532	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:30:03.954	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
533	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:31:53.237	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
534	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:33:13.172	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
535	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:38:21.009	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
536	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:39:17.428	Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1	-7.446900	112.718100	\N	\N	{}
537	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:39:30.348	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
538	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:41:43.518	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
539	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:48:36.268	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
540	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:48:39.815	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
541	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:49:03.292	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
542	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:49:18.097	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
543	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:54:36.847	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
544	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 21:58:23.201	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
545	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:00:37.731	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
546	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:00:47.17	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
547	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:01:12.049	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
548	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:02:42.233	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
549	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:02:47.669	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
550	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:02:54.098	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
551	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:03:05.937	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
552	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:05:15.786	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
553	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:09:26.083	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
554	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:35:36.147	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
555	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:36:08.081	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
556	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:50:06.041	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
557	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 22:50:16.567	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
558	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 23:32:03.923	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
559	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 23:32:09.34	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
560	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 23:33:48.282	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
561	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-09 23:57:56.284	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
562	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:02:39.455	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
563	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:02:46.334	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
564	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:03:03.416	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
565	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:03:05.521	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
566	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:03:39.768	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
567	::ffff:140.0.53.148	ID	JI	Sidoarjo	/orderan	2025-06-10 00:14:32.484	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0	-7.446900	112.718100	\N	\N	{}
\.


--
-- Name: configurations_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.configurations_config_id_seq', 1, true);


--
-- Name: m_costs_cost_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_costs_cost_id_seq', 7, true);


--
-- Name: m_ingredients_ingredient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_ingredients_ingredient_id_seq', 8, true);


--
-- Name: m_tools_tool_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.m_tools_tool_id_seq', 8, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 191, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 194, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 75, true);


--
-- Name: t_utils_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_utils_product_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 7, true);


--
-- Name: visitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visitors_id_seq', 567, true);


--
-- Name: configurations configurations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.configurations
    ADD CONSTRAINT configurations_pkey PRIMARY KEY (config_id);


--
-- Name: m_costs m_costs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_costs
    ADD CONSTRAINT m_costs_pkey PRIMARY KEY (cost_id);


--
-- Name: m_ingredients m_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_ingredients
    ADD CONSTRAINT m_ingredients_pkey PRIMARY KEY (ingredient_id);


--
-- Name: m_tools m_tools_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_tools
    ADD CONSTRAINT m_tools_pkey PRIMARY KEY (tool_id);


--
-- Name: t_order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: t_orders orders_order_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);


--
-- Name: t_orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: m_products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: t_utils_product t_utils_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: visitors visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);


--
-- Name: m_products check_stock_availability; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER check_stock_availability BEFORE INSERT OR UPDATE OF stock ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.update_product_availability();


--
-- Name: configurations set_updated_at_configurations; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_configurations BEFORE UPDATE ON public.configurations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: m_costs set_updated_at_m_costs; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_costs BEFORE UPDATE ON public.m_costs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: m_ingredients set_updated_at_m_ingredients; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_ingredients BEFORE UPDATE ON public.m_ingredients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: t_orders set_updated_at_m_orders; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_orders BEFORE UPDATE ON public.t_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: m_products set_updated_at_m_products; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_products BEFORE UPDATE ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: m_tools set_updated_at_m_tools; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_m_tools BEFORE UPDATE ON public.m_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: t_order_items set_updated_at_t_order_items; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_t_order_items BEFORE UPDATE ON public.t_order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users set_updated_at_users; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: t_order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.t_orders(order_id) ON DELETE CASCADE;


--
-- Name: t_order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id);


--
-- Name: t_utils_product t_utils_product_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

