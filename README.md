# Dulce Esencia

E-commerce demostrativo de pastelería artesanal, desarrollado como proyecto universitario para JavaScript Avanzado. Incluye catálogo, promociones, cuentas de demostración, carrito y registro de pedidos de prueba.

## Tecnologías

- Angular 22.2.2 con componentes standalone.
- TypeScript.
- Bootstrap 5.3.8 y estilos propios.
- JSON Server 0.17.4 para simular la API del catálogo y los pedidos.
- `HttpClient` y RxJS para consumir la API REST.
- npm 11.13.0 como administrador de paquetes del proyecto.

Las versiones indicadas coinciden con `package-lock.json`. `package.json` declara rangos semver para Angular y Bootstrap.

## Requisitos previos e instalación

Se requiere Node.js compatible con Angular 22 y npm. Desde la carpeta raíz del proyecto, instala las dependencias:

```bash
npm install
```

## Ejecución local

Angular y JSON Server deben ejecutarse simultáneamente en **terminales separadas**.

### Opción A: scripts del proyecto

Terminal 1, API:

```bash
npm run start:api
```

Este script ejecuta JSON Server 0.17.4 sobre `db.json` en el puerto 3000.

Terminal 2, aplicación Angular:

```bash
npm start
```

### Opción B: comandos de CLI

Terminal 1, API:

```bash
npx json-server --watch db.json
```

En JSON Server 0.17.4, el puerto predeterminado es 3000, el mismo que usa la aplicación. Este comando no fija el puerto explícitamente; si el puerto 3000 no está disponible, configura `--port 3000` o usa el script de la opción A.

Terminal 2, Angular CLI:

```bash
ng serve
```

`ng serve` requiere que Angular CLI esté disponible en el PATH. El proyecto instala Angular CLI localmente; si el comando no se reconoce, usa `npx ng serve` o `npm start`.

Direcciones locales:

- Aplicación: <http://localhost:4200>
- Productos: <http://localhost:3000/productos>
- Pedidos: <http://localhost:3000/pedidos>

La URL base de la API está definida como `http://localhost:3000` en `src/app/core/services/api.config.ts`. JSON Server debe estar activo para cargar el catálogo y registrar pedidos.

## Catálogo, promociones y pedidos

`db.json`, ubicado en la raíz, contiene las colecciones `productos` y `pedidos`. Cada producto incluye `id`, `nombre`, `imagen`, `categoria`, `precio` y `stock`; `descripcion` y `oferta` también pueden aparecer. Ejemplo:

```json
{
  "id": 1,
  "nombre": "Torta de chocolate",
  "imagen": "/images/pastel-chocolate.jpg",
  "categoria": "Tortas",
  "precio": 65,
  "stock": 12,
  "oferta": { "tipo": "porcentaje", "porcentaje": 10 }
}
```

Las imágenes están en `public/images`. Las promociones se definen en los datos del catálogo e incluyen descuentos porcentuales y ofertas 2x1.

`ProductoService` consume `GET http://localhost:3000/productos`. `PedidoService` registra pedidos con `POST http://localhost:3000/pedidos`. El checkout vuelve a consultar el catálogo y valida el stock antes de registrar el pedido. JSON Server guarda el registro en `pedidos` y le asigna un identificador.

El carrito es compartido y persistente en el navegador. El checkout permite comprar como invitado y registra los datos del cliente, entrega, productos, total y estado pendiente. Este proyecto no procesa pagos y JSON Server no descuenta automáticamente el stock del catálogo.

## Cuentas y autenticación de demostración

Las siguientes credenciales están configuradas en `src/app/core/services/auth.service.ts` y se validan con los métodos de autenticación simulada existentes:

**Administrador** — usar en Login:

- Correo: `admin@dulceesencia.com`
- Contraseña: `AdminDulce123!`

**Cliente** — usar en Mi Cuenta:

- Correo: `cliente@dulceesencia.com`
- Contraseña: `Dulce123!`

La sesión se guarda en LocalStorage. El guard de rutas permite entrar a `/dashboard` únicamente al rol `admin`; un visitante o un usuario cliente es redirigido al Home. El cierre de sesión elimina la sesión guardada.

La autenticación se ejecuta en el frontend y es solo para demostración académica. No es un mecanismo seguro para proteger un sistema de producción.

## Estructura principal

```text
src/app/
  core/
    guards/       # Protección de rutas
    models/       # Modelos TypeScript
    services/     # Autenticación, productos, pedidos y carrito
  pages/          # Home, Productos, Ofertas, Tienda, Contacto, Mi Cuenta, Login y Dashboard
  shared/
    components/   # Navbar y Footer reutilizables
  app.routes.ts   # Rutas de la aplicación
db.json           # Datos para JSON Server
public/images/    # Imágenes del catálogo
```

La ruta desconocida muestra la página 404. El formulario de Contacto valida los campos y presenta una confirmación local; no envía ni almacena mensajes en un backend.

## Funcionalidades

- Catálogo dinámico con búsqueda por nombre, filtro por categoría, precios en soles, stock y estados de carga, error y resultados vacíos.
- Ventanas de detalle de productos, páginas de Ofertas, Tienda, Home y Dashboard.
- Promociones porcentuales y 2x1.
- Carrito persistente, validación de stock, checkout como invitado y registro de pedidos mediante JSON Server.
- Acceso simulado diferenciado por roles, persistencia de sesión, cierre de sesión y protección administrativa del Dashboard.
- Formulario de Contacto con validaciones y confirmación local.

## Pruebas manuales recomendadas

Esta lista sirve como guía de comprobación; no afirma que las pruebas se hayan ejecutado.

1. Inicia ambos servidores y recorre Home, Productos, Ofertas, Tienda, Contacto, Mi Cuenta, Login, Dashboard y la ruta 404.
2. En Productos, verifica carga desde la API, búsqueda, filtros, detalles, imágenes, precios y stock. Detén JSON Server para revisar los estados de error y reintento disponibles.
3. Inicia sesión como administrador, actualiza el navegador para revisar la persistencia y comprueba el acceso al Dashboard. Cierra sesión e intenta volver a `/dashboard`.
4. Inicia sesión como cliente desde Mi Cuenta e intenta acceder a `/dashboard`; debe redirigirte al Home.
5. En Tienda y Carrito, agrega productos, cambia cantidades, elimina líneas, revisa persistencia y prueba exceder el stock.
6. Completa el checkout como invitado. Prueba delivery con y sin dirección y recojo; después verifica el pedido en la colección `pedidos` de `db.json`.
7. Detén JSON Server durante un intento de compra y comprueba el manejo de error y la conservación del carrito. Confirma que el pedido no se registra si falla la comprobación del catálogo.
8. En Contacto y Login, prueba campos vacíos, formatos inválidos, errores y envíos correctos. Recuerda que Contacto solo confirma localmente.
9. Prueba el botón flotante de WhatsApp y revisa las páginas en escritorio, tablet y móvil.

## Compilación

Para generar la compilación de producción:

```bash
npm run build
```

## Despliegue

El proyecto todavía no tiene un despliegue de producción configurado ni una URL pública documentada. La API está configurada para `localhost:3000`; para que un frontend publicado cargue productos y registre pedidos, sería necesario desplegar y configurar una API accesible desde producción. El hosting también debe dirigir las rutas de Angular hacia `index.html`.
