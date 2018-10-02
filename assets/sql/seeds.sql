USE bamazon;

INSERT INTO departments
    (department_name, over_head_costs)
VALUES
("IT",      10500),
("Office",  11000),
("Home",    12000),
("Sports",  10000);

INSERT INTO products 
    (product_name, department_name, price, stock_quantity, product_sales)

-- * curated values for demo purposes
VALUES
    ("iPhone XXV"   , "IT"    , 15000.00, 3    , 15000.00),
    ("Pen"          , "Office", 7.50    , 1000 , 7500    ),
    ("Fork"         , "Home"  , 1.99    , 750  , 1990    ),
    ("Tennis racket", "Sports", 34.99   , 200  , 10497   );

-- VALUES
--     ("iPhone XV"    , "IT"    , 19999.99, 3    , 19999.99),
--     ("Keyboard"     , "IT"    , 25.50   , 100  , 2550    ),
--     ("Monitor"      , "IT"    , 300     , 35   , 12000   ),
--     ("Headphones"   , "IT"    , 199.99  , 50   , 1599.92 ),
--     ("Pen"          , "Office", 7.50    , 1000 , 7500    ),
--     ("Paper"        , "Office", 30      , 200  , 2400    ),
--     ("Pencil"       , "Office", 2.99    , 1000 , 299     ),
--     ("Spoon"        , "Home"  , 1.99    , 500  , 1990    ),
--     ("Fork"         , "Home"  , 1.99    , 750  , 1990    );
--     ("Tennis racket", "Sports", 34.99   , 200  , 10497   ),
--     ("Basketball"   , "Sports", 50      , 300  , 3000    ),
--     ("Shoes"        , "Sports", 50      , 450  , 8000    ),