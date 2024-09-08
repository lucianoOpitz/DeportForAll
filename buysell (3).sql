-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-09-2024 a las 17:01:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `buysell`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `idCart` int(255) NOT NULL,
  `idUser` int(255) NOT NULL,
  `idProduct` int(255) NOT NULL,
  `cantidad` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `carrito`
--

INSERT INTO `carrito` (`idCart`, `idUser`, `idProduct`, `cantidad`) VALUES
(223, 13, 45, 1),
(224, 13, 43, 1),
(225, 13, 41, 1),
(226, 2, 44, 1),
(227, 2, 42, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `idCategories` int(255) NOT NULL,
  `name` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`idCategories`, `name`) VALUES
(1, 'Camperas'),
(2, 'Remeras'),
(3, 'Pantalones'),
(4, 'Calzado'),
(5, 'Medias'),
(6, 'Accesorios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compras`
--

CREATE TABLE `compras` (
  `idCompra` int(255) NOT NULL,
  `idVendedor` int(255) NOT NULL,
  `idComprador` int(255) NOT NULL,
  `idProduct` int(255) NOT NULL,
  `nameProduct` varchar(120) NOT NULL,
  `cantidad` int(120) NOT NULL,
  `precio` int(255) NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `compras`
--

INSERT INTO `compras` (`idCompra`, `idVendedor`, `idComprador`, `idProduct`, `nameProduct`, `cantidad`, `precio`, `estado`) VALUES
(92, 1, 13, 42, 'Pantalón neopreno ', 2, 100000, 0),
(93, 1, 13, 45, 'Reloj marca pasos', 2, 90000, 0),
(94, 1, 13, 41, 'Remera manga corta', 2, 30000, 0),
(95, 1, 13, 45, 'Reloj marca pasos', 1, 45000, 0),
(96, 1, 13, 44, 'Medias Largas talle L', 1, 1500, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `direcciones`
--

CREATE TABLE `direcciones` (
  `idDireccion` int(255) NOT NULL,
  `idUser` int(255) NOT NULL,
  `direccion` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `direcciones`
--

INSERT INTO `direcciones` (`idDireccion`, `idUser`, `direccion`) VALUES
(7, 1, 'Lituania 646'),
(13, 9, 'cabildo 1636'),
(14, 2, 'Berlín 170'),
(16, 3, 'Suipacha 320'),
(17, 1, 'España 430'),
(19, 1, 'Irlanda 333'),
(20, 4, 'Irlanda 4001'),
(40, 13, 'estomba 3580'),
(41, 13, 'RiverSAil 890');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favoritos`
--

CREATE TABLE `favoritos` (
  `idUser` int(255) NOT NULL,
  `idProduct` int(255) NOT NULL,
  `fecha` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `favoritos`
--

INSERT INTO `favoritos` (`idUser`, `idProduct`, `fecha`) VALUES
(13, 45, ''),
(13, 42, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial`
--

CREATE TABLE `historial` (
  `idHistory` int(255) NOT NULL,
  `idUser` int(255) NOT NULL,
  `idProduct` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial`
--

INSERT INTO `historial` (`idHistory`, `idUser`, `idProduct`) VALUES
(227, 1, 40),
(228, 1, 43),
(229, 13, 42),
(230, 13, 45),
(231, 13, 42),
(232, 13, 45),
(233, 13, 44),
(234, 2, 43),
(235, 1, 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `idMensaje` int(255) NOT NULL,
  `idUser` int(255) NOT NULL,
  `idProduct` int(255) NOT NULL,
  `idDestinatario` int(255) NOT NULL,
  `mensaje` varchar(240) NOT NULL,
  `fecha` varchar(60) NOT NULL,
  `idRespuesta` int(255) NOT NULL,
  `visto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`idMensaje`, `idUser`, `idProduct`, `idDestinatario`, `mensaje`, `fecha`, `idRespuesta`, `visto`) VALUES
(235, 0, 42, 1, 'Vendiste Pantalón neopreno ', '5/09/2024', 0, 1),
(236, 0, 41, 1, 'Vendiste Remera manga corta', '5/09/2024', 0, 0),
(237, 0, 45, 1, 'Vendiste Reloj marca pasos', '5/09/2024', 0, 1),
(238, 0, 42, 1, 'Tenes un nuevo mensaje de: lucas', '5/09/2024', 0, 1),
(239, 0, 42, 13, 'Tenes un nuevo mensaje de: Luciano', '5/09/2024', 0, 0),
(240, 0, 45, 13, 'Compraste Reloj marca pasos', '6/09/2024', 0, 0),
(241, 0, 45, 1, 'Vendiste Reloj marca pasos', '6/09/2024', 0, 0),
(242, 0, 44, 1, 'Vendiste Medias Largas talle L', '6/09/2024', 0, 0),
(243, 0, 44, 13, 'Compraste Medias Largas talle L', '6/09/2024', 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajescompras`
--

CREATE TABLE `mensajescompras` (
  `idMsj` int(11) NOT NULL,
  `idCompra` int(255) NOT NULL,
  `msj` varchar(300) NOT NULL,
  `idUser` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mensajescompras`
--

INSERT INTO `mensajescompras` (`idMsj`, `idCompra`, `msj`, `idUser`) VALUES
(23, 92, 'Hola', 13),
(24, 92, 'Hola lucas', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ofertas`
--

CREATE TABLE `ofertas` (
  `idOfer` int(255) NOT NULL,
  `name` varchar(60) NOT NULL,
  `numeroOferta` int(255) NOT NULL,
  `tipo` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ofertas`
--

INSERT INTO `ofertas` (`idOfer`, `name`, `numeroOferta`, `tipo`) VALUES
(1, 'Sin Oferta', 1, 'sin'),
(2, '3 cuotas sin interes', 3, 'sInteres'),
(3, '6 cuotas sin interes', 6, 'sInteres'),
(4, '12 cuotas sin interes', 12, 'sInteres'),
(5, '10% de desc.', 10, 'desc'),
(6, '30% de desc.', 30, 'desc'),
(7, '50% de desc.', 50, 'desc');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `idProduct` int(255) NOT NULL,
  `name` varchar(60) NOT NULL,
  `cantidad` int(255) NOT NULL,
  `description` varchar(300) NOT NULL,
  `estado` int(1) NOT NULL,
  `publicado` int(1) NOT NULL,
  `categoria` int(255) NOT NULL,
  `idUser` int(255) NOT NULL,
  `price` int(100) NOT NULL,
  `idOfer` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`idProduct`, `name`, `cantidad`, `description`, `estado`, `publicado`, `categoria`, `idUser`, `price`, `idOfer`) VALUES
(40, 'Camperas Hombre Nike', 10, 'Buenisimas', 1, 1, 1, 1, 30000, 0),
(41, 'Remera manga corta', 18, 'Las mejores del mercado', 1, 1, 2, 1, 15000, 0),
(42, 'Pantalón neopreno ', 28, 'Especial para Sufers', 1, 1, 3, 1, 50000, 0),
(43, 'AirMax', 25, 'Buenisimas', 0, 1, 4, 1, 45000, 5),
(44, 'Medias Largas talle L', 34, 'Marca pirulo por par', 1, 1, 5, 1, 3000, 7),
(45, 'Reloj marca pasos', 57, 'Para medir los km que haces', 1, 1, 6, 1, 45000, 0),
(46, 'Gorros Adidas', 100, 'Perfectos para correr en invierno', 1, 1, 6, 1, 5000, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idUser` int(255) NOT NULL,
  `name` varchar(60) NOT NULL,
  `secondName` varchar(60) NOT NULL,
  `mail` varchar(120) NOT NULL,
  `dni` int(60) NOT NULL,
  `codePostal` varchar(60) NOT NULL,
  `telefon` varchar(60) NOT NULL,
  `userName` varchar(60) NOT NULL,
  `userPass` varchar(120) NOT NULL,
  `direccion` varchar(120) NOT NULL,
  `reputacionBuy` int(2) NOT NULL,
  `reputacionSell` int(2) NOT NULL,
  `barrio` varchar(300) NOT NULL,
  `saldo` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idUser`, `name`, `secondName`, `mail`, `dni`, `codePostal`, `telefon`, `userName`, `userPass`, `direccion`, `reputacionBuy`, `reputacionSell`, `barrio`, `saldo`) VALUES
(1, 'Luciano', 'Opitz', 'opitz.luciano.et21.24@gmail.com', 42998323, '2453', '01130471002', 'luchOpitz', 'ȜɉǯȈȫõúǥȺȃ', 'Av Libertador 923', 5, 5, 'Capital Federal', 3367000),
(2, 'fede', 'giunta', 'Fedefiunta200@gmail.com', 42997212, '350', '1130461021', 'Fede', 'ȜɉǯȈȫõúǪȫǯǥ', 'Bilbao 2210', 0, 0, 'Urquiza', 0),
(3, 'Juan', 'Carlos', 'juanka@gmail.com', 23560851, '1230', '1130568923', 'HolaJuanCarlos', 'ȜɉǯȈȫõúǪȫǯǥ', 'España 290', 0, 0, 'Villa carlos Paz', 631500),
(4, 'Mariana', 'Fillow', 'marianmagia@gmail.com', 23450065, '2301', '1130579003', 'Mariana', 'ȜɉǯȈȫõúǪȫǯǥ', 'Estomba 3580', 0, 0, 'Saavedra', 1542000),
(7, 'Mariana', 'Saitta', 'marianmagia@gmail.com', 23470048, '1430', '11 3041-3580 ', 'Marsaitta30', 'õēõð', 'Estomba 3580', 0, 0, 'Saavedra', 0),
(9, 'Lara', 'Opitz', 'Laracopitz@gmail.com', 4135887, '1430', '1134202981', 'LaraC', 'ȜǥɎǥǯǥ', 'Palermo 360', 0, 0, 'Coglhan', 315000),
(13, 'lucas', 'ingra', 'pcflamaa@gmail.com', 45678932, '1130', '304569872', 'lucasinga', 'ȜɉǯȈȫõúǪȫǯǥ', 'Lituania 4570', 0, 0, 'Urquiza', 5470000);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`idCart`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`idCategories`);

--
-- Indices de la tabla `compras`
--
ALTER TABLE `compras`
  ADD PRIMARY KEY (`idCompra`);

--
-- Indices de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  ADD PRIMARY KEY (`idDireccion`);

--
-- Indices de la tabla `historial`
--
ALTER TABLE `historial`
  ADD PRIMARY KEY (`idHistory`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`idMensaje`);

--
-- Indices de la tabla `mensajescompras`
--
ALTER TABLE `mensajescompras`
  ADD PRIMARY KEY (`idMsj`);

--
-- Indices de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  ADD PRIMARY KEY (`idOfer`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`idProduct`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `idCart` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=228;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `idCategories` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `compras`
--
ALTER TABLE `compras`
  MODIFY `idCompra` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `direcciones`
--
ALTER TABLE `direcciones`
  MODIFY `idDireccion` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `historial`
--
ALTER TABLE `historial`
  MODIFY `idHistory` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=236;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `idMensaje` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

--
-- AUTO_INCREMENT de la tabla `mensajescompras`
--
ALTER TABLE `mensajescompras`
  MODIFY `idMsj` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `ofertas`
--
ALTER TABLE `ofertas`
  MODIFY `idOfer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `idProduct` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUser` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
