USE bamazon;
SELECT d.department_id AS department_id, 
d.department_name AS department_name,
d.over_head_costs AS over_head_costs,
SUM(p.product_sales) AS product_sales,
(product_sales - over_head_costs) AS total_profit
FROM departments d
LEFT JOIN products p ON d.department_name = p.department_name
GROUP BY department_name
ORDER BY department_id;