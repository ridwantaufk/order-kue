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
    available boolean DEFAULT false
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
    order_code character varying(20) NOT NULL,
    customer_name character varying(100) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
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
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    age integer,
    created_at timestamp(0) without time zone DEFAULT now(),
    updated_at timestamp(0) without time zone DEFAULT now(),
    username character varying(100) NOT NULL,
    password text NOT NULL
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
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


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
5	Pengemasan	Biaya untuk pengemasan brownies	100000.00	2024-10-05	2024-10-29 16:33:56	2024-10-29 16:33:56	t
3	transportasi	biaya perhari	50000.00	2024-11-15	2024-10-29 16:33:56	2024-11-15 02:38:37	t
6	j	h	7.00	2024-11-14	2024-11-15 04:29:29	2024-11-15 04:38:28	f
4	Bahan Somay	sogut	25400.00	2024-11-21	2024-10-29 16:33:56	2024-11-15 18:03:49	f
2	Gas	Biaya penggunaan gas untuk oven	75000.00	2024-10-02	2024-10-29 16:33:56	2024-11-16 00:09:33	f
1	Listrik	Biaya penggunaan listrik per bulan	150000.00	2024-10-01	2024-10-29 16:33:56	2024-11-16 05:43:01	f
7	orang	oioio	12000.00	2024-11-15	2024-11-15 04:30:30	2024-11-16 05:44:10	t
\.


--
-- Data for Name: m_ingredients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_ingredients (ingredient_id, ingredient_name, quantity, unit, price_per_unit, created_at, updated_at, available) FROM stdin;
7	Kacang Almond	1.00	kg	80000.00	2024-10-29 16:34:57	2024-11-16 08:45:31	t
5	Mentega	2.00	kg	40000.00	2024-10-29 16:34:57	2024-11-16 08:45:31	t
1	Tepung Terigu	10.00	kg	12000.00	2024-10-28 16:34:57	2024-11-16 08:45:31	t
2	Gula Merah	2.00	mg	10000.00	2024-10-29 16:34:57	2024-11-16 20:14:05	f
6	Keju Parut	1.00	kg	45000.00	2024-10-29 16:34:57	2024-11-16 20:16:40	f
4	Telur Ayam	30.00	butir	2000.00	2024-10-29 16:34:57	2024-11-16 20:16:40	f
8	Bubuk mesiu	8.00	kg	23000.00	2024-11-17 02:56:41	2024-11-17 02:56:41	t
\.


--
-- Data for Name: m_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_products (product_id, product_name, description, price, stock, created_at, updated_at, icon, cost_price, available) FROM stdin;
69	monyong	monyongskuy	34000.00	20	2024-11-29 11:21:17	2024-11-29 11:21:17	1732854075444-IMG_3184.png	25000.00	t
53	esdf	ff	3.00	3	2024-11-04 15:35:12	2024-11-13 03:23:12	\N	4.00	t
68	rowler	jajajaja	7888.00	6	2024-11-13 03:11:15	2024-11-13 03:23:12	\N	8800.00	t
28	roti	done	24345.00	6	2024-11-04 01:16:39	2024-11-13 03:23:12	\N	6774.00	t
34	ksdjfl	kl	87.00	6	2024-11-03 19:36:06	2024-11-13 03:23:12	\N	34.00	t
35	jo	jo	56.00	6	2024-11-04 06:54:50	2024-11-13 03:23:12	\N	55.00	t
36	tse	oj	67.00	6	2024-11-04 07:00:19	2024-11-13 03:23:12	\N	67.00	t
40	n	bm	43.00	6	2024-11-04 07:23:47	2024-11-13 03:23:12	\N	34.00	t
5	Brownies Matcha	Brownies dengan rasa teh hijau matcha	70000.00	6	2024-10-24 11:27:21	2024-11-13 03:23:12	\N	3500000.00	t
6	Brownies Mix 1	Chocochip, kacang almond, keju dan oreo	5500000.00	6	2024-10-30 13:29:04	2024-11-13 03:23:12	\N	4000000.00	t
9	minuman matcha	testing	15000000.00	6	2024-11-02 07:30:09	2024-11-13 03:23:12	\N	10000000.00	t
24	oi	uoi	780000.00	6	2024-11-03 15:07:29	2024-11-13 03:23:12	\N	780000.00	t
38	lk	j	8.00	6	2024-11-04 07:12:02	2024-11-13 03:23:12	\N	87.00	t
39	k	k	66.00	6	2024-11-04 07:23:13	2024-11-13 03:23:12	\N	7.00	t
41	khh	kj	8.00	6	2024-11-04 14:24:44	2024-11-13 03:23:12	\N	7.00	t
43	kjh	k	8.00	6	2024-11-04 07:27:08	2024-11-13 03:23:12	\N	87.00	t
11	cooffee	iwueyri	12000.00	6	2024-11-02 07:33:13	2024-11-13 03:23:12	\N	5000.00	t
45	kjh	k	87.00	6	2024-11-04 14:31:40	2024-11-13 03:23:12	\N	987.00	t
44	iu	yiu	87.00	6	2024-11-04 07:27:57	2024-11-13 03:23:12	\N	87.00	t
1	Brownies Original	Brownies klasik dengan rasa cokelat yang kuat.	45555.00	6	2024-10-24 11:27:21	2024-11-13 03:23:12	\N	3500000.00	t
17	testing	w	32320000.00	6	2024-11-03 06:59:46	2024-11-13 03:23:12	\N	23330000.00	t
7	qwerty	qwertyuiop	60000.00	6	2024-10-30 13:32:05	2024-11-13 03:23:12	\N	35000.00	t
47	uy	yu	78.00	6	2024-11-04 14:36:04	2024-11-13 03:23:12	\N	87.00	t
3	Brownies Kacang	Brownies dengan taburan kacang almond di atasnya	6000000.00	6	2024-10-24 11:27:21	2024-11-13 03:23:12	\N	3500000.00	t
15	kjh	kjh	344500.00	6	2024-11-02 07:44:00	2024-11-13 03:23:12	\N	3300.00	t
16	tes	jn	876600.00	6	2024-11-02 07:45:19	2024-11-13 03:23:12	\N	78800.00	t
8	Brownies Mix 2	Chocochip, oreo, kismis dan keju	5500.00	6	2024-10-30 14:24:50	2024-11-13 03:23:12	\N	4000.00	t
20	testin	2344	87.00	6	2024-11-03 14:48:08	2024-11-13 03:23:12	\N	86.00	t
14	jhkjHK	kjhw	6700.00	6	2024-11-02 07:42:28	2024-11-13 03:23:12	\N	76700.00	t
4	Brownies Red Velvet	Brownies dengan rasa khas red velvet.	5000000.00	6	2024-10-24 11:27:21	2024-11-13 03:23:12	\N	3500000.00	t
48	lkj	lkj	98.00	6	2024-11-04 14:38:17	2024-11-13 03:23:12	\N	9.00	t
49	lk	lk	9.00	6	2024-11-04 14:44:23	2024-11-13 03:23:12	\N	88.00	t
23	iuy	uyt	765.00	6	2024-11-03 15:06:50	2024-11-13 03:23:12	\N	576.00	t
42	uoi	uoi	88.00	6	2024-11-04 14:26:04	2024-11-13 03:23:12	\N	4.00	t
29	kalaaa	kjhkj	755.00	6	2024-11-04 01:21:47	2024-11-13 03:23:12	\N	984.00	t
13	teig	kjhk	15000.00	6	2024-11-02 07:41:14	2024-11-13 03:23:12	\N	5000.00	t
10	Mocha	Mocha lembut	34000.00	6	2024-11-02 07:32:21	2024-11-13 03:23:12	\N	12500.00	t
50	QWERTYUIOP	BBQ	5.00	6	2024-11-04 15:05:07	2024-11-13 03:23:12	\N	65.00	t
22	dfdfgd	dfgdfgd	45000.00	6	2024-11-03 15:05:50	2024-11-13 03:23:12	\N	34000.00	t
21	dskfhj	jh	5.00	6	2024-11-03 14:48:24	2024-11-13 03:23:12	\N	56.00	t
52	ooooo	o	8.00	6	2024-11-04 22:33:44	2024-11-13 03:23:12	\N	9.00	t
32	asdsdfs	jhj	78.00	0	2024-11-03 19:26:54	2024-11-30 04:37:19	\N	8.00	f
18	testing2	uwowww	100000.00	6	2024-11-03 07:01:58	2024-11-13 03:23:12	\N	55000.00	t
55	oalah	k	8.00	6	2024-11-04 17:44:56	2024-11-13 03:23:12	\N	8.00	t
37	kj	kj	34.00	6	2024-11-04 07:05:58	2024-11-13 03:23:12	\N	443.00	t
51	iiu	8\n	7.00	6	2024-11-04 22:30:50	2024-11-13 03:23:12	\N	8.00	t
57	kjh	kj	8.00	6	2024-11-04 17:52:00	2024-11-13 03:23:12	\N	8.00	t
46	i	u98	9.00	6	2024-11-04 21:32:50	2024-11-13 03:23:12	\N	7.00	t
56	jj	j	8.00	6	2024-11-04 17:48:37	2024-11-13 03:23:12	\N	8.00	t
33	bocil	askdjhaskdj	978.00	6	2024-11-03 19:29:32	2024-11-13 03:23:12	\N	3958.00	t
54	DDDDD	jh	87.00	6	2024-11-04 15:36:15	2024-11-13 03:23:12	\N	87.00	t
26	iuqyw	iuy	87600.00	6	2024-11-03 15:18:32	2024-11-13 03:23:12	\N	283700.00	t
12	u	jhk	89344.00	6	2024-11-02 07:37:58	2024-11-13 03:23:12	\N	8888.00	t
25	tesk	jhk	4500.00	6	2024-11-03 15:10:00	2024-11-13 03:23:12	\N	3400.00	t
2	Brownies Keju	Brownies dengan topping keju yang melimpah.	55387.00	6	2024-10-24 11:27:21	2024-11-13 03:23:12	\N	12500.00	t
58	uyt	23	4.00	5	2024-11-05 22:26:04	2024-11-13 03:23:12	\N	6.00	t
59	bnm	bnm	7.00	7	2024-11-05 22:29:55	2024-11-13 03:23:12	\N	7.00	t
60	wel	welll	90.00	7	2024-11-05 22:37:08	2024-11-13 03:23:12	\N	87.00	t
61	klj	lk	8.00	8	2024-11-05 22:39:41	2024-11-13 03:23:12	\N	98.00	t
63	iu	ui	98.00	8	2024-11-05 23:22:10	2024-11-13 03:23:12	\N	9.00	t
64	lk	87	8.00	7	2024-11-05 23:25:04	2024-11-13 03:23:12	\N	78.00	t
65	s	yiu	78.00	7	2024-11-05 23:29:41	2024-11-13 03:23:12	\N	8.00	t
66	towswe	wewewe	98.00	9	2024-11-05 23:45:02	2024-11-13 03:23:12	\N	8.00	t
67	ioi	ioi	89.00	8	2024-11-05 23:53:00	2024-11-13 03:23:12	\N	98.00	t
31	xcvsdf	bool	87.00	0	2024-11-04 09:06:25	2024-11-13 03:23:12	\N	234.00	f
30	welll	very welll	17500.00	0	2024-11-04 01:57:55	2024-11-13 03:23:12	\N	9000.00	f
19	123	12345	20000000.00	1	2024-11-03 13:41:33	2024-11-28 09:20:51	1732760450900-Untitled.png	10000000.00	t
62	barang saya	sembakoku	100000.00	1	2024-11-05 22:43:00	2024-11-30 04:09:02	\N	56500.00	t
27	aaaaaaa	aaaaaaa	35000.00	0	2024-11-03 17:48:36	2024-11-30 04:37:19	\N	20000.00	f
\.


--
-- Data for Name: m_tools; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.m_tools (tool_id, tool_name, tool_description, purchase_date, price, quantity, created_at, updated_at, available) FROM stdin;
2	Oven	Oven untuk memanggang adonan brownies	2023-12-15	3000000.00	1	2024-10-29 16:35:22	2024-10-29 16:35:22	t
4	Timbangan Digital	Timbangan untuk mengukur bahan secara akurat	2024-01-25	150000.00	2	2024-10-29 16:35:22	2024-10-29 16:35:22	t
3	Mixer	Mixer untuk mengaduk adonan brownies	2024-01-20	500000.00	1	2024-10-29 16:35:22	2024-11-17 02:52:14	f
1	Loyang Brownies	Loyang khusus untuk memanggang brownies	2024-01-10	25000.00	5	2024-10-29 16:35:22	2024-11-17 02:52:14	f
6	Sendok Takar	Sendok untuk mengukur bahan dalam takaran kecil	2024-03-01	10000.00	5	2024-10-29 16:35:22	2024-11-17 02:52:35	f
5	Spatula	Spatula untuk mengaduk dan meratakan adonan	2024-02-05	15000.00	3	2024-10-29 16:35:22	2024-11-17 02:53:00	t
8	well	\N	\N	\N	8	2024-11-17 02:54:06	2024-11-17 02:54:06	t
7	Mangkuk Adonan	Mangkuk besar untuk mencampur adonan	2024-02-07	20000.00	3	2024-10-29 16:35:22	2024-11-17 02:55:04	f
\.


--
-- Data for Name: t_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_order_items (order_item_id, order_id, product_id, quantity, price, created_at, updated_at) FROM stdin;
1	1	1	2	50000.00	2024-10-26 14:21:27	2024-10-26 14:21:27
2	2	2	1	55000.00	2024-10-26 14:21:27	2024-10-26 14:21:27
3	3	3	3	60000.00	2024-10-26 14:21:27	2024-10-26 14:21:27
4	4	4	1	65000.00	2024-10-26 14:21:27	2024-10-26 14:21:27
5	5	5	2	70000.00	2024-10-26 14:21:27	2024-10-26 14:21:27
\.


--
-- Data for Name: t_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.t_orders (order_id, order_code, customer_name, created_at, updated_at) FROM stdin;
1	ORD-2024-0001	Budi Santoso	2024-10-24 11:27:11	2024-10-26 14:21:27
2	ORD-2024-0002	Siti Nurhaliza	2024-10-24 11:27:11	2024-10-26 14:21:27
3	ORD-2024-0003	Andi Pratama	2024-10-24 11:27:11	2024-10-26 14:21:27
4	ORD-2024-0004	Dewi Anggraini	2024-10-24 11:27:11	2024-10-26 14:21:27
5	ORD-2024-0005	Rizky Maulana	2024-10-24 11:27:11	2024-10-26 14:21:27
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, age, created_at, updated_at, username, password) FROM stdin;
1	Alice	25	2024-10-26 17:32:20	2024-11-26 04:47:30	admin1	$2b$10$yQifnpQPexGByg/rpcGWAedLUCZ3V99kElbXfqKoHRFufw5E3UP4i
4	Diana	28	2024-10-26 17:32:20	2024-11-26 04:53:41	admin4	$2b$10$A97Y.NSvQ6Ocx6BmogqYGumWnaiK8nJFpyYjcgtWKjcyjqd04DAEi
5	Ethan	22	2024-10-26 17:32:20	2024-11-26 04:53:41	admin5	$2b$10$BOLPLjVaTpzICYscO2oiqervfjChkkDNapdk9rd7LH8CQ8OffiINu
3	Charlie	35	2024-10-26 17:32:20	2024-11-26 04:53:41	admin3	$2b$10$3ytMfnoUz7xmgVJdBjK3tOihTUGzJAIbZ6MFiQOUgz80z9Iy1UWIW
2	Bob	30	2024-10-26 17:32:20	2024-11-30 08:59:54	tiaramiyauw	$2b$10$jsvlmlilkSclxLik0k7N0OC8mAT8fRSRu8hE6wiNawXq1Uu34u32K
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

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 5, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 5, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_product_id_seq', 69, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


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
-- PostgreSQL database dump complete
--

