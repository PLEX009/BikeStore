use  bikestore;


-- Inserción de 15 productos
INSERT INTO productos (nombre, descripcion, precio_unitario, categoria, marca, imagen, entradas, salidas, saldo, limite, stock, fecha_registro) VALUES
('Trek X-Caliber 8', 'Bicicleta de montaña de alto rendimiento con cuadro de aluminio y suspensión delantera de 100mm.', 1299.99, 'Montaña', 'Trek', 'https://example.com/trek-xcaliber.jpg', 10, 0, 10, 20, 10, NOW()),
('Specialized Allez', 'Bicicleta de ruta ligera y ágil, perfecta para carreras y entrenamiento.', 899.99, 'Ruta', 'Specialized', 'https://example.com/specialized-allez.jpg', 8, 0, 8, 15, 8, NOW()),
('Giant Escape 2', 'Bicicleta urbana versátil para desplazamientos diarios y paseos recreativos.', 599.99, 'Urbana', 'Giant', 'https://example.com/giant-escape.jpg', 12, 0, 12, 25, 12, NOW()),
('Cannondale Quick Neo', 'Bicicleta eléctrica con motor de 250W y batería de 500Wh para largos recorridos.', 2499.99, 'Eléctrica', 'Cannondale', 'https://example.com/cannondale-quick.jpg', 5, 0, 5, 10, 5, NOW()),
('Canyon Grail 7', 'Bicicleta de gravel con geometría cómoda y versátil para todo tipo de terrenos.', 1799.99, 'Gravel', 'Canyon', 'https://example.com/canyon-grail.jpg', 7, 0, 7, 15, 7, NOW()),
('Mongoose Legion', 'BMX profesional con cuadro de acero cromoly y componentes duraderos.', 399.99, 'BMX', 'Mongoose', 'https://example.com/mongoose-legion.jpg', 15, 0, 15, 30, 15, NOW()),
('Schwinn Discover', 'Bicicleta de paseo con comodidad y estilo para recorridos urbanos.', 449.99, 'Paseo', 'Schwinn', 'https://example.com/schwinn-discover.jpg', 10, 0, 10, 20, 10, NOW()),
('Cervelo P-Series', 'Bicicleta de triatlón con aerodinámica optimizada y geometría de rendimiento.', 2999.99, 'Triatlón', 'Cervelo', 'https://example.com/cervelo-pseries.jpg', 4, 0, 4, 8, 4, NOW()),
('Ridley X-Trail', 'Bicicleta de ciclocross con excelente manejo en terrenos técnicos.', 1899.99, 'Ciclocross', 'Ridley', 'https://example.com/ridley-xtrail.jpg', 6, 0, 6, 12, 6, NOW()),
('Santa Cruz Nomad', 'Bicicleta de enduro con suspensión de 170mm para descensos extremos.', 3499.99, 'Enduro', 'Santa Cruz', 'https://example.com/santacruz-nomad.jpg', 3, 0, 3, 6, 3, NOW()),
('Bianchi Pista', 'Bicicleta de pista con diseño minimalista y componentes de alta calidad.', 999.99, 'Pista', 'Bianchi', 'https://example.com/bianchi-pista.jpg', 8, 0, 8, 16, 8, NOW()),
('Surly Long Haul Trucker', 'Bicicleta de touring diseñada para viajes de larga distancia con carga.', 1299.99, 'Touring', 'Surly', 'https://example.com/surly-trucker.jpg', 5, 0, 5, 10, 5, NOW()),
('Commencal Supreme', 'Bicicleta de downhill con suspensión de 200mm para competencias.', 3999.99, 'Downhill', 'Commencal', 'https://example.com/commencal-supreme.jpg', 3, 0, 3, 6, 3, NOW()),
('Salsa Mukluk', 'Fat bike con neumáticos de 4.8 pulgadas para nieve y arena.', 1999.99, 'Fat Bike', 'Salsa', 'https://example.com/salsa-mukluk.jpg', 4, 0, 4, 8, 4, NOW()),
('Co-Motion Periscope', 'Bicicleta tándem de alta calidad para dos personas.', 4999.99, 'Tándem', 'Co-Motion', 'https://example.com/comotion-periscope.jpg', 2, 0, 2, 4, 2, NOW());

select * from productos;

ALTER TABLE productos 
MODIFY COLUMN descripcion varchar(200);

