-- melihat trigger yg digunakan pada tabel
SELECT
    t.tgname AS trigger_name,
    c.relname AS table_name,
    pg_get_triggerdef(t.oid) AS trigger_definition
FROM
    pg_trigger t
JOIN
    pg_class c ON t.tgrelid = c.oid
WHERE
    pg_get_triggerdef(t.oid) LIKE '%set_updated_at%' --gunakan trigger function di global yg diinginkan
    AND c.relkind = 'r';

-- membuat trigger function (global/diluar tabel-tabel)
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP; 
   RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

-- membuat trigger di lingkup tabel menggunakan trigger function
CREATE TRIGGER set_updated_at_m_costs
BEFORE UPDATE ON m_costs
FOR EACH ROW
EXECUTE FUNCTION set_updated_at(); -- trigger function
