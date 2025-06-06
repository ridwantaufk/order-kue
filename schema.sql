
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

CREATE TABLE public.t_order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE public.t_orders (
    order_id integer NOT NULL,
    order_code text NOT NULL,
    customer_name character varying(100) NOT NULL,
    created_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) NOT NULL
);


ALTER TABLE public.t_orders OWNER TO postgres;


CREATE TABLE public.t_utils_product (
    id integer NOT NULL,
    product_id integer NOT NULL,
    favorite integer
);


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