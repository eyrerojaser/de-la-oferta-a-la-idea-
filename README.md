# De Idea a Oferta (PWA)

App instalable para convertir una idea, habilidad o negocio en una oferta lista para vender, con IA.

## Qué hay en esta carpeta

| Archivo | Para qué sirve |
|---|---|
| `index.html` | La app completa |
| `manifest.webmanifest` | Nombre, colores e íconos para instalarla |
| `sw.js` | Hace que abra rápido y funcione sin conexión |
| `icons/` | Íconos de la app |
| `netlify/functions/claude.mjs` | Servidor seguro que habla con la IA (aquí vive tu clave) |
| `netlify.toml` | Configuración de Netlify |

## Publicarla (unos 10 minutos)

### 1. Consigue tu clave de la API de Anthropic
1. Entra a https://console.anthropic.com y crea una cuenta.
2. Agrega un método de pago y un límite de gasto mensual (recomendado).
3. En **API Keys**, crea una clave y cópiala. Empieza con `sk-ant-`.

⚠️ Nunca pegues la clave en `index.html` ni la subas a GitHub.

### 2. Sube la carpeta a GitHub
1. En GitHub, crea un repositorio nuevo (puede ser privado), por ejemplo `de-idea-a-oferta`.
2. Toca **Add file → Upload files** y arrastra TODO el contenido de esta carpeta (incluida la carpeta `netlify` y la carpeta `icons`).
3. Toca **Commit changes**.

### 3. Conecta Netlify
1. En Netlify: **Add new site → Import an existing project → GitHub**.
2. Elige tu repositorio. No cambies nada de la configuración de build.
3. Toca **Deploy**.

### 4. Agrega tu clave en Netlify
1. Ve a **Site configuration → Environment variables → Add a variable**.
2. Nombre: `ANTHROPIC_API_KEY`. Valor: tu clave.
3. Ve a **Deploys → Trigger deploy → Deploy site** para que tome la clave.

¡Listo! Abre la dirección que te da Netlify (algo como `tu-app.netlify.app`).

## Protege tu saldo (muy recomendado)

Cada uso de la IA se cobra en tu cuenta de Anthropic. Si publicas el enlace, cualquiera podría usarla.

Agrega en Netlify la variable `APP_ACCESS_CODE` con un código que solo tú (o tus clientes) conozcan. La app lo pedirá una vez la primera vez que alguien use la IA.

## Instalarla en el celular

- **Android (Chrome):** aparece el botón **📲 Instalar app** arriba, o menú ⋮ → *Instalar app*.
- **iPhone (Safari):** botón Compartir → *Agregar a pantalla de inicio*. El botón de la app muestra estos pasos.
- **Computadora (Chrome o Edge):** ícono de instalar en la barra de direcciones.

## Bueno saber

- Mi Proyecto se guarda **en cada dispositivo**. Si cambias de celular, empiezas de nuevo.
- Sin internet funcionan el tablero, el checklist, los prospectos y todo lo ya generado. Las funciones con IA necesitan conexión.
- Opcional: puedes cambiar los modelos con las variables `MODEL_QUICK`, `MODEL_DEFAULT` y `MODEL_COMPLEX`.
- Para actualizar la app, sube los archivos nuevos a GitHub y Netlify la publica sola. Si cambias `sw.js`, sube el número de `VERSION` dentro del archivo.
