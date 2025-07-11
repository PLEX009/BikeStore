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
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,3,'2025-07-07 17:34:39',2400000.00,'entregado'),(9,3,'2025-07-07 19:19:01',980000.00,'en bodega'),(10,2,'2025-07-07 19:19:13',3720000.00,'en bodega'),(11,1,'2025-07-08 05:55:20',1200000.00,'en bodega'),(12,1,'2025-07-08 05:55:26',1200000.00,'en bodega'),(13,4,'2025-07-08 05:57:11',1450000.00,'en bodega'),(14,4,'2025-07-08 05:59:03',1450000.00,'en bodega'),(15,4,'2025-07-08 05:59:19',980000.00,'en bodega'),(16,4,'2025-07-08 16:33:08',1450000.00,'en bodega'),(17,4,'2025-07-08 16:33:26',1200000.00,'en bodega'),(18,4,'2025-07-08 16:35:02',2400000.00,'en bodega'),(19,4,'2025-07-08 17:09:15',980000.00,'en bodega'),(20,4,'2025-07-08 17:58:18',1200000.00,'en bodega'),(21,4,'2025-07-08 19:34:54',12000000.00,'en bodega'),(22,4,'2025-07-08 19:35:01',980000.00,'en bodega'),(23,3,'2025-07-10 04:24:09',1450000.00,'en bodega'),(24,1,'2025-07-10 04:31:25',1450000.00,'en bodega'),(25,1,'2025-07-10 04:31:41',5630000.00,'en bodega'),(26,1,'2025-07-10 04:31:54',11030000.00,'entregado'),(27,2,'2025-07-10 04:31:56',5630000.00,'en transito'),(28,1,'2025-07-10 04:33:40',4350000.00,'entregado'),(29,1,'2025-07-10 04:36:49',4350000.00,'en bodega'),(30,1,'2025-07-10 04:46:11',1450000.00,'en bodega'),(31,1,'2025-07-10 04:56:22',1450000.00,'en bodega'),(32,1,'2025-07-10 05:03:47',9800000.00,'en bodega'),(33,1,'2025-07-10 05:10:22',5800000.00,'en bodega'),(34,1,'2025-07-10 05:10:36',5800000.00,'en bodega'),(35,2,'2025-07-10 05:12:04',5800000.00,'en bodega'),(36,1,'2025-07-10 05:12:29',5800000.00,'en bodega'),(37,1,'2025-07-10 05:13:30',5800000.00,'en bodega'),(38,2,'2025-07-10 05:14:19',5800000.00,'en bodega'),(39,2,'2025-07-10 05:17:07',5800000.00,'en bodega'),(40,1,'2025-07-10 05:17:51',5800000.00,'en bodega'),(41,2,'2025-07-10 05:18:04',5800000.00,'en bodega'),(42,3,'2025-07-10 05:20:32',2900000.00,'en bodega'),(43,3,'2025-07-10 05:36:13',2900000.00,'en bodega'),(44,3,'2025-07-10 05:56:59',2900000.00,'en bodega'),(45,1,'2025-07-10 06:05:10',5800000.00,'en bodega'),(46,1,'2025-07-10 06:05:41',8550000.00,'en bodega'),(47,3,'2025-07-10 06:45:00',3450000.00,'en bodega'),(48,1,'2025-07-10 07:33:24',4800000.00,'en bodega'),(49,3,'2025-07-10 08:08:04',1200000.00,'en bodega'),(50,1,'2025-07-10 08:08:42',1200000.00,'en bodega'),(51,3,'2025-07-10 08:19:01',1200000.00,'en bodega'),(52,9,'2025-07-10 20:40:42',1200000.00,'en bodega'),(53,1,'2025-07-10 20:44:10',1200000.00,'en bodega'),(54,1,'2025-07-10 21:29:46',2400000.00,'en bodega');
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
  `id_producto` int DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id_deta_com`),
  KEY `id_compra` (`id_compra`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`),
  CONSTRAINT `detalle_compra_ibfk_3` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_compra`
--

LOCK TABLES `detalle_compra` WRITE;
/*!40000 ALTER TABLE `detalle_compra` DISABLE KEYS */;
INSERT INTO `detalle_compra` VALUES (1,1,1,2,2400000.00),(2,9,3,1,980000.00),(3,10,4,1,3200000.00),(4,10,10,1,520000.00),(5,14,2,1,1450000.00),(6,15,3,1,980000.00),(7,18,1,2,2400000.00),(8,19,3,1,980000.00),(9,20,1,1,1200000.00),(10,21,1,10,12000000.00),(11,22,3,1,980000.00),(12,23,2,1,1450000.00),(13,24,2,1,1450000.00),(14,25,3,1,980000.00),(15,25,4,1,3200000.00),(16,25,2,1,1450000.00),(17,26,4,1,3200000.00),(18,26,6,1,180000.00),(19,26,7,1,2850000.00),(20,26,9,1,4800000.00),(21,27,2,1,1450000.00),(22,27,3,1,980000.00),(23,27,4,1,3200000.00),(24,28,2,3,4350000.00),(25,29,2,3,4350000.00),(26,30,2,1,1450000.00),(27,31,2,1,1450000.00),(28,32,2,1,1450000.00),(29,32,6,1,180000.00),(30,32,7,1,2850000.00),(31,32,9,1,4800000.00),(32,32,10,1,520000.00),(33,33,2,4,5800000.00),(34,34,2,4,5800000.00),(35,35,2,4,5800000.00),(36,36,2,4,5800000.00),(37,37,2,4,5800000.00),(38,38,2,4,5800000.00),(39,39,2,4,5800000.00),(40,40,2,4,5800000.00),(41,41,2,4,5800000.00),(42,42,2,2,2900000.00),(43,43,2,2,2900000.00),(44,44,2,2,2900000.00),(45,45,2,4,5800000.00),(46,46,7,3,8550000.00),(47,47,15,1,3450000.00),(48,48,1,4,4800000.00),(49,49,1,1,1200000.00),(50,50,1,1,1200000.00),(51,51,1,1,1200000.00),(52,52,1,1,1200000.00),(53,53,1,1,1200000.00),(54,54,1,2,2400000.00);
/*!40000 ALTER TABLE `detalle_compra` ENABLE KEYS */;
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
  `nom_producto` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `caracteristicas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `precio_uni` decimal(10,2) DEFAULT NULL,
  `marca` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagen` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `entradas` int DEFAULT NULL,
  `salidas` int DEFAULT NULL,
  `limite` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_proveedor` (`id_proveedor`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,'Bicicleta Urbana Modelo','Bicileta','Marco aluminio, 7 velocidades',1200000.00,'UrbanBike','Carretera','src/assets/uploads/1751908403619-bici13.png','2025-07-07 17:13:23','2025-07-10 21:29:46','activo',1,11,1),(2,6,'Bicicleta MTB ALPINE 29','Bicicleta de montaña con suspensión delantera, ideal para terrenos irregulares. Cuadro de aluminio reforzado.','Aluminio, 21 velocidades',1450000.00,'AlpineX','Montana','src/assets/uploads/1751913687202-alpine-trail-c2-gloss-black-silver-1-1280913.jpg','2025-07-07 18:41:27','2025-07-10 06:05:10','activo',0,12,5),(3,2,'Bicicleta Urbana ECO-CITY','Ligera, con diseño minimalista para ciudad. Incluye parrilla trasera y luces LED.','Acero, freno de disco mecánico',980000.00,'EcoMotion','Urbana','src/assets/uploads/1751913764535-images (3).jpg','2025-07-07 18:42:44','2025-07-10 05:18:14','activo',0,15,6),(4,10,'Bicicleta Eléctrica XT‑500','Motor de 350W, batería de litio de 36V, ideal para trayectos largos.','Eléctrica, hasta 45 km de autonomía',3200000.00,'Xtreme','Electrica','src/assets/uploads/1751913846615-Hcb1202fdfddb4a2cbeac6425ea5ed81dk.jpg_300x300.avif','2025-07-07 18:44:06','2025-07-07 18:44:06','activo',7,3,2),(5,8,'Bicicleta de Niño FROGGY 16','Bicicleta infantil con ruedas auxiliares desmontables, colores vivos y timbre incluido.','Aro 16\", marco de acero',450000.00,'Froggy','Infantil','src/assets/uploads/1751913923263-images (4).jpg','2025-07-07 18:45:23','2025-07-07 19:05:48','inactivo',18,10,5),(6,3,'Casco MTB PRO-X','Casco de alto rendimiento con ventilación. Certificación europea.','Talla única',180000.00,'ProX','Accesorios','src/assets/uploads/1751915294143-images (7).jpg','2025-07-07 18:46:32','2025-07-07 19:08:14','activo',30,22,10),(7,7,'Bicicleta Gravel StoneRoad','Cuadro liviano y versátil, perfecta para aventura en carretera o tierra.','Aluminio, frenos hidráulicos',2850000.00,'StoneRoad','Gravel','src/assets/uploads/1751914180748-CarbonAll-Roadv2-TeamEdition-27_grande.webp','2025-07-07 18:49:40','2025-07-10 06:05:41','activo',0,5,2),(8,4,'Bicicleta Plegable CITYFLEX 20','Bicicleta compacta, ideal para transporte urbano. Se pliega en 3 pasos.','Cuadro de aluminio, 6 velocidades',1150000.00,'UrbanRide','Urbana','src/assets/uploads/1751914688910-images (5).jpg','2025-07-07 18:55:03','2025-07-07 19:05:30','inactivo',14,6,4),(9,9,'Bicicleta Downhill BEAST 27.5','Suspensión completa, diseñada para descenso en montaña y alta resistencia.','Full Suspension, doble freno hidráulico',4800000.00,'BEAST','BMX','src/assets/uploads/1751914856630-D_NQ_NP_741918-MLM84732474108_052025-O-bicicleta-montana-r29-beast-mtb-11-vel-suspension-de-aire.webp','2025-07-07 19:00:27','2025-07-07 19:00:56','activo',3,1,1),(10,6,'Bicicleta Infantil ROCKET 20','Diseñada para niños de 6 a 9 años. Incluye frenos V-Brake, cubrecadena y diseño llamativo.','Aro 20\", marco de acero, color azul',520000.00,'Rocket','Infantil','src/assets/uploads/1751915088095-ROCKET_2411S_NEGRONARANJA_2500X2500_89f1795c-80cc-462f-b92d-07cf64c933fc.webp','2025-07-07 19:04:22','2025-07-07 19:04:48','activo',15,7,4),(11,10,'Bicicleta MTB Carbon XC-Race 29','Bicicleta de montaña ultraligera de carbono, transmisión SRAM GX Eagle, horquilla RockShox.','Carbono, 12 velocidades, frenos hidráulicos',6200000.00,'XC-Race','Montana','src/assets/uploads/1752125058762-D_NQ_NP_966347-MLA42902599146_072020-O.webp','2025-07-10 05:24:18','2025-07-10 05:24:18','activo',4,2,1),(12,8,'Bicicleta Urbana SmartBike U7','Conectividad Bluetooth, GPS, frenos regenerativos y marco de aluminio.','Eléctrica, conectividad móvil',3950000.00,'SmartBike','Urbana','src/assets/uploads/1752125213717-images.jpg','2025-07-10 05:26:53','2025-07-10 05:26:53','activo',6,3,2),(13,7,'Bicicleta Gravel TERRA GRX','Cuadro de carbono, frenos hidráulicos y transmisión Shimano GRX para gravel y rutas mixtas.','Carbono, doble freno, 11 velocidades',5800000.00,'Terra','Gravel','src/assets/uploads/1752125361224-5309522.avif','2025-07-10 05:29:21','2025-07-10 05:29:21','activo',17,89,10),(14,5,'Bicicleta Downhill Phantom D29','Cuadro de aluminio reforzado, amortiguación total y frenos hidráulicos TRP para descenso extremo.','Full suspension, 29\", 12 velocidades',7200000.00,'Phantom','Plegable','src/assets/uploads/1752125512144-2025_FULL_sender_cfr-team_3655_M180_P02_xbzzz9.avif','2025-07-10 05:31:22','2025-07-10 05:31:52','activo',24,43,7),(15,4,'Bicicleta Eléctrica UrbanRide Futura','Bicicleta plegable eléctrica con batería oculta en el marco, ideal para ciudad.','Batería 36V, motor 250W, plegable',3450000.00,'UrbanBike','Electrica','src/assets/uploads/1752125635561-propel_advpro_disc_tech.jpg','2025-07-10 05:33:55','2025-07-10 06:45:00','activo',11,6,5),(16,9,'Bicicleta Pista AeroSpeed PRO','Cuadro aero, transmisión monoplato, ideal para velocidad en ruta o pista.','Carbono, monoplato',4950000.00,'AeroSpeed','Carretera','src/assets/uploads/1752125879165-images (3).jpg','2025-07-10 05:37:05','2025-07-10 05:37:59','activo',6,3,2),(17,3,'Casco AeroShield MIPS','Casco aerodinámico con tecnología MIPS para protección avanzada contra impactos rotacionales.','Talla M/L, ventilación activa',320000.00,'AeroShield','Accesorios','src/assets/uploads/1752126003714-D_NQ_NP_822419-MCO76913055542_062024-O.webp','2025-07-10 05:40:03','2025-07-10 05:40:03','activo',15,9,1),(18,8,'Maleta para Marco X-Rider','Estuche impermeable para herramientas y celular, se fija al marco.','Cremallera sellada, espacio para pantalla táctil',78000.00,'X-Rider','Accesorios','src/assets/uploads/1752126167542-D_NQ_NP_803368-MCO77149161270_062024-O.webp','2025-07-10 05:42:47','2025-07-10 05:42:47','activo',18,13,3),(19,5,'Porta Caramañola CarbonoFlex','Soporte ultraligero de carbono para caramañola, con diseño ergonómico.','Peso 23 g, compatible universal',45000.00,'CarbonoFlex','Accesorios','src/assets/uploads/1752126273814-D_NQ_NP_614840-MCO72891868694_112023-O.webp','2025-07-10 05:44:33','2025-07-10 05:44:33','activo',30,22,6),(20,8,'Bomba de Aire Portátil AirBoost Pro','Bomba mini de alta presión con manómetro, compatible con válvulas Presta y Schrader.','Presión hasta 120 PSI, cuerpo de aluminio',85000.00,'AirBoost','Accesorios','src/assets/uploads/1752126460419-66a7d1ae8beae3b0305b604ed9fad84b.jpg','2025-07-10 05:46:40','2025-07-10 05:47:40','activo',17,8,4);
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
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `celular` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `logo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'CicloMundo','3129016789','ventas@ciclomundo.com','Calle 9 #37A‑12, Cali','2025-07-07 17:12:56','2025-07-07 18:26:27','src/assets/uploads/1751908429731-logo-ciclo-mundo_c3d16a4a-cf3c-4672-9795-46df555f6aad.webp','activo'),(2,'BiciColombia','3332848000','bicicolombia1@gmail.com','Calle 5 #43‑40, Cali','2025-07-07 18:07:03','2025-07-07 19:21:59','src/assets/uploads/1751911623920-logo-bicicolombia.png','inactivo'),(3,'Giant / Liv','+57 4 3880119','giantcali@hotmail.com','Cra. 66 #10A‑29, Palmira','2025-07-07 18:08:47','2025-07-07 18:30:24','src/assets/uploads/1751913024534-Logo-Giant-Liv-min03.png','activo'),(4,'RidersCo','3103739209 ','contacto@ridersco.com.co','Calle 38AN #4N‑53, Yumbo','2025-07-07 18:11:30','2025-07-07 18:26:52','src/assets/uploads/1751911890010-images.png','activo'),(5,'Cicloscenter','3137222105','info@cicloscenter.com.co','Carrera 8 #11‑19, Palmira','2025-07-07 18:12:51','2025-07-07 18:27:01','src/assets/uploads/1751911971758-images (1).png','activo'),(6,'Bike Depot','602 403 9491','contact@bikedepotcali.com','Cra. 9 #9‑24, Jamundi','2025-07-07 18:17:05','2025-07-07 19:22:07','src/assets/uploads/1751913055627-images (2).jpg','inactivo'),(7,'Biklos','6029589635','ventas@bikloscali.com','Cl. 13 #35A‑01, Bogota','2025-07-07 18:22:34','2025-07-07 18:27:32','src/assets/uploads/1751912554204-images (1).jpg','activo'),(8,'Bike Zone','6028463698','bikezonecali@gmail.com','Cra. 8 Nte. #22‑02, Cali','2025-07-07 18:24:16','2025-07-07 18:26:20','src/assets/uploads/1751912656274-images (3).png','activo'),(9,'River Bike SAS','6028732963','ventas@riverbike.co','Cra. 8 #21‑42, Cali','2025-07-07 18:25:48','2025-07-07 18:25:48','src/assets/uploads/1751912748145-images (4).png','activo'),(10,'Xtreme Total','+57 2 371 3957','info@extremototalcali.co','Cl. 10 #62‑12, Cali','2025-07-07 18:29:47','2025-07-07 18:29:47','src/assets/uploads/1751912987007-xtreme.svg','activo');
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
  `nom_rol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Cliente','2025-06-17 09:03:35'),(2,'Administrador','2025-06-17 09:03:35'),(3,'SuperUsuario','2025-06-17 09:03:35');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_login` (
  `id_login` int NOT NULL AUTO_INCREMENT,
  `num_ident` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_login`),
  KEY `fk_userlogin_usuario` (`id_usuario`),
  CONSTRAINT `fk_userlogin_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_login`
--

LOCK TABLES `user_login` WRITE;
/*!40000 ALTER TABLE `user_login` DISABLE KEYS */;
INSERT INTO `user_login` VALUES (1,'1114239402','1114239402Aa!','2025-07-07 18:36:47',NULL),(2,'1114541020','Asprilla2004E','2025-07-07 18:36:15',NULL),(3,'1064486315','Whitajr07*','2025-07-07 18:37:22',NULL),(4,'1114239405','Valeria2025!','2025-07-10 05:55:35',NULL),(5,'1114239422','TomasVende123$','2025-07-10 05:57:07',NULL),(6,'1145678923','KZalmac3n2024¡','2025-07-10 05:58:27',NULL),(7,'560034567','BikeLoverEsteban&','2025-07-10 06:00:11',NULL),(8,'1012233445','Luisa2025#SV','2025-07-10 06:00:55',NULL),(9,'1114239401','1114239402Aa!','2025-07-10 06:03:22',NULL),(10,'1114541021','Asprilla2004E','2025-07-10 06:22:59',NULL),(11,'1064486314','Whitajr07*','2025-07-10 06:05:50',NULL),(12,'1020304050','DannaVende24=','2025-07-10 06:06:59',NULL),(13,'1089765432','JulianAdmin$25','2025-07-10 06:07:33',NULL),(14,'450012345','CamilaCiclista1','2025-07-10 06:08:07',NULL),(15,'1099887766','MateoBodega24=','2025-07-10 06:08:49',NULL),(16,'1011122233','LorenaSV25!','2025-07-10 06:09:31',NULL),(17,'1114239403','1114239402Aa!','2025-07-10 06:12:08',NULL),(18,'111423655','Arenasmarin345Aa!','2025-07-10 20:42:25',NULL);
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
  `nom_com` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_ident` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `num_ident` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `celular` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,3,'Roy Arenas','CC','1114239402','3003131454','Trasnversal 25 #5e-24','arenasmarin345@gmail.com','2025-07-07 17:13:53','2025-07-10 06:01:22','activo'),(2,3,'Jose Asprilla','CC','1114541020','3013518781','Calle 41 # 84 - 31','chemanuelasprilla@gmail.com','2025-07-07 17:14:50','2025-07-10 04:40:44','activo'),(3,3,'Wisner Martinez','CC','1064486315','3173348436','Carrera 7 #20-11','wisnermartinez10@gmail.com','2025-07-07 17:15:06','2025-07-07 18:34:52','activo'),(4,2,'Valeria Montes','CC','1025487698','3004567891','Calle 42B #85-19','valeria.montes@bikestore.co','2025-07-08 05:22:12','2025-07-10 05:56:57','activo'),(5,2,'Tomás Aguilar','CC','1009876543','3127890034','Carrera 9 #15-40','tomas.aguilar@yahoo.com','2025-07-08 06:54:27','2025-07-10 05:57:21','activo'),(6,2,'Kiara Zambrano','TI','1145678923','3205567890','Calle 87A #65-12','kiara.zambrano@protonmail.com','2025-07-10 05:58:27','2025-07-10 05:58:27','activo'),(7,1,'Esteban Correa','CE','560034567','3013458821','Calle 12 Sur #14-30','esteban.correa@mail.com','2025-07-10 06:00:11','2025-07-10 06:00:11','activo'),(8,1,'Luisa Herrera','CC','1012233445','3184432109','Carrera 45 #30-55','luisa.herrera@icloud.com','2025-07-10 06:00:55','2025-07-10 06:00:55','activo'),(9,1,'Sebastian Marin','CC','1114239401','3003134544','Calle 13 #5-29','sebasarenas345@gmail.com','2025-07-10 06:03:22','2025-07-10 06:03:22','activo'),(10,1,'Manuel Estacio','CC','1114541021','3015964523','Carrera 7 #21-11','josemasprilla@gmail.com','2025-07-10 06:04:16','2025-07-10 06:04:31','activo'),(11,1,'Mario Herrera','CC','1064486314','3103344556','Trasnversal 5 #5a-22','marioherrera10@gmail.com','2025-07-10 06:05:50','2025-07-10 08:09:17','inactivo'),(12,1,'Danna Rincón','CC','1020304050','3109876543','Calle 19 #22-34','danna.rincon@zoho.com','2025-07-10 06:06:59','2025-07-10 06:06:59','activo'),(13,1,'Julián Méndez','CC','1089765432','3112345678','Av. 68 #12-09','julian.mendez@gmx.com','2025-07-10 06:07:33','2025-07-10 06:07:33','activo'),(14,1,'Camila Vallecilla','PAS','450012345','3007788990','Transversal 33 #18-20','camila.vallecilla@fastmail.com','2025-07-10 06:08:07','2025-07-10 06:08:07','activo'),(15,1,'Mateo Linares','CC','1099887766','3132244668','Calle 50 #27-15','mateo.linares@tutanota.com','2025-07-10 06:08:49','2025-07-10 06:08:49','activo'),(16,1,'Lorena Espinosa','CC','1011122233','3165544332','Carrera 10 #70-45','lorena.espinosa@inbox.lv','2025-07-10 06:09:31','2025-07-10 06:09:31','activo'),(17,2,'Roy Marin','CC','1114239403','3003133445','Av. Carrera 43 #122-24','roymarin345@gmail.com','2025-07-10 06:12:08','2025-07-10 06:12:08','activo'),(18,1,'roy sebastian arenas marin',NULL,'111423655','3003134544','trasnersal 25 #5e-24','arenasmarin345@gmail.com','2025-07-10 20:42:25','2025-07-10 20:42:25','activo');
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

-- Dump completed on 2025-07-10 19:01:58
