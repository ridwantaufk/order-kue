PGDMP      #                 }            railway    16.4 (Debian 16.4-1.pgdg120+2)    16.0 [    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16384    railway    DATABASE     r   CREATE DATABASE railway WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';
    DROP DATABASE railway;
                postgres    false            �            1255    24577    set_updated_at()    FUNCTION     �   CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD HH24:MI:SS'); 
   RETURN NEW; 
END;
$$;
 '   DROP FUNCTION public.set_updated_at();
       public          postgres    false            �            1255    24578    update_product_availability()    FUNCTION     �   CREATE FUNCTION public.update_product_availability() RETURNS trigger
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
 4   DROP FUNCTION public.update_product_availability();
       public          postgres    false            �            1259    24579    configurations    TABLE     ?  CREATE TABLE public.configurations (
    config_id integer NOT NULL,
    url_backend text NOT NULL,
    port integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url_frontend text NOT NULL
);
 "   DROP TABLE public.configurations;
       public         heap    postgres    false            �            1259    24586    configurations_config_id_seq    SEQUENCE     �   CREATE SEQUENCE public.configurations_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.configurations_config_id_seq;
       public          postgres    false    215            �           0    0    configurations_config_id_seq    SEQUENCE OWNED BY     ]   ALTER SEQUENCE public.configurations_config_id_seq OWNED BY public.configurations.config_id;
          public          postgres    false    216            �            1259    24587    m_costs    TABLE     {  CREATE TABLE public.m_costs (
    cost_id integer NOT NULL,
    cost_name character varying(100) NOT NULL,
    cost_description text,
    amount numeric(10,2) NOT NULL,
    cost_date date,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    active boolean DEFAULT true NOT NULL
);
    DROP TABLE public.m_costs;
       public         heap    postgres    false            �            1259    24595    m_costs_cost_id_seq    SEQUENCE     �   CREATE SEQUENCE public.m_costs_cost_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.m_costs_cost_id_seq;
       public          postgres    false    217            �           0    0    m_costs_cost_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.m_costs_cost_id_seq OWNED BY public.m_costs.cost_id;
          public          postgres    false    218            �            1259    24596    m_ingredients    TABLE     �  CREATE TABLE public.m_ingredients (
    ingredient_id integer NOT NULL,
    ingredient_name character varying(100) NOT NULL,
    quantity numeric(10,2) NOT NULL,
    unit character varying(50),
    price_per_unit numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    available boolean DEFAULT true NOT NULL
);
 !   DROP TABLE public.m_ingredients;
       public         heap    postgres    false            �            1259    24602    m_ingredients_ingredient_id_seq    SEQUENCE     �   CREATE SEQUENCE public.m_ingredients_ingredient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 6   DROP SEQUENCE public.m_ingredients_ingredient_id_seq;
       public          postgres    false    219            �           0    0    m_ingredients_ingredient_id_seq    SEQUENCE OWNED BY     c   ALTER SEQUENCE public.m_ingredients_ingredient_id_seq OWNED BY public.m_ingredients.ingredient_id;
          public          postgres    false    220            �            1259    24603 
   m_products    TABLE     �  CREATE TABLE public.m_products (
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
    DROP TABLE public.m_products;
       public         heap    postgres    false            �            1259    24612    m_tools    TABLE     �  CREATE TABLE public.m_tools (
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
    DROP TABLE public.m_tools;
       public         heap    postgres    false            �            1259    24620    m_tools_tool_id_seq    SEQUENCE     �   CREATE SEQUENCE public.m_tools_tool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.m_tools_tool_id_seq;
       public          postgres    false    222            �           0    0    m_tools_tool_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.m_tools_tool_id_seq OWNED BY public.m_tools.tool_id;
          public          postgres    false    223            �            1259    24621    t_order_items    TABLE     K  CREATE TABLE public.t_order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);
 !   DROP TABLE public.t_order_items;
       public         heap    postgres    false            �            1259    24626    order_items_order_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 4   DROP SEQUENCE public.order_items_order_item_id_seq;
       public          postgres    false    224            �           0    0    order_items_order_item_id_seq    SEQUENCE OWNED BY     a   ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.t_order_items.order_item_id;
          public          postgres    false    225            �            1259    24627    t_orders    TABLE     N  CREATE TABLE public.t_orders (
    order_id integer NOT NULL,
    order_code text NOT NULL,
    customer_name character varying(100) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) NOT NULL
);
    DROP TABLE public.t_orders;
       public         heap    postgres    false            �            1259    24632    orders_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.orders_order_id_seq;
       public          postgres    false    226            �           0    0    orders_order_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.t_orders.order_id;
          public          postgres    false    227            �            1259    24633    products_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 .   DROP SEQUENCE public.products_product_id_seq;
       public          postgres    false    221            �           0    0    products_product_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.products_product_id_seq OWNED BY public.m_products.product_id;
          public          postgres    false    228            �            1259    32774    t_utils_product    TABLE     x   CREATE TABLE public.t_utils_product (
    id integer NOT NULL,
    product_id integer NOT NULL,
    favorite integer
);
 #   DROP TABLE public.t_utils_product;
       public         heap    postgres    false            �            1259    32773    t_utils_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.t_utils_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.t_utils_product_id_seq;
       public          postgres    false    233            �           0    0    t_utils_product_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.t_utils_product_id_seq OWNED BY public.t_utils_product.id;
          public          postgres    false    232            �            1259    24634    users    TABLE     -  CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100),
    age integer,
    created_at timestamp(0) without time zone DEFAULT now(),
    updated_at timestamp(0) without time zone DEFAULT now(),
    username character varying(100) NOT NULL,
    password text NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    24641    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    229            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    230            �            1259    24642 
   v_expenses    VIEW     �  CREATE VIEW public.v_expenses AS
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
    DROP VIEW public.v_expenses;
       public          postgres    false    224    224    224    224    221    221    221    221    219    219    219    217    217            �            1259    32786    visitors    TABLE     �  CREATE TABLE public.visitors (
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
    DROP TABLE public.visitors;
       public         heap    postgres    false            �            1259    32785    visitors_id_seq    SEQUENCE     �   CREATE SEQUENCE public.visitors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.visitors_id_seq;
       public          postgres    false    235            �           0    0    visitors_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.visitors_id_seq OWNED BY public.visitors.id;
          public          postgres    false    234            �           2604    24647    configurations config_id    DEFAULT     �   ALTER TABLE ONLY public.configurations ALTER COLUMN config_id SET DEFAULT nextval('public.configurations_config_id_seq'::regclass);
 G   ALTER TABLE public.configurations ALTER COLUMN config_id DROP DEFAULT;
       public          postgres    false    216    215            �           2604    24648    m_costs cost_id    DEFAULT     r   ALTER TABLE ONLY public.m_costs ALTER COLUMN cost_id SET DEFAULT nextval('public.m_costs_cost_id_seq'::regclass);
 >   ALTER TABLE public.m_costs ALTER COLUMN cost_id DROP DEFAULT;
       public          postgres    false    218    217            �           2604    24649    m_ingredients ingredient_id    DEFAULT     �   ALTER TABLE ONLY public.m_ingredients ALTER COLUMN ingredient_id SET DEFAULT nextval('public.m_ingredients_ingredient_id_seq'::regclass);
 J   ALTER TABLE public.m_ingredients ALTER COLUMN ingredient_id DROP DEFAULT;
       public          postgres    false    220    219            �           2604    24650    m_products product_id    DEFAULT     |   ALTER TABLE ONLY public.m_products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);
 D   ALTER TABLE public.m_products ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    228    221            �           2604    24651    m_tools tool_id    DEFAULT     r   ALTER TABLE ONLY public.m_tools ALTER COLUMN tool_id SET DEFAULT nextval('public.m_tools_tool_id_seq'::regclass);
 >   ALTER TABLE public.m_tools ALTER COLUMN tool_id DROP DEFAULT;
       public          postgres    false    223    222            �           2604    24652    t_order_items order_item_id    DEFAULT     �   ALTER TABLE ONLY public.t_order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);
 J   ALTER TABLE public.t_order_items ALTER COLUMN order_item_id DROP DEFAULT;
       public          postgres    false    225    224            �           2604    24653    t_orders order_id    DEFAULT     t   ALTER TABLE ONLY public.t_orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);
 @   ALTER TABLE public.t_orders ALTER COLUMN order_id DROP DEFAULT;
       public          postgres    false    227    226            �           2604    32777    t_utils_product id    DEFAULT     x   ALTER TABLE ONLY public.t_utils_product ALTER COLUMN id SET DEFAULT nextval('public.t_utils_product_id_seq'::regclass);
 A   ALTER TABLE public.t_utils_product ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    232    233    233            �           2604    24654    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    230    229            �           2604    32789    visitors id    DEFAULT     j   ALTER TABLE ONLY public.visitors ALTER COLUMN id SET DEFAULT nextval('public.visitors_id_seq'::regclass);
 :   ALTER TABLE public.visitors ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    234    235    235            �          0    24579    configurations 
   TABLE DATA           l   COPY public.configurations (config_id, url_backend, port, created_at, updated_at, url_frontend) FROM stdin;
    public          postgres    false    215   �       �          0    24587    m_costs 
   TABLE DATA           z   COPY public.m_costs (cost_id, cost_name, cost_description, amount, cost_date, created_at, updated_at, active) FROM stdin;
    public          postgres    false    217   ��       �          0    24596    m_ingredients 
   TABLE DATA           �   COPY public.m_ingredients (ingredient_id, ingredient_name, quantity, unit, price_per_unit, created_at, updated_at, available) FROM stdin;
    public          postgres    false    219   ̃       �          0    24603 
   m_products 
   TABLE DATA           �   COPY public.m_products (product_id, product_name, description, price, stock, created_at, updated_at, icon, cost_price, available) FROM stdin;
    public          postgres    false    221   ��       �          0    24612    m_tools 
   TABLE DATA           �   COPY public.m_tools (tool_id, tool_name, tool_description, purchase_date, price, quantity, created_at, updated_at, available) FROM stdin;
    public          postgres    false    222   �       �          0    24621    t_order_items 
   TABLE DATA           u   COPY public.t_order_items (order_item_id, order_id, product_id, quantity, price, created_at, updated_at) FROM stdin;
    public          postgres    false    224   s�       �          0    24627    t_orders 
   TABLE DATA           g   COPY public.t_orders (order_id, order_code, customer_name, created_at, updated_at, status) FROM stdin;
    public          postgres    false    226   ?�       �          0    32774    t_utils_product 
   TABLE DATA           C   COPY public.t_utils_product (id, product_id, favorite) FROM stdin;
    public          postgres    false    233   2�       �          0    24634    users 
   TABLE DATA           Z   COPY public.users (id, name, age, created_at, updated_at, username, password) FROM stdin;
    public          postgres    false    229   ��       �          0    32786    visitors 
   TABLE DATA           �   COPY public.visitors (id, ip_address, country, region, city, page_visited, visit_time, user_agent, latitude, longitude, latitude_gps, longitude_gps, location_details_gps) FROM stdin;
    public          postgres    false    235   ͛       �           0    0    configurations_config_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.configurations_config_id_seq', 1, true);
          public          postgres    false    216            �           0    0    m_costs_cost_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.m_costs_cost_id_seq', 7, true);
          public          postgres    false    218            �           0    0    m_ingredients_ingredient_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.m_ingredients_ingredient_id_seq', 8, true);
          public          postgres    false    220            �           0    0    m_tools_tool_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.m_tools_tool_id_seq', 8, true);
          public          postgres    false    223            �           0    0    order_items_order_item_id_seq    SEQUENCE SET     M   SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 112, true);
          public          postgres    false    225            �           0    0    orders_order_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.orders_order_id_seq', 137, true);
          public          postgres    false    227            �           0    0    products_product_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.products_product_id_seq', 72, true);
          public          postgres    false    228            �           0    0    t_utils_product_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.t_utils_product_id_seq', 11, true);
          public          postgres    false    232            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 5, true);
          public          postgres    false    230            �           0    0    visitors_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.visitors_id_seq', 397, true);
          public          postgres    false    234            �           2606    24656 "   configurations configurations_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.configurations
    ADD CONSTRAINT configurations_pkey PRIMARY KEY (config_id);
 L   ALTER TABLE ONLY public.configurations DROP CONSTRAINT configurations_pkey;
       public            postgres    false    215            �           2606    24658    m_costs m_costs_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.m_costs
    ADD CONSTRAINT m_costs_pkey PRIMARY KEY (cost_id);
 >   ALTER TABLE ONLY public.m_costs DROP CONSTRAINT m_costs_pkey;
       public            postgres    false    217            �           2606    24660     m_ingredients m_ingredients_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.m_ingredients
    ADD CONSTRAINT m_ingredients_pkey PRIMARY KEY (ingredient_id);
 J   ALTER TABLE ONLY public.m_ingredients DROP CONSTRAINT m_ingredients_pkey;
       public            postgres    false    219            �           2606    24662    m_tools m_tools_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.m_tools
    ADD CONSTRAINT m_tools_pkey PRIMARY KEY (tool_id);
 >   ALTER TABLE ONLY public.m_tools DROP CONSTRAINT m_tools_pkey;
       public            postgres    false    222            �           2606    24664    t_order_items order_items_pkey 
   CONSTRAINT     g   ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);
 H   ALTER TABLE ONLY public.t_order_items DROP CONSTRAINT order_items_pkey;
       public            postgres    false    224            �           2606    32770    t_orders orders_order_code_key 
   CONSTRAINT     _   ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_order_code_key UNIQUE (order_code);
 H   ALTER TABLE ONLY public.t_orders DROP CONSTRAINT orders_order_code_key;
       public            postgres    false    226            �           2606    24668    t_orders orders_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.t_orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
 >   ALTER TABLE ONLY public.t_orders DROP CONSTRAINT orders_pkey;
       public            postgres    false    226            �           2606    24670    m_products products_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.m_products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);
 B   ALTER TABLE ONLY public.m_products DROP CONSTRAINT products_pkey;
       public            postgres    false    221            �           2606    32779 $   t_utils_product t_utils_product_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.t_utils_product DROP CONSTRAINT t_utils_product_pkey;
       public            postgres    false    233            �           2606    24672    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    229            �           2606    24674    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public            postgres    false    229            �           2606    32794    visitors visitors_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.visitors
    ADD CONSTRAINT visitors_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.visitors DROP CONSTRAINT visitors_pkey;
       public            postgres    false    235            �           2620    24675 #   m_products check_stock_availability    TRIGGER     �   CREATE TRIGGER check_stock_availability BEFORE INSERT OR UPDATE OF stock ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.update_product_availability();
 <   DROP TRIGGER check_stock_availability ON public.m_products;
       public          postgres    false    237    221    221            �           2620    24676 ,   configurations set_updated_at_configurations    TRIGGER     �   CREATE TRIGGER set_updated_at_configurations BEFORE UPDATE ON public.configurations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 E   DROP TRIGGER set_updated_at_configurations ON public.configurations;
       public          postgres    false    215    236            �           2620    24677    m_costs set_updated_at_m_costs    TRIGGER     }   CREATE TRIGGER set_updated_at_m_costs BEFORE UPDATE ON public.m_costs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 7   DROP TRIGGER set_updated_at_m_costs ON public.m_costs;
       public          postgres    false    236    217            �           2620    24678 *   m_ingredients set_updated_at_m_ingredients    TRIGGER     �   CREATE TRIGGER set_updated_at_m_ingredients BEFORE UPDATE ON public.m_ingredients FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 C   DROP TRIGGER set_updated_at_m_ingredients ON public.m_ingredients;
       public          postgres    false    219    236            �           2620    24679     t_orders set_updated_at_m_orders    TRIGGER        CREATE TRIGGER set_updated_at_m_orders BEFORE UPDATE ON public.t_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 9   DROP TRIGGER set_updated_at_m_orders ON public.t_orders;
       public          postgres    false    226    236            �           2620    24680 $   m_products set_updated_at_m_products    TRIGGER     �   CREATE TRIGGER set_updated_at_m_products BEFORE UPDATE ON public.m_products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 =   DROP TRIGGER set_updated_at_m_products ON public.m_products;
       public          postgres    false    221    236            �           2620    24681    m_tools set_updated_at_m_tools    TRIGGER     }   CREATE TRIGGER set_updated_at_m_tools BEFORE UPDATE ON public.m_tools FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 7   DROP TRIGGER set_updated_at_m_tools ON public.m_tools;
       public          postgres    false    222    236            �           2620    24682 *   t_order_items set_updated_at_t_order_items    TRIGGER     �   CREATE TRIGGER set_updated_at_t_order_items BEFORE UPDATE ON public.t_order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 C   DROP TRIGGER set_updated_at_t_order_items ON public.t_order_items;
       public          postgres    false    224    236            �           2620    24683    users set_updated_at_users    TRIGGER     y   CREATE TRIGGER set_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
 3   DROP TRIGGER set_updated_at_users ON public.users;
       public          postgres    false    229    236            �           2606    24684 '   t_order_items order_items_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.t_orders(order_id) ON DELETE CASCADE;
 Q   ALTER TABLE ONLY public.t_order_items DROP CONSTRAINT order_items_order_id_fkey;
       public          postgres    false    3301    226    224            �           2606    24689 )   t_order_items order_items_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.t_order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id);
 S   ALTER TABLE ONLY public.t_order_items DROP CONSTRAINT order_items_product_id_fkey;
       public          postgres    false    221    224    3293            �           2606    32780 /   t_utils_product t_utils_product_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.t_utils_product
    ADD CONSTRAINT t_utils_product_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.m_products(product_id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.t_utils_product DROP CONSTRAINT t_utils_product_product_id_fkey;
       public          postgres    false    233    221    3293            �   t   x�E�I�0@�ur�^������Y�)�*j"w���V_��G�mu�����DO���ܬ�p5�0��:Dt����B�,��_l����.vQ�yW8[y-]á6��K�!x���#�      �   #  x�}Q�n� <���p�.�$#U��P��^��8�X`���w�TQ���=�}��^���g�]��w'�0���oi�O�3�:�鬤��K��4�'mVV)k�?sC�`H.�>��e��m}��.y0sh,q	z*IVm�Z3t'8�z6�g��Җ�.��C����|������c�ݵ0��c��<؀�\+!���rߡXCd��/ ����Qr�ci��u<�,��ޟ�#��k�ߌu�m +�{���sY	4V�E�uv���o��.�c3@F�В��n��﫢(� J��7      �   �   x���=n�0Fg�����l�[�A��ȩ��I!HCo�5
4�r"��{la��~��n���������T�o55R��2���N��� )�0��{�b�!8��\�B���=˭�؇׬�>��-f��21J�geJ�1G�{�ԟ�]N��"�����!D���������+4���V�5��F�t��<@��5?���V#�-��E$���F)u!cn�      �   6  x��Tˎ�0];_�e+��/^^vUU��Z���F8��af&�����h��k���=8���RT�&�0�5�ڃ!�F� �<�=D 
9E���P1�4���矀��!��$Z�vR���S� F�ZRw�NK�-���J���)�+�Wi�Z*���шV�<-l��~�P��<� Ɯ���{�8��c6���?a!�mgޑD�i;I
&�u�<e:� ��s��jEQ�*������
ԍԷ�P1�$�}@�?C�H#3�����x<`$)%ALQD�l�q}��s6ѵd��k嫶Tmo�s���}t�G����+d<!�j�^U��*y!Z�_��\����MމǲU�B�K���I\��V�%��/e��Zdqpm��B��I�m׸!��	S�mu�}�J�lI&���^Wa�����������3(Tk�������됪,!�j��i��~fC���!�
�,�T���4"J"�~�3��R����űN�k�[�l�3��܂Z6�H�s^��&���4U���=z��ɐ�9��SY�9C�{��y�Z��-	��      �   \  x��SMo�0=�_�?@'��r۴��c/�d��c���L��80!~��ދ_������E�J�iʟ����E\WW���T:D�-o�JJ��B��z���X�f�6����1�沯Y��T�!� �vyW���6�D5	b�ڡ��P@3)�g�W�a�}�zX�)�͌�M�Y�C���Q#�ְw>�rq���)���PA�h�<�rwʊ�_����,�׆��/�vM�G�	S���i�hdU�ϸg�KX���6�����w��Y����`;����=b�0v���D兏�Q��Ql��ۄ�V���2u~��s�t�ߛ�gB���,�k�n-"[f��U����      �   �  x��Xۑ�8�&�p�E|�r�ǱjfeK =�����EϦF�10~Rb�b)���	���,ba�Q�)H��1��+��ؤԎ�[��*�z�|�͡2u=f�%YqQ��o�5Ԭ�Z1���,la�M�Ms��z�Ź�2�k�J]�P��8߮����r�n�#J����H��QB)5���Ly�aa�PJ�ӆZf��J�S5�F	Җ�*i�I��Z���u�u��4�����BK;���x�xa�zh�󸠻L��LC޼bJ�>�8,�$*מ/�Z�+��]	�Y����(�fa$Z�=N�A����H���nt\)¦Y	�ilJB��[I=:%�1"�H����	̒z'��Hz�ə��&X�0��8�=�^���(c�d/NˎѠW�F�C/z�,�ac�T����	Ն*J�������Ы��EP��Z�z���Һ�F]�V��*���"�*���QFQ���y�2�Z�\?R;.��ش��K��!�C�ݹm�h���sb�1�Y�\t�bae4�Y��R�-������U��%5,���Ó#�L�,���(�`|�kal�_��g#`xs<�MQ.�����0��M�.#��%k��^�@�L�F�J�}~�Eb�&ǌ�2� d�*��7^o��8�M5�����)Ȳ"B�FP����e���:81���M�\D��U��79zJ��j.�>N� 896�ܺvs|)����ս�yr�0��ٮ�w\�-W��x���Q�E���u��ɸ*{��;11�xd��ͲSeP-� �=�;�7O,FP��=������xKp�)P��D���<��P�̮�:�K;�AG2����ya�5X�Z�K��5yb)�Z���0Ĭ�������,/�,F*&��ar�+���h����vU�㢺�~v�q��'Ff����t��Yab��\�g�C*��6e{��מ#UW���sQWI�Ü<�a6���i�n6��s�0��Z����J�ZJ���,F�0�Tb̳�G���+ʃ���9z�hh]ݿ�,;�Umť[����z�W��Js������]�ku��̋|K�/�Z\Љ:=�G.&F�x[����ٰBu[��a���g���(�b�������s|��+F�xXð��"�!N���a��gȺ�3[-�#��eJ�HTv��=��n�YU��W�ax|��$lF*>X��tX"��>iW�%!d5U<����"�UF�      �   �  x����r������ 5��q�)'vR���*���� ���Q��ߠ$Ni �l��O��>�=��V���O�鵑�)�Ӎ�>T�n�u��2�T�4��v�u��������n��S�&��\4Fi�h�L�ԯNi8�@�֘r̵&�B��UI#���NV�~H��m-l+b+�ͱ�p��#�:G:"���񽾦�>9 /�ek�ͱj�&�h�ѱ�O7�&����c�do�SFY�X+B��O��B�R��cF��g��9Q�Em���z|苧	`J�j�͈���N��+���+���D�ot!J�A!HK2���T�����}?lD>O����6)D��r*�B��q,���0uڠ��f�XK��WX�/�ЗO�V�r̷V^�*wlM��xAS��1=��^��t��Z�����XfM����6BP��n��}	P�R�o���+��
a�o\0���;����0�%E�J\�M��*�,ga�A�ؘ�U���y�5��oU�9vY���VI+t�~Y��Oi�Vp�i��r�|`X�r���T�4�����q���/�Gp�3p�wi�W�K�y�s��eВ3�ΉQ���ʧ�ӭ��*�������X2��y��֊H+�-9Hf�:�-o���;����>����vM�+E�E4��&���w_-~�`����{�^�ǋbN�9Iec0,��+��H�@������HM���g��*�t��c����Q��}�����~7N3������c:�07�0���vO}}�eS����e8�-��9��q���?9w�V|�K̀m}���ӂ"�"��sb�HD�A��? B��Yb`D���4���.���Ę�R��]��١Ocb@�j�����h,�Mh�l��Ut�D����� �܉`�`� �r�h�����<Xq�C��A8�2�ح�X�%ɍy�fd+a��B "�#���4�O���nq���r��\D.�0O�xNa�H�����������Ljxa���"KD�Hm(���W���0w�!8X���"���֏C���ժZ��`�̭d�Z� �Hi�W���h���D�V�x��7~H'�r|���vߎC	G�!��V1C>
���ƕV�~(�V0q{�(9�W��-�}:��+䔿f�̷ �Y�b�>C0�W�d�"�y��P
����S^*֒j�g��c$s(eD=bRݖa���G��̥�30U����~�Kc"Y�Ht���}�����|ߡ:,���\���`zx_�X����T���1�9��V�(r������D]��򊹑
��8������ޥ��������k�A�UE�@�)�h��آe&��(�0���Z�0<���Է����HH�����nu���n��0QJ!y�q��((:Y �Q��K�Y$27҂f��^�6�$�I-Oˑ��|4���\���5���i�!!ub��!���s!�h�HE��j����caJqZͅ��I�6xu�����~W��H�/�f,����Q��基au�?ߧI��f^ԋ,�����]���{M\�)#91"{��nպ[w���I�y�6��{lPe�ԁ�/���ߔd�Gs%h<m0����w��JG�LJQ�I��� e|� ��T3�a�dQkT��������}��1?�t F腙2���� �
�dN�C��Z�sA9�O������SU��M�R���3o��D�n�E��pDb�0&��8V�fFΌ�QXh�P�H��O%�n��m�Ed�^)!��EF����S�y��H�!�d�7���
藪O�P
�	��yViC�j��{,�vv��5[����Z�aY��)y.��͝U�1�D�x�&#��Dz��������OG��}���������!���R���7@�k��u��x*�d��d}D�������=;.8��i#�R��(5��	3�)�Kl���S)�5�<�&e'�L�	�W	�
C���|��
���Pr �^���s�Ig� ;��N�DԱ%e����m]Qx��]�_]~</|�j�����c!M��	��y�ɑQ��9&𕊷��Ǯ��H*�.�Y�E#�:�$�;��rQ&:ǀ�ne:�C��n쮈H�r�&�gD:�zF�j�۾�Bf�XS Qt�4�!��!=og��U69ؠ���"����P��ҡ�흃�m<
1:�:������Z-�;�|*⋏�S�T���i~q�*�pPM�!h2�U?�H݊�wgnQ�c�T0@��aBҕ�| �ܭ"|�l��,Q�m��C�q�n�n!٭9B(	� � ��� �Ht�(����1��tUM\�6�]��H��Ƣ��'G�t�G|��p`
	���0v���j�']">2�QY�H��]��z:^�/��`@�'�
 �|<�HS�<]E��<3w$L���>����s�t9�pT���ࣞNn�����/�f� hNȜ*4T�T�{��p&.Ƣ`���8!�?v��)��� X��
HF2��?��f_�&i����zH�H�~��M���n(�J.�{��CxYX�t������'�0Od$��S �]ݒ<�u҄�N-���G�4SM4��QȀ�v!���Q���12��Ԕ
Hg�ÿ�y�Q��B��u���-������ϐ�u���۸��vxg��a���j+��Wf^�w���1����cO��jz>?Df��ç=r��~�@�_,+R�3���b�NE��&��vǇt߳�=Ly��:��?廣$%n��k���i�TSK��#ː�j*��+��V,A�[��A�X�̗Si!`�oB��zJ�]aN@ڱ��{6���FU5&��&���KT�K�(ɯa�r�MGF� tURO�JR��J�0k|�ϒ�x��Kw|����L����̐��P�	-l'B��>�V���ɼ�8wYiZ��oQTV{i`Hp�m��Y*���G���I���ӄ��Y폿���2��[��.;o�y�t���t��W6Ǘ6,n�e�I�#�vD�N���ݰٞ�����z��ʺ����i�Րo�_��9�������|�$iV���͍֧l�lt�	�\�p>��r��n��s����"k�̯��f-���MЈ)w=]?ן_	ϝN����j,[�P`Q#�㋅S}�?��c�6����Z:��o��V-k�⬨�VS��k�CNy�Y��:�2��htbI�P
	�r��g��U>f����5t�M��J5�r�֭����R�Ǩt����͛7����      �   ?   x��� !��s~1;�ҋ�ױLNyN�*��ͤ˥tHB������ql@3��/o5��z����
�      �   <  x����n�@ ����,ܪ0��!*�D����`������M[���'��%�6F�_�HAvNSsȓ� 3P��c�s�')Zfy���)f0���l�p\��)�k�1Y�u��J�G}c.��o>�׸9T�����0Ή���@�i���"	���r�x3��JO����A,��z��0���,�Q�Z�`�J�������\����.���v�ׅ&�p��8S�<_��R�CUK4��=� ')��a�u���f�%)^�8J�G�}9i&{��v��ȱ���zQ]o��ܥl�O�!h���!=`�9�U�� >&6��      �      x��]�r[7���<�)����@�r��v�3�8ή��TM�\�ı8�I%%��@��dۍCJu$
��#L���sH~���7�a�m�I�kA9!���q�~<�u|���&���t0�QR���觑���j+��W���P��O?�Ƈ�_O��~h�>�YC/X����3�����������dOI������N~ۋWw~�n��3�& - r�/v�~��b0><���R��B:�v|��16/�Ba�Ώ�;/���Ƨ����`:��������2����L������t�~��Z�Z������<|�UR�Y�H��&�����?6����������W�~�o�7�?~<�4|���t�J  �?}�^}��������pz2�����E�j�vt<���o��LG�v½L��%���.ￇC�� �0[!���w�S+�'�H'�tt�\�����R�%��l1�`ĵ<���A�W�� �Ur�kC�*��~��`�ÿyq��,2�Ձ>w:`^��K;� k�o/	/?�b{�ˣ������M�|�go����ŵU�e�;�M��Bi[��U��<rL+����%�� ?�9:���l\��=�"'CW39��A�{p�d��#ɬ��Ų���[i�L��j��;0N��w��7/v���OG���}?���I�
�%+�����g����t2:$�Ϛo�wJ�͗7]ak�	
B+t��=��^TZ8����\Q�_EIج�m!3���y���.l�BG�a���V����y����{����V[�03쌎L$E�n[�L�?tȡ4�K�s�l~\��^�3��%E����4�pp�J�`9^����\-s�*�(�2�B{^��Z�I��d�Ir�і�2U��#>���
��yp9	`��^�d�ul�òMS .f���R=-�f�%/�.'
�u�p�aY���s�j��8�,%���<���d)Q-(a��Ç�7K2� �����.��m�k���V- �nq�Y:�В��<�e�4�َ+��L�FӖw�./tM�F#��c�4�<�Fnl Q<�m�T����_��7��Ҍj�n9R n�J#����PN�n�J3��.��T�%�A���t���,��,�Fp��S\�b�V3���
����C)w����^��rn�9�NR��K1K-ς۪���d����	}�)=��t��<��
oL0�La�&5��9�
�@�,'�� .�0�&��E.��>H��"���A l�>��G"����T��$Qe���vH�2&�֊�.���,c?k�[�6˘�Z)#L����0&�ޓk>Ԇ��3�26Æ�jc�D�<�a@˕�J��!��WZ�Ł�|�e����b�^V��p�;�VhW~q3�j���s���v�0�U^���D��	#\��Y��, 7CB,�@��	��҄�$uM���h�_=V n�NS��A7:]�R#�\��K���t<l�����fi5�k�m@���tܺ�t>K�i2ǤP�G�
���i��Qoʯ.W�Z�+r[��Lv��KO�)�̤����>;����̯��5:����Y�t'&iO�ↇ��5:�__��n��5�_>1�t���3Baqy���N�w�B��1�}��o�,eCp9��ph���f9P&��в���(�9�"�{�!K�d9fLyV�Rj&V�Y<����	��d��?�*���%#_���?ݟ�Wq0m�3�2C����nTo�fS^�z��%, 3T����|�d�nS|�]Mqˁ� ��u|���-C������rII	��k[�p_>X̕�yx���-�o���Ԭ>7�o��ߌa�`˛; Y���3ԛ����o]=��Dk�,��|R�|���d�7��y��Y�5�l�����Ë�a�X�,��H����d�7���Q��*C��VʮEOy}��v�4�u֑����?�0 ��֜�����k�˵\_W�b�h]��LS��B�x
��W*��V�r!
��5����	=��o�
�x�n(����5����ހˤ2T��Y9��AWP*��ñ�hy�>��L�K����YN#���ř*����9ӥ��Yy����E��^�����ތgv����0=+W^��4w��,��L�7r����#l@:d)7�?���-�-�ۻ�����؇���Cr���W9h���gHn��b�J�˻��^/��+�}�[�tx�/���7��K�7N)_��M^:�qƂ.ߓ���D�1���3=����k�ɕ�%�j����k�vۀk������� ��K�״
�ހ8Kn��r�����&w{���X�c=��K�׳�5��3���%�E��#Y������|�����o[]"��g�-_:����&B��-[���ʵ���Hn�2�Kސ/_$����Ռ��6��l�~�x�$���|����K�������f跈W6��LnA��}d`�H�=H�x5l�I'$7!9��,8�����#l���N��k����@�7���/ۿ���CrO�9^��)��x���txɿ�έ��Cr[�9^$����Pr_��d�+R�a6$7������O�,��U��`����"^������"^��(��tKrs���;`���\wrw����f7�}��[��n����E:�����$���"������#^˕}�	K���n*�w��~�{���K�l얥ݴe�|�!�Yʍ�,p7���|r7�o4~U�{Û��t���a�0��L�x��R�߿�M��M�pC��>@4�)�T^ H�N2�V�ـ�ܟ���8Q61���D�]�����ō�W�t��OF����͓F�������������n�d:�ǃq��x�y~25_}�_>9������O��goϦo��ȃ���t��+�t<<��_x	��O{q68z;8=�G'�����5�6�����M�&��������pڼ�Li!O��Ǔ�������[?<\�7{<|"��'ǃH|wL��c��'c�8���i0΄�8����駏���ᐧ��t<89�׏hi|��&'ތx}(k5:E/�|��%f#��QGߜ�e>NNN&��u#�w��f~������{����ڧ���/�:�����?]�d�^<�����`8>���ŀ$���o���p�J�����cs0!@��g����n�����6|��9:=����ђ��������)�<�?��c�=��ǃ�a�p�u>h��ч�����S�I�m�s�N����{/������J/��G�wo'����oE�%_�ڐ��v�${b�O����cg��Oonؚ���C�m�O�~���ns����w���w��¬�a��� <��yzY_��>qv�u7�����缪�_Y��~r����]-����_s����L͓�����ү���?fۋ_��g���G�7��i�-\�\��28��z!�Z�hgo$)5��BPI���g�D�3�i&xfW�,H��ŋ=�-�v������O����i��>����՞:�iq/_�}m�ٗ�`���~��f������%P�;guv���Ei=��!�]���ǜ����RrvW��:�����7�7�4�3I?��l�t�vy��언����⎯��bc�ě}��Л�� �.�¢����O>��F��8B>iT8z���8#�����,~���b�x4��l�q.�V��f<~��3���+q,ɦm
����D"cW8n��zju�iU��^�O����uf�ZcH���U�V��HԪJn��Q�QI��T�)��1��Vx��>_�F�������w� HoԸ��/z����駕�<!CK��+?�1�E;j�9:;9;iHཟ�8�z�~@R��Q����"q2���[x�����v�w���ɨ޼=�����j$^��Ǜ��3���g']�!٩�fsN=������G�B���;����P˹O�{a�����^�ş�CM�>}|8���C�mf�a��� v���\d�=pٱW�=�;��w�U9�M�`�ث!=x�"Я}!=�H��    ��!��8�!�9�g�M�
_lU����w�|�Q 
+�s~F���
@\��r�d���n�iG�=\M;J��gt����jʚv|���:I�@���8%UVŁ�grʍ�;�[���Z#��=b��|$�t5��+�W�O���q���F�Tw�s·��}�F(��g�o��L������k��e�����p���23U{�����C�U�`�Η����=���^�To�GbPZcu��h�f�%њ<��|�������E������z�*�)�l��*�W�W��;ַ��T�3�l�$O��E-�X��*������EUVjڸ6N�[����?�O~ּ��Ǧ��y�߀#��nܫ�������D��\��������8�z6/n�K0~>6�J#`����ȹجe��n+�K�(��m!�y�ϳg`y��V��ln��a�[ApVԊ��!��-����u8=!��I����;"2������Y�s21� zk��r
Pq�R.G������,1�.�|=h���ϲmN��dY�/��+\'�.ҽE���w������}��-�����g�i��n��&���Ԧ�Y�w]�>����9unG{����t��t�f5=����ɬ2�.��ɳ�;f�-���<Q�2se���cf�p+5��OB��1�3��NܚbE��	�u����_�CE��w"����|\�!�x>K'����_�Ϝ�����"��E�}���m��x�_��������H#r���>�U�TR�# Y�{Dk�íSU�TRȿ� �ʄ��1�A�m�]��D�uu�s�k��*��A��U)]�4�D�	����䡯N��j�d��tz[Y��~푰��e��ƵZ?�j���TRݜ�
�Q@dyN�����
�*@� Y� �(�#�y�Zn�]H U�<2�Q�"�vU�TR�� ��f`Hzp�H\>³��j!���x�xo�#&�m���T���_�9?�J�9?�2oK�<���r~�E^i���
4)}U��Wί��tzyq����+��\�rU�@���\5H0k�QY���~My.�~za ��QJ,σ؆��퀑���`��l�-�ڈ�K�oG�ߞ5?>k�����a�Y3?�2�Ehz6��ý�o��k�+h^^Ԏ��������p/0��8%���?�{��?�0��bJ�w8�� 衮\��r�n=P	t۸ғ�D0�� ��]HLzR�	���IS֐`���PC�˧�Uީd�<����˷S�b'#�%]��ịk+�0g=���hS�o�lҳ��L$�e�^'v։�lb�ꚦ�vb�IO�v�^h_��V��,�m,���%�>s��kI+�W��,��Y>#Y��%'�U��,_Y�^X>#�j[���"(����`�&X�5�wέ�FZ�U5�Zê�d�^9��
o6uL���E����fd6=W�z�.]϶XȪ��k+�T����>H�Ϋ���Q�֢�eɚ��'�wlT�̏D��s�w=6��bW��6��yg��T��+�k���9f�5Lx��L�J�(�_jDr5h�\�r�~�(� ����Y7h����$���[�/m�iX;�UƯ��0��aq��V92�{࠷�b}P�������f���5JHY��|��ܵ����2©��V����F1��'�0��$�B�\EUU<�:��A��g�ղ�Z����7Y�B\vM��і�`z�ZAlt�^�l���Ģg��䣀A��+[�@�_���4�c���Y�2맗����.�a���J���ɾ���+�)n_!��c� s�S�Dga6�I/�#1��%�r�ɬ[RW���mn������-�n�q$�&�Mh_%B�U"�{I�^R���@��n���J�*�B"�ך���(�	��e�;����wjx�^�6�Mi�k�p˦�C�#y5��7Lf��;P�5df��D2�ި�!3�6!�iH/}�d��c���EՒVW�YP�F`�B��tge�,i쾳!H&| �+�Z�j��eeS�����^ꅄ��	W�X�� ��m0|e������ļ�Ŝp�e� 3��<p���IT9Imn�d[�9W<�kSӾ�L�Y�Bci��� ������{��Ě
UUU!<z��lj~7���)~���ܭٚ��ٲl�K���c+=�2M��WU}U����]j��c�.~��kmk��
�*���4m<��ސ����
�*�I0�6 O�F�qD�e��jp0�NN���w���S�$&� �q�)��w��:��J�ڝ~#�"�>���b8��UqQ�E���BK����/p�ݬ��1m}\�D�Ebץ�2�E2�[>���j���B�
�5�t�U �2��"��t�z*"����CY�K��d�yr���3T��`��Ԉ��J�Z@錠��$�{�{A��4���Ԉ�ɵ��J�*ݕy��E-��0I��/�#�M��!H�*�W���ӻSE�W����N+m�WI�R)]! �y�7���=䀛N2\^�W��A�r4�j��O�V����ʁu���_�ȿ�D��_#�x>~�	��2�����2�E!�/���=�bM"������xwV'F]�_�Js��HJ�]�:��p�/����	ޅ���Nt,b��DS��c]_e?h��U�~G�h�I��߫~��ݧG�#��_/v
��~��������SM缏 �.>̮*��jt�0e=^U��T��O����ܓM�*ի�_��2�}1z�����GJ2��%�|��ը�xz�\dqc�$�+�å�xe���y,�Y�h�0����r�gby�T���o�KIB����_�Gg�g��l��ҡ�Ÿ���}��$������2e���>� ��?~{e��������CNA�ҭ���gd_�9�E���(P��s�"T�{���	G�qN*�#�H�,qN��sZp��∳�"KN�� QUq��YB��,�)e', N�ht�c�\�V����9bC��G�!}�7-9[q�>�k��c6�8}�+'��@��}<GL�B��BC��!&YA*���l��M�9bT�q�w�J7�:��j#Tyy�U��6Gl�(��J��怑�qy�X�t���|�8�\�g٬Hnko^��]�6U�uRA;c��ޅ� �o�`O��~=�����G��x
x�H�S�W��>S�����3aJ���	S���<a���v����w�@�xC���mf��݄T�%�x��wŽN�r-I��36�β�H�FG��a��$M!Q{���sxb)�Zn`Y ����P�@�U��l�cmF�:.���v4>��Y�||8��	���[�������S�y8�#�E��6��U[�v���yyV�,��{f�ȠC ��W(@���k���}����y�µF	������i�C�F���;`Б��v��ҢJ�j�Z��%��;?���0:�o� 6>����}U~8����凥Ϛ��4�7>:>�{��
��ҳ^g�W�4:�|�88�=>k�<��;����)����믿�w񒠻��8:�p��}�C<$y��yM�Y����m� �����Z<k�@�5�xY�Z3_�>���*��D�4�a%���H����jgt8L�5�]'��K>�������J�p���;�k��ss�䠿|\��O%<���j�N�T�p��<o�x��x]���l\�(�x}^#�Q�\Ώo�+�
2C&��e�-dz�K��"9�`fxI{��d�C�m��>�
��62?�I�I/�{���cA��X�/��Q�����p�ǘ��͐u�#<Tѩ�D�"��-=w-�S_u#z�A�}���.�aM�u��V����x����0�.3�z��p1��-=*���X+��<��Y��K�u9p�Ul!o �σ�F�Pކ0!.i�.��&�(��"}�z@cVP	9T��L����i\�7�J
�סW��+C����|�.6J�0ak��ޗ�&.�$l�%W�.f�%K�H�`��MFq��<D�8\�9ⲁ� �  �pA����R��nȀ���a`=f�Mp�́k�Ą5��p5�5�6CyV�*n��IڻzE+�&*�������MTj\�p���*7Q�up��Ȧ�����"\��,���M�j\�jv--*V�M�j��Z͖7m�R��/n���GG�;%����ޘ`����h0=����A	3@W���(Y|}!P>��ZD�/�CJOj.Zd��)}e�9)$��F�%�?07.�Y]8������=������(9�0y{���ī4�J���;���&g<WJ��`M�Q���(���Bz��q���OT�d5.�� �v�
v�U�.ګB˛�]N�E��9�&�.Յ�n��g�i0��M�]��B\2W��>9dzg�^&Ís5ɧ�EL�&�G&ټ��n��àS����XIu�\�àS�ѩ#��V��I�y�C'�\��m�3ђ�t"p��.����D���p�
�<���vH�1.�8A����m����>��ka����Î��z�R�]��^����ד%���R��	-W��v�:z���.�ڞzB�)�9�K�����5w^��htpcQ�z|�p5{���_�4������FD�*NXgUT)�1�8͙Q�s+����*nNt_D�~E.9�zw��78i�Ľ��+h��G#����h�ht�j�����^3��H[Z�U;����1n�������     