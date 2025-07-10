-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: bike_store
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int DEFAULT NULL,
  `fecha_compra` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,2,'2025-06-17 04:20:39',850.00,'en transito'),(2,4,'2025-06-17 04:20:39',1200.00,'en bodega'),(3,5,'2025-06-17 04:20:39',1700.00,'entregado'),(4,6,'2025-06-17 04:20:39',950.00,'en bodega'),(5,7,'2025-06-17 04:20:39',700.00,'en transito'),(6,8,'2025-06-17 04:20:39',1950.00,'entregado'),(7,9,'2025-06-17 04:20:39',600.00,'en bodega'),(8,10,'2025-06-17 04:20:39',350.00,'en transito'),(9,2,'2025-06-17 04:20:39',1300.00,'entregado'),(10,4,'2025-06-17 04:20:39',150.00,'en transito'),(51,43,'2025-07-07 05:40:36',1200.00,'en bodega'),(52,43,'2025-07-07 05:41:24',2550.00,'en bodega'),(53,43,'2025-07-07 05:41:45',2400.00,'en bodega'),(54,43,'2025-07-07 05:42:33',2050.00,'en bodega'),(55,42,'2025-07-07 05:45:25',2050.00,'en bodega'),(56,42,'2025-07-07 05:46:25',2900.00,'en bodega'),(57,26,'2025-07-07 05:48:14',5300.00,'en bodega'),(58,26,'2025-07-07 05:48:37',7000.00,'en tránsito'),(59,42,'2025-07-07 05:57:51',700.00,'en transito'),(60,42,'2025-07-07 05:59:23',1700.00,'entregado'),(61,42,'2025-07-07 06:02:34',1700.00,'en tránsito'),(62,42,'2025-07-07 06:11:46',1200.00,'entregado'),(63,42,'2025-07-07 06:35:30',1700.00,'en bodega'),(64,42,'2025-07-07 06:36:20',1200.00,'en transito'),(65,42,'2025-07-07 06:40:21',1700.00,'en bodega'),(66,42,'2025-07-07 06:50:53',1700.00,'entregado'),(67,42,'2025-07-07 06:53:25',700.00,'en bodega'),(68,42,'2025-07-07 06:55:01',1200.00,'en bodega'),(69,42,'2025-07-07 07:04:32',1700.00,'en bodega'),(70,42,'2025-07-07 07:04:37',1700.00,'en bodega'),(71,26,'2025-07-07 07:04:54',1200.00,'en bodega'),(72,42,'2025-07-07 07:05:07',1200.00,'en bodega'),(73,42,'2025-07-07 07:07:42',700.00,'en bodega'),(74,42,'2025-07-07 07:15:29',850.00,'en bodega'),(75,42,'2025-07-07 07:23:12',1200.00,'en bodega'),(76,42,'2025-07-07 07:40:31',598959.00,'en bodega'),(77,42,'2025-07-07 07:40:59',700.00,'entregado'),(78,42,'2025-07-07 07:41:42',1200.00,'en bodega');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_compra`
--

DROP TABLE IF EXISTS `detalle_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_compra` (
  `id_deta_com` int NOT NULL AUTO_INCREMENT,
  `id_compra` int DEFAULT NULL,
  `id_seguimiento` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_deta_com`),
  KEY `id_compra` (`id_compra`),
  KEY `id_seguimiento` (`id_seguimiento`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_seguimiento`) REFERENCES `seguimiento` (`id_seguimiento`),
  CONSTRAINT `detalle_compra_ibfk_3` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_compra`
--

LOCK TABLES `detalle_compra` WRITE;
/*!40000 ALTER TABLE `detalle_compra` DISABLE KEYS */;
INSERT INTO `detalle_compra` VALUES (2,2,2,2,1,1200.00),(3,3,3,3,1,1700.00),(4,4,4,4,1,950.00),(5,5,5,5,1,700.00),(6,6,6,6,1,1950.00),(8,8,8,8,1,350.00),(9,9,9,9,1,1300.00),(10,10,10,10,1,150.00),(11,51,NULL,2,1,1200.00),(12,52,NULL,1,3,2550.00),(13,53,NULL,2,2,2400.00),(14,54,NULL,2,1,1200.00),(15,54,NULL,1,1,850.00),(16,55,NULL,1,1,850.00),(17,55,NULL,2,1,1200.00),(18,56,NULL,2,1,1200.00),(19,56,NULL,3,1,1700.00),(20,57,NULL,1,2,1700.00),(21,57,NULL,2,3,3600.00),(22,58,NULL,1,2,1700.00),(23,58,NULL,2,3,3600.00),(24,58,NULL,3,1,1700.00),(25,59,NULL,5,1,700.00),(26,60,NULL,3,1,1700.00),(27,61,NULL,3,1,1700.00),(28,62,NULL,2,1,1200.00),(29,63,NULL,3,1,1700.00),(30,64,NULL,2,1,1200.00),(31,65,NULL,3,1,1700.00),(32,66,NULL,3,1,1700.00),(33,67,NULL,5,1,700.00),(34,68,NULL,2,1,1200.00),(35,71,NULL,2,1,1200.00),(36,72,NULL,2,1,1200.00),(37,73,NULL,5,1,700.00),(38,74,NULL,1,1,850.00),(39,75,NULL,2,1,1200.00),(40,76,NULL,21,1,598959.00),(41,77,NULL,5,1,700.00),(42,78,NULL,2,1,1200.00);
/*!40000 ALTER TABLE `detalle_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `metodo_pago`
--

DROP TABLE IF EXISTS `metodo_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodo_pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `id_compra` int DEFAULT NULL,
  `referencia_pago` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `metodo_pago` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado_pago` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pago`),
  KEY `id_compra` (`id_compra`),
  CONSTRAINT `metodo_pago_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `metodo_pago`
--

LOCK TABLES `metodo_pago` WRITE;
/*!40000 ALTER TABLE `metodo_pago` DISABLE KEYS */;
INSERT INTO `metodo_pago` VALUES (1,1,'PAY001','tarjeta crédito',850.00,'completado','2025-06-17 04:21:04'),(2,2,'PAY002','transferencia',1200.00,'completado','2025-06-17 04:21:04'),(3,3,'PAY003','tarjeta débito',1700.00,'pendiente','2025-06-17 04:21:04'),(4,4,'PAY004','tarjeta crédito',950.00,'completado','2025-06-17 04:21:04'),(5,5,'PAY005','nequi',700.00,'completado','2025-06-17 04:21:04'),(6,6,'PAY006','paypal',1950.00,'completado','2025-06-17 04:21:04'),(7,7,'PAY007','pse',600.00,'completado','2025-06-17 04:21:04'),(8,8,'PAY008','tarjeta débito',350.00,'cancelado','2025-06-17 04:21:04'),(9,9,'PAY009','pse',1300.00,'completado','2025-06-17 04:21:04'),(10,10,'PAY010','nequi',150.00,'completado','2025-06-17 04:21:04');
/*!40000 ALTER TABLE `metodo_pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `id_proveedor` int DEFAULT NULL,
  `nom_producto` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `caracteristicas` text COLLATE utf8mb4_general_ci,
  `precio_uni` decimal(10,2) DEFAULT NULL,
  `marca` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagen` text COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usuario_creador` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `entradas` int DEFAULT NULL,
  `salidas` int DEFAULT NULL,
  `limite` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,10,'Bicicleta Urbana Modelo 2','zvc','Marco aluminio, 7 velocidades',850.00,'UrbanBike','Montana','src/assets/uploads/1751579787631-Bicicleta1.jpeg','2025-06-17 04:14:48','2025-07-07 02:36:59','Jose Manuel Asprilla','activo',12,15,5),(2,2,'Bicicleta Montañismo Xtreme','fds','Suspensión doble, 21 velocidade1s',1200.00,'XtremeGear','Carretera','src/assets/uploads/1751578090806-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 02:37:06','Roy Sebastian Arenas','activo',5,60,7),(3,7,'Bicicleta Carretera','2','Carbono, 18 velocidadesg',1700.00,'RoadMax','Urbana','src/assets/uploads/1751591640421-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 03:00:02','Jose Manuel Asprilla','activo',136,5,9),(4,4,'Bicicleta Híbrida',NULL,'Marco mixto, 12 velocidades',950.00,'HybriTech','BMX','src/assets/uploads/1751572642192-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 02:37:14','Jose Manuel Asprilla','activo',0,7,7),(5,5,'Bicicleta Plegable Compact',NULL,'Ruedas pequeñas, plegado rápido',700.00,'FoldGo','Electrica','src/assets/uploads/1751572693553-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 03:02:35','Jose Manuel Asprilla','activo',16,15,1),(6,6,'Bicicleta Eléctrica EcoRider 1',NULL,'Motor 250W, autonomía 50km',1950.00,'EcoRider','Gravel','src/assets/uploads/1751579407190-1751481428813-images.jpeg','2025-06-17 04:14:48','2025-07-07 02:37:44','Jose Manuel Asprilla','activo',0,41,2),(7,7,'Bicicleta BMX Stunt',NULL,'Cuadro reforzado, sin cambios',600.00,'BMXPro','Plegable','src/assets/uploads/1751579416088-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 02:24:56','Jose Manuel Asprilla','inactivo',0,14,3),(8,8,'Bicicleta Infantil','Para niños de 4 a 7 años','Ruedas de apoyo, marco liviano',350.00,'KidsCycle','Infantil','src/assets/uploads/1751598062208-premium_photo-1666672388644-2d99f3feb9f1.jpg','2025-06-17 04:14:48','2025-07-07 02:25:06','Roy Sebastian Arenas','inactivo',53,11,4),(9,9,'Bicicleta Gravel Explorer','Mixta para ruta y tierra','Neumáticos anchos, 14 cambios',1300.00,'GravelX','Accesorios','src/assets/uploads/1751598074527-1751481428813-images.jpeg','2025-06-17 04:14:48','2025-07-07 02:25:13','Wisner Martinez','inactivo',30,6,3),(10,10,'Casco de ciclismo','Accesorio de seguridad','Certificado, talla ajustable',150.00,'SafeRide','Electrica','src/assets/uploads/1751598094298-1751481428813-images.jpeg','2025-06-17 04:14:48','2025-07-07 02:25:39','Wisner Martinez','activo',98,17,10),(21,5,'uouoro',NULL,NULL,598959.00,NULL,'Carretera','src/assets/uploads/1751747479367-principal.png','2025-07-05 20:31:20','2025-07-07 02:40:16',NULL,'activo',649,709,696),(22,5,'213','13123','1321',3123.00,'13123','Montana','src/assets/uploads/1751852741919-Resultado Icfes.png','2025-07-07 01:45:41','2025-07-07 02:34:44',NULL,'activo',130,124,12321312);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `celular` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (2,'CicloMundo','3112223344','info@ciclomundo.com','Av. Carrera 68 #12-34','2025-06-17 04:22:01','2025-07-07 05:47:00','src/assets/uploads/1751867220581-1751660703058-1751481428813-images.jpeg','inactivo'),(4,'UrbanBikes','3104455667','urban@bikes.com','Calle 5 #1-23','2025-06-17 04:22:01','2025-07-07 07:01:37','src/assets/uploads/1751867213057-1751660703058-1751481428813-images.jpeg','inactivo'),(5,'AllBike','3005566778','ventas@allbike.com','Sector comercial #22','2025-06-17 04:22:01','2025-07-07 05:46:46','src/assets/uploads/1751867206875-1751660703058-1751481428813-images.jpeg','activo'),(6,'EcoRide','3006677889','info@ecoride.com','Carrera 7 #20-11','2025-06-17 04:22:01','2025-07-07 05:46:33','src/assets/uploads/1751867193257-1751660703058-1751481428813-images.jpeg','activo'),(7,'AdventureBike','3011122334','ventas@adventure.com','Cra 30 #80-20','2025-06-17 04:22:01','2025-07-07 05:46:23','src/assets/uploads/1751867183786-1751660703058-1751481428813-images.jpeg','activo'),(8,'KidsBike','3022233445','kids@bikes.com','Zona Norte #45','2025-06-17 04:22:01','2025-07-07 05:46:14','src/assets/uploads/1751867174699-1751660703058-1751481428813-images.jpeg','activo'),(9,'GravelGear','3103344556','info@gravelgear.com','Zona 4 #19','2025-06-17 04:22:01','2025-07-07 05:22:20','src/assets/uploads/1751660703058-1751481428813-images.jpeg','inactivo'),(10,'BMXWorld','3124455667','bmx@world.com','Calle 90 #45-67','2025-06-17 04:22:01','2025-07-04 20:41:44','src/assets/uploads/1751660240550-premium_photo-1666672388644-2d99f3feb9f1.jpg','activo');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nom_rol` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Cliente','2025-06-17 04:03:35'),(2,'Administrador','2025-06-17 04:03:35'),(3,'SuperUsuario','2025-06-17 04:03:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguimiento`
--

DROP TABLE IF EXISTS `seguimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento` (
  `id_seguimiento` int NOT NULL AUTO_INCREMENT,
  `estado_envio` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_estado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ubicacion` text COLLATE utf8mb4_general_ci,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id_seguimiento`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguimiento`
--

LOCK TABLES `seguimiento` WRITE;
/*!40000 ALTER TABLE `seguimiento` DISABLE KEYS */;
INSERT INTO `seguimiento` VALUES (1,'Enviado','2025-06-17 04:20:22','Bodega central','Listo para despacho'),(2,'En camino','2025-06-17 04:20:22','Ruta 45','Sin novedades'),(3,'Entregado','2025-06-17 04:20:22','Dirección cliente','Entregado sin inconvenientes'),(4,'Pendiente','2025-06-17 04:20:22','Procesando','Esperando pago'),(5,'Enviado','2025-06-17 04:20:22','Sucursal norte','Listo para envío'),(6,'Entregado','2025-06-17 04:20:22','Cliente recogió','Entrega directa'),(7,'En camino','2025-06-17 04:20:22','Ruta 21','Retraso por clima'),(8,'Pendiente','2025-06-17 04:20:22','Almacén 2','Stock en revisión'),(9,'Enviado','2025-06-17 04:20:22','Bodega central','Salida programada'),(10,'Entregado','2025-06-17 04:20:22','Domicilio','Recibido por familiar');
/*!40000 ALTER TABLE `seguimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_login` (
  `id_login` int NOT NULL AUTO_INCREMENT,
  `num_ident` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_login`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login`
--

LOCK TABLES `user_login` WRITE;
/*!40000 ALTER TABLE `user_login` DISABLE KEYS */;
INSERT INTO `user_login` VALUES (1,'1114239405','1114239405','2025-07-03 22:28:02'),(2,'122','1','2025-06-19 04:55:21'),(6,'11142394021','1','2025-06-19 06:07:32'),(7,'12','1','2025-06-21 00:16:16'),(8,'1','1','2025-07-06 00:43:08'),(9,'1111','1','2025-06-27 16:45:07'),(10,'22','2','2025-06-28 20:58:14'),(11,'1114239422','3003134544Aa!','2025-07-01 06:22:44'),(12,'1114541021','Bikestore24*','2025-07-01 06:29:55'),(13,'1114239407','1114239407Aa!','2025-07-04 19:14:52'),(14,'1114239400','1114239400Aa!','2025-07-04 20:17:26'),(15,'1114239401','1114239401Aa!','2025-07-04 20:21:09'),(16,'1114239403','1114239403Aa!','2025-07-04 20:22:24'),(17,'111456987','21323123Aa!','2025-07-04 21:30:47'),(26,'11145410218','trdfrud','2025-07-04 21:53:21'),(28,'11142394027','13123129','2025-07-05 20:15:45'),(29,'1064486316','Whitajr07*','2025-07-05 21:12:51'),(30,'1114239411','5151412Aa!','2025-07-06 04:08:05'),(31,'111222','Sarea12345*','2025-07-07 03:29:30');
/*!40000 ALTER TABLE `user_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `id_rol` int DEFAULT NULL,
  `nom_com` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_ident` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_ident` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `celular` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_general_ci,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,3,'Wisner Martinez','CC','1064486315','31733123','Calle 1b #12-50','wisnermartinez10@gmail.com','2025-06-17 04:13:10','2025-07-04 22:12:56','activo'),(4,2,'Miguel Sánchez','TI','111222333','3123344556','Transv 3 #12-45','miguel@gmail.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(5,2,'Lucía Pérez','CC','999888777','3134455667','Calle 8 #9-10','lucia@cliente.com','2025-06-17 04:13:10','2025-07-05 20:08:41','activo'),(6,1,'Santiago Mora','CE','223344556','3201122334','Av 30 #45-67','santiago@gmail.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(7,2,'Diana Torres','CC','112233445','3005566778','Calle 50 #10-10','diana@hotmail.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(8,1,'Iván Gómez','TI','667788990','3199988776','Cra 18 #30-20','ivan@live.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(9,2,'Natalia Cárdenas','CC','445566778','3214455667','Diagonal 60 #45-30','natalia@live.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(10,2,'Pedro Jiménez','CE','334455667','3121231234','Calle 100 #20-10','pedro@hotmail.com','2025-06-17 04:13:10','2025-07-04 21:23:36','activo'),(26,2,'Roy Sebastian Arenas Marin','CC','1114239407','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 19:14:52','2025-07-07 05:05:35','activo'),(27,2,'Roy Arenas Marrin','CC','1114239400','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 20:17:26','2025-07-04 21:23:36','activo'),(28,2,'Roy Arenas Marrin','CC','1114239401','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 20:21:09','2025-07-04 21:23:36','activo'),(29,1,'roy sebastian arenas marin','CC','1114239403','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 20:22:24','2025-07-04 21:23:45','inactivo'),(30,1,'roy sebastian arenas marin','CE','111456987','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 21:30:47','2025-07-07 03:36:48','activo'),(34,1,'roy sebastian arenas marin','CC','1114239402','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 21:40:43','2025-07-04 21:40:43','activo'),(39,2,'Natalia Cárdenas','TI','11145410218','3103344556','Calle 100 #20-10','info@gravelgear.com','2025-07-04 21:53:21','2025-07-04 21:53:21','activo'),(41,2,'roy sebastian arenas marin','NIT','11142394027','1231232','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-04 22:12:18','2025-07-04 22:12:18','activo'),(42,1,'Wisner Martinez Martinz Herrera','CC','1064486316','3173348436','Manzana H casa 9','wisnermartinez10@gmail.com','2025-07-05 21:12:51','2025-07-05 21:42:49','activo'),(43,1,'roy sebastian arenas marin',NULL,'1114239411','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-06 04:08:05','2025-07-07 03:36:48','activo'),(44,1,'Sara Sofia Herrera','TI','111222','3166032548','Manzana H casa 9','sara@gmai.com','2025-07-07 03:29:30','2025-07-07 03:34:57','activo');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-07 11:34:25
