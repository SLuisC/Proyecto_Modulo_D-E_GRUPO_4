# Proyecto Web - Módulos D y E (Grupo 4)

## Integrantes
* CABEZAS CEVALLOS LUIS ANTONIO
* VICTORES ANCHUNDIA MABEL ALEJANDRA
* BARCOS MONSERRATE DAYANA LILIBETH
* BERMUDEZ MEDINA KRYSTEL RAQUEL
* JARAMILLO VIVANCO JEAN PAUL
* GONZALEZ FRANCO CARLOS ANDRES

Este repositorio contiene el **núcleo transaccional y administrativo** del MVP (Producto Mínimo Viable) para la comercialización de productos. Como **Grupo 4**, nuestra responsabilidad principal es garantizar la integridad del flujo de ventas y la operatividad del panel administrativo.

## 🚀 Descripción del Proyecto

El sistema permite gestionar de forma segura el ciclo de vida de un pedido, desde la selección en el carrito hasta la validación de pagos, proporcionando a los administradores las herramientas necesarias para la gestión operativa del negocio.

### 📋 Responsabilidades del Módulo (Grupo 4)
### Evidencia del Sistema

Aquí puedes ver el panel administrativo funcionando:

![Panel Administrativo](./assets/dashboard-admin.png)

Y este es el proceso de checkout:

![Checkout](./assets/checkout-pedido.png)

**Módulo D (Ventas y Pedidos):**
* Checkout funcional con validación de stock en tiempo real.
* Registro de pedidos con captura de comprobante de transferencia bancaria.
* Descuento automático de inventario al completar la venta.

**Módulo E (Administración / Backoffice):**
* Visualización y seguimiento de pedidos en tiempo real.
* Lógica de validación de pagos y gestión de estados del pedido.
* Panel de control administrativo integrado.

## 🛠 Tecnologías Utilizadas

* **Frontend:** Next.js (React)
* **Backend:** NestJS
* **Base de Datos:** PostgreSQL
* **Contenedor:** Docker

## ⚙️ Guía de Instalación

### Requisitos previos
* Tener instalado [Docker](https://www.docker.com/) y [Node.js](https://nodejs.org/).

### Pasos para iniciar el entorno

1. **Clonar el repositorio:**
```bash
git clone [https://github.com/SLuisC/Proyecto_Modulo_D-E_GRUPO_4.git](https://github.com/SLuisC/Proyecto_Modulo_D-E_GRUPO_4.git)
cd Proyecto_Modulo_D-E_GRUPO_4
