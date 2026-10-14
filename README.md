# Dulce Esencia

E-commerce demostrativo de pastelería artesanal, desarrollado como proyecto universitario. Presenta un catálogo de productos, promociones y formularios de demostración con una interfaz inspirada en la identidad de Dulce Esencia.

## Tecnologías

- Angular 22.2.2 con componentes standalone.
- TypeScript.
- Bootstrap 5.3.8 y estilos propios.
- JSON Server 0.17.4 para simular la API del catálogo y el registro de pedidos.
- `HttpClient` y RxJS para consumir los productos.

Las versiones exactas instaladas están fijadas en `package-lock.json`; `package.json` utiliza rangos semver para Angular y Bootstrap. El administrador de paquetes indicado es npm 11.13.0.

## Requisitos previos

- Node.js y npm instalados, compatibles con las versiones de Angular del proyecto.
- Terminal ubicada en la carpeta raíz del proyecto.

Instala las dependencias con:

```bash
npm install
```

## Ejecución local

La aplicación Angular y JSON Server se ejecutan en terminales separadas.

Terminal 1, API simulada:

```bash
npm run start:api
```

Terminal 2, frontend:

```bash
npm start
```

- Frontend: <http://localhost:4200>
- Catálogo REST: <http://localhost:3000/productos>
- Pedidos REST: <http://localhost:3000/pedidos>

El frontend centraliza la URL base `http://localhost:3000` en `src/app/core/services/api.config.ts`. JSON Server debe estar activo para cargar el catálogo y registrar pedidos.

## Datos del catálogo

La base simulada está en `db.json`, en la raíz del repositorio. Contiene una colección `productos`; cada objeto incluye:

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

`id`, `nombre`, `imagen`, `categoria`, `precio` y `stock` son los campos del producto. `precio` y `stock` son números. `oferta` es opcional; los tipos de oferta del modelo son porcentaje y 2x1. Las imágenes del catálogo están bajo `public/images`. Los pedidos nuevos se guardan en la colección `pedidos` de `db.json`.

## Credenciales de demostración

- Usuario: `cliente@dulceesencia.com`
- Contraseña: `Dulce123!`

El login es simulado. La sesión se guarda en LocalStorage del navegador; no hay autenticación contra un servidor.

## Estructura principal

```text
src/app/
  core/
    guards/       # Guard de autenticación
    models/       # Modelos TypeScript
    services/     # AuthService y ProductoService
  pages/          # Home, catálogo, ofertas, tienda, formularios y cuentas
  shared/
    components/   # Navbar y Footer reutilizables
db.json           # Datos para JSON Server
public/images/    # Imágenes servidas por Angular
```

Las rutas están declaradas en `src/app/app.routes.ts`. El guard protege `/dashboard`; las rutas desconocidas se dirigen a la página 404.

## Funcionalidades implementadas

- Catálogo desde `ProductoService`, con búsqueda por nombre, filtro por categoría, precio en soles, stock y estados de carga/error/sin resultados.
- Páginas de Ofertas, Tienda, Home y Dashboard que reutilizan los datos del catálogo.
- Promociones definidas en los datos, incluyendo descuento porcentual y 2x1.
- Formulario de Contacto con validación y confirmación local de demostración; no envía ni almacena mensajes en un backend.
- Carrito compartido y persistente con validación contra el stock actual, checkout para invitados y registro de pedidos mediante `POST http://localhost:3000/pedidos`.
- El pedido guarda fecha ISO, datos de contacto, tipo de entrega, líneas con precio/cantidad/subtotal, total y estado `pendiente`. JSON Server asigna el identificador.
- La confirmación y el vaciado del carrito ocurren únicamente después de una respuesta satisfactoria del POST. No se procesan pagos y el stock no se descuenta automáticamente.
- Login de demostración, persistencia de sesión en LocalStorage, cierre de sesión y protección de Dashboard.
- Pipes Angular para moneda, fecha, mayúsculas y minúsculas.

## Pruebas manuales recomendadas

Estas instrucciones son una lista de comprobación; no representan por sí solas una prueba ejecutada.

1. Inicia ambos servidores y abre el frontend. Confirma que `/productos` muestra el catálogo; prueba búsqueda y filtro juntos. Comprueba que los precios aparecen en PEN.
2. Detén JSON Server y revisa los estados de error y la opción de reintentar en las páginas conectadas al catálogo.
3. En la Tienda, añade varios productos; en Carrito modifica cantidades, revisa subtotales, elimina líneas, vacía y recarga para comprobar persistencia. Intenta superar el stock.
4. Compra como invitado. Prueba delivery con dirección vacía y con dirección válida; prueba recojo sin dirección. Confirma un pedido y revisa `db.json` en `pedidos`.
5. Detén JSON Server para simular un fallo al registrar el pedido. Comprueba que no aparece confirmación y que el carrito se conserva. Haz clic varias veces en confirmar mientras se envía y comprueba que se crea un único pedido.
6. Comprueba el contador del carrito en Navbar y que el Dashboard continúa protegido tras cerrar sesión. Revisa las páginas en escritorio y móvil.
7. En Contacto, prueba validaciones y confirmación. En Login prueba campos vacíos, correo inválido, credenciales incorrectas y las credenciales de demostración. Recorre las rutas y la página 404.

Para compilar:

```bash
npm run build
```

## Despliegue

El proyecto **no tiene un despliegue de producción documentado ni una URL pública configurada en este repositorio**. La API apunta a `localhost:3000`, así que no estará disponible para visitantes de un frontend publicado sin configurar y desplegar una API accesible desde producción. El hosting también debe admitir fallback de rutas SPA hacia `index.html`.
