CREATE DATABASE  IF NOT EXISTS `bikestore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bikestore`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: bikestore
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Montana'),(2,'Ruta'),(3,'Urbana'),(4,'Electrica'),(5,'BMX'),(6,'infaltil');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id_compra` int NOT NULL AUTO_INCREMENT,
  `fecha_compra` datetime DEFAULT NULL,
  `total` varchar(10) DEFAULT NULL,
  `estado` varchar(20) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_compra`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `compras_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,'2025-04-08 16:19:58','1500000','Enviado',2),(2,'2025-04-08 16:19:58','150000','Enviado',18),(3,'2025-04-08 16:19:58','6199000','Pendiente',17),(4,'2025-04-08 16:19:58','5700000','Pendiente',11),(5,'2025-04-08 16:19:58','4499000','Enviado',10),(6,'2025-04-08 16:19:58','720000','Pendiente',9);
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_compra`
--

DROP TABLE IF EXISTS `detalle_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_compra` (
  `id_det_comp` int NOT NULL AUTO_INCREMENT,
  `cantidad` varchar(10) DEFAULT NULL,
  `precio_unitario` varchar(10) DEFAULT NULL,
  `sub_total` varchar(10) DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `id_compra` int DEFAULT NULL,
  PRIMARY KEY (`id_det_comp`),
  KEY `id_producto` (`id_producto`),
  KEY `id_compra` (`id_compra`),
  CONSTRAINT `detalle_compra_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`),
  CONSTRAINT `detalle_compra_ibfk_2` FOREIGN KEY (`id_compra`) REFERENCES `compras` (`id_compra`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_compra`
--

LOCK TABLES `detalle_compra` WRITE;
/*!40000 ALTER TABLE `detalle_compra` DISABLE KEYS */;
INSERT INTO `detalle_compra` VALUES (6,'2','3000000','3699000',21,3),(7,'6','13000000','15699000',16,6),(8,'11','2800000','4500000',19,4),(9,'5','5744400','1038000',26,2),(10,'1','7130000','8600000',29,2);
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
  `nombre` varchar(30) DEFAULT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `precio_unitario` varchar(10) DEFAULT NULL,
  `marca` varchar(30) DEFAULT NULL,
  `imagen` blob,
  `entradas` varchar(10) DEFAULT NULL,
  `salidas` varchar(10) DEFAULT NULL,
  `saldo` varchar(10) DEFAULT NULL,
  `limite` varchar(10) DEFAULT NULL,
  `stock` varchar(10) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `id_categoria` int DEFAULT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `id_categoria` (`id_categoria`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (16,'Trek X-Caliber 8','Bicicleta de montaña de alto rendimiento con cuadro de aluminio y suspensión delantera de 100mm.','1299.99','Trek',_binary 'https://example.com/trek-xcaliber.jpg','10','0','10','20','10','2025-04-08 14:46:34',NULL),(17,'Specialized Allez','Bicicleta de ruta ligera y ágil, perfecta para carreras y entrenamiento.','899.99','Specialized',_binary 'https://example.com/specialized-allez.jpg','8','0','8','15','8','2025-04-08 14:46:34',NULL),(18,'Giant Escape 2','Bicicleta urbana versátil para desplazamientos diarios y paseos recreativos.','599.99','Giant',_binary 'https://example.com/giant-escape.jpg','12','0','12','25','12','2025-04-08 14:46:34',NULL),(19,'Cannondale Quick Neo','Bicicleta eléctrica con motor de 250W y batería de 500Wh para largos recorridos.','2499.99','Cannondale',_binary 'https://example.com/cannondale-quick.jpg','5','0','5','10','5','2025-04-08 14:46:34',NULL),(20,'Canyon Grail 7','Bicicleta de gravel con geometría cómoda y versátil para todo tipo de terrenos.','1799.99','Canyon',_binary 'https://example.com/canyon-grail.jpg','7','0','7','15','7','2025-04-08 14:46:34',NULL),(21,'Mongoose Legion','BMX profesional con cuadro de acero cromoly y componentes duraderos.','399.99','Mongoose',_binary 'https://example.com/mongoose-legion.jpg','15','0','15','30','15','2025-04-08 14:46:34',NULL),(22,'Schwinn Discover','Bicicleta de paseo con comodidad y estilo para recorridos urbanos.','449.99','Schwinn',_binary 'https://example.com/schwinn-discover.jpg','10','0','10','20','10','2025-04-08 14:46:34',NULL),(23,'Cervelo P-Series','Bicicleta de triatlón con aerodinámica optimizada y geometría de rendimiento.','2999.99','Cervelo',_binary 'https://example.com/cervelo-pseries.jpg','4','0','4','8','4','2025-04-08 14:46:34',NULL),(24,'Ridley X-Trail','Bicicleta de ciclocross con excelente manejo en terrenos técnicos.','1899.99','Ridley',_binary 'https://example.com/ridley-xtrail.jpg','6','0','6','12','6','2025-04-08 14:46:34',NULL),(25,'Santa Cruz Nomad','Bicicleta de enduro con suspensión de 170mm para descensos extremos.','3499.99','Santa Cruz',_binary 'https://example.com/santacruz-nomad.jpg','3','0','3','6','3','2025-04-08 14:46:34',NULL),(26,'Bianchi Pista','Bicicleta de pista con diseño minimalista y componentes de alta calidad.','999.99','Bianchi',_binary 'https://example.com/bianchi-pista.jpg','8','0','8','16','8','2025-04-08 14:46:34',NULL),(27,'Surly Long Haul Trucker','Bicicleta de touring diseñada para viajes de larga distancia con carga.','1299.99','Surly',_binary 'https://example.com/surly-trucker.jpg','5','0','5','10','5','2025-04-08 14:46:34',NULL),(28,'Commencal Supreme','Bicicleta de downhill con suspensión de 200mm para competencias.','3999.99','Commencal',_binary 'https://example.com/commencal-supreme.jpg','3','0','3','6','3','2025-04-08 14:46:34',NULL),(29,'Salsa Mukluk','Fat bike con neumáticos de 4.8 pulgadas para nieve y arena.','1999.99','Salsa',_binary 'https://example.com/salsa-mukluk.jpg','4','0','4','8','4','2025-04-08 14:46:34',NULL),(30,'Co-Motion Periscope','Bicicleta tándem de alta calidad para dos personas.','4999.99','Co-Motion',_binary 'https://example.com/comotion-periscope.jpg','2','0','2','4','2','2025-04-08 14:46:34',NULL),(31,'Bmx8 8','Bicicleta de cross ','1399000','Trek',_binary 'https://example.com/trek-xcaliber.jpg','10','0','10','20','10','2025-04-08 15:20:07',1);
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `Nombre_rol` varchar(30) DEFAULT NULL,
  `permisos` varchar(30) DEFAULT NULL,
  `nombre_modulos` varchar(30) DEFAULT NULL,
  `aceptacion_m` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador','si','productos','Habilitado'),(2,'Cliente','No','catalogo','habilitado');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `telefono`
--

DROP TABLE IF EXISTS `telefono`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `telefono` (
  `id_telefono` int NOT NULL AUTO_INCREMENT,
  `num_tel` varchar(12) DEFAULT NULL,
  `id_usuario` int DEFAULT NULL,
  PRIMARY KEY (`id_telefono`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `telefono_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `telefono`
--

LOCK TABLES `telefono` WRITE;
/*!40000 ALTER TABLE `telefono` DISABLE KEYS */;
INSERT INTO `telefono` VALUES (1,'3173348436',1),(2,'3106754321',2),(3,'3115419272',3),(4,'3236926352',3),(5,'3182938422',1);
/*!40000 ALTER TABLE `telefono` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `identificacion` varchar(14) DEFAULT NULL,
  `contrasena` varchar(30) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `id_rol` int DEFAULT NULL,
  PRIMARY KEY (`id_usuario`),
  KEY `id_rol` (`id_rol`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`id_rol`) REFERENCES `rol` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Wisner Martinez','wisnermartinez10@gmail.com','1064486315','12','2025-04-08 15:56:42',1),(2,'Jose Asprilla','JoseAsprill@gmail,com','111222332','23','2025-04-08 15:56:42',2),(3,'Roy Arenas','RoyComeArena23@gmail.com','1043665743','12','2025-04-08 15:56:42',1),(4,'Ana Martínez','ana.martinez@bikestore.com','ADM001','admin123','2025-04-08 16:09:22',1),(5,'Carlos Rojas','carlos.rojas@bikestore.com','ADM002','admin123','2025-04-08 16:09:22',1),(6,'Lucía Gómez','lucia.gomez@bikestore.com','ADM003','admin123','2025-04-08 16:09:22',1),(7,'Javier Torres','javier.torres@bikestore.com','ADM004','admin123','2025-04-08 16:09:22',1),(8,'María López','maria.lopez@gmail.com','CLI001','cliente123','2025-04-08 16:09:22',2),(9,'Pedro Ramírez','pedro.ramirez@hotmail.com','CLI002','cliente123','2025-04-08 16:09:22',2),(10,'Laura Fernández','laura.fernandez@yahoo.com','CLI003','cliente123','2025-04-08 16:09:22',2),(11,'Juan Pérez','juan.perez@gmail.com','CLI004','cliente123','2025-04-08 16:09:22',2),(12,'Camila Salazar','camila.salazar@gmail.com','CLI005','cliente123','2025-04-08 16:09:22',2),(13,'Esteban Castro','esteban.castro@outlook.com','CLI006','cliente123','2025-04-08 16:09:22',2),(14,'Valentina Ruiz','valentina.ruiz@gmail.com','CLI007','cliente123','2025-04-08 16:09:22',2),(15,'Daniel Gómez','daniel.gomez@yahoo.com','CLI008','cliente123','2025-04-08 16:09:22',2),(16,'Sara Mendoza','sara.mendoza@gmail.com','CLI009','cliente123','2025-04-08 16:09:22',2),(17,'Andrés Herrera','andres.herrera@hotmail.com','CLI010','cliente123','2025-04-08 16:09:22',2),(18,'Diana Cárdenas','diana.cardenas@gmail.com','CLI011','cliente123','2025-04-08 16:09:22',2);
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

-- Dump completed on 2025-04-08 16:45:44
