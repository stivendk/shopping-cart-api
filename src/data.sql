DELETE FROM tbl_items;
DELETE FROM sqlite_sequence WHERE name = 'tbl_items';

DELETE FROM tbl_carts;
DELETE FROM sqlite_sequence WHERE name = 'tbl_carts';

INSERT INTO tbl_items (name, price, stock, date, type, status, url_image) 
VALUES 
('Smartphone', 729000.99, 100, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.pexels.com/photos/14979020/pexels-photo-14979020/free-photo-of-telefono-inteligente-pantalla-telefono-movil-fondo-negro.jpeg'),
('Laptop', 1490000.99, 0, NULL, 'PRODUCT', 'UNAVAILABLE', 'https://images.pexels.com/photos/11982694/pexels-photo-11982694.jpeg'),
('Tablet', 999000.99, 200, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.pexels.com/photos/17803200/pexels-photo-17803200/free-photo-of-tecnologia-tableta-tablet-pastilla.jpeg'),
('Smartwatch', 175000.50, 0, NULL, 'PRODUCT', 'UNAVAILABLE', 'https://images.pexels.com/photos/12564670/pexels-photo-12564670.jpeg'),
('Music Fest 2024', 150000.00, 500, '2024-10-10 18:00:00', 'EVENT', 'AVAILABLE', 'https://images.pexels.com/photos/625644/pexels-photo-625644.jpeg'),
('Tech Expo 2024', 200000.00, 300, '2024-11-01 09:00:00', 'EVENT', 'AVAILABLE', 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg'),
('Winter Gala 2024', 350000.00, 0, '2024-12-20 19:30:00', 'EVENT', 'UNAVAILABLE', 'https://images.pexels.com/photos/2247677/pexels-photo-2247677.jpeg'),
('Spring Concert 2025', 120000.00, 400, '2025-03-15 20:00:00', 'EVENT', 'AVAILABLE', 'https://images.pexels.com/photos/3171837/pexels-photo-3171837.jpeg'),
('Wireless headphones', 89000.99, 150, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.pexels.com/photos/3394651/pexels-photo-3394651.jpeg'),
('Smart speaker', 129000.99, 0, NULL, 'PRODUCT', 'UNAVAILABLE', 'https://img.freepik.com/foto-gratis/dispositivo-digital-altavoz-inteligente-blanco-inalambrico_53876-96821.jpg'),
('Video game console', 2159000.99, 80, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.pexels.com/photos/6962206/pexels-photo-6962206.jpeg'),
('HomeTech Fair', 50000.00, 600, '2025-04-10 09:00:00', 'EVENT', 'AVAILABLE', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e'),
('Future Trends Forum', 180000.00, 0, '2025-03-28 14:00:00', 'EVENT', 'UNAVAILABLE', 'https://images.unsplash.com/photo-1672611850540-b5c6b873fe79'),
('Drone', 669000.99, 120, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.pexels.com/photos/392024/pexels-photo-392024.jpeg'),
('TechSummit 2025', 250000.00, 200, '2025-01-15 10:30:00', 'EVENT', 'AVAILABLE', 'https://images.unsplash.com/photo-1535378917042-10a22c95931a'),
('Virtual reality', 2109000.99, 0, NULL, 'PRODUCT', 'UNAVAILABLE', 'https://img.freepik.com/foto-gratis/casco-realidad-virtual-escritorio_23-2148912813.jpg'),
('3D printer', 5149000.99, 80, NULL, 'PRODUCT', 'AVAILABLE', 'https://images.unsplash.com/photo-1705475025559-ad8efdedc74f'),
('Innovation Expo', 300000.00, 500, '2024-11-30 09:30:00', 'EVENT', 'AVAILABLE', 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1'),
('Robot vacuum cleaner', 579000.99, 0, NULL, 'PRODUCT', 'UNAVAILABLE', 'https://static.tp-link.com/upload/blog/female-feet-rechargeable-vacuum-cleaner_20221130092400w.jpg'),
('Startup Summit', 400000.00, 150, '2025-02-20 18:30:00', 'EVENT', 'AVAILABLE', 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');


INSERT INTO tbl_carts (total, status, createdAt, updatedAt) VALUES (0.00, 'BUY', '2024-09-20 10:30:00', '2024-09-20 10:30:00');