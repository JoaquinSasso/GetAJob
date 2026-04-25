# FounderQuest

> Convertí la fricción social en XP.

Prototipo SPA para desarrolladores con "Maldición del Constructor". Gamifica los mensajes, los NOs y los pitches para que generar contactos deje de sentirse como un trámite doloroso y empiece a sentirse como farmear XP.

## Qué incluye

- **Dashboard de guerrero** con nivel, barra de XP y contador de rechazos
- **Challenge semanal**: meta fija de 5 NOs por semana con barra de progreso (reset automático los lunes)
- **Pipeline de aliados** con 5 estados, notas y organización
- **Bitácora** con las últimas 10 acciones y mensajes motivadores contextuales
- **Login con Google**, sincronización en tiempo real, reglas de seguridad por usuario

---

# GUÍA DE DEPLOY PASO A PASO

De cero a producción. Mañana mismo usándola.

## Requisitos previos

Necesitás tener instalado:
- **Node.js 20.19+ o 22.12+** (Vite 8 lo requiere). Verificá con `node -v`. Si tenés una versión más vieja, actualizá desde [nodejs.org](https://nodejs.org/) o usá `nvm`.
- **Git** (opcional pero recomendado).
- Una **cuenta de Google** para Firebase.

---

## PARTE 1 — Crear el proyecto React con Vite

### 1.1. Crear el proyecto base

Abrí una terminal en la carpeta donde querés tener el proyecto y ejecutá:

```bash
npm create vite@latest founderquest -- --template react
cd founderquest
npm install
```

Si te pregunta si querés instalar `create-vite`, decí que sí (Y).

### 1.2. Probar que arranca

```bash
npm run dev
```

Abrí el link que te muestra (algo como `http://localhost:5173`). Deberías ver la página de bienvenida de Vite. Cortá con `Ctrl+C` cuando verifiques que anda.

### 1.3. Instalar Tailwind CSS

Tailwind v4 cambió la forma de instalarse. La vía oficial actual es con el plugin de Vite:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Editá `vite.config.js` y agregá el plugin:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

Reemplazá el contenido de `src/index.css` por:

```css
@import "tailwindcss";
```

### 1.4. Instalar Firebase

```bash
npm install firebase
```

### 1.5. Copiar los archivos de FounderQuest

Reemplazá el contenido de `src/` por los archivos de este repo. Debería quedar así:

```
founderquest/
├── src/
│   ├── App.jsx
│   ├── main.jsx              (el que generó Vite, no hace falta tocar)
│   ├── index.css             (con @import "tailwindcss";)
│   ├── styles.css            (el custom terminal-brutalist)
│   ├── lib/
│   │   └── firebase.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useGameData.js
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── Pipeline.jsx
│   │   ├── Bitacora.jsx
│   │   └── WeeklyChallenge.jsx
│   └── data/
│       └── gameConfig.js
├── firestore.rules
├── vite.config.js
└── package.json
```

### 1.6. Asegurar que `main.jsx` importe tu App

Abrí `src/main.jsx` y verificá que quede así:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Probá con `npm run dev` que todo compila. Vas a ver la pantalla de login pero no va a funcionar todavía porque falta configurar Firebase.

---

## PARTE 2 — Crear el proyecto en Firebase Console

### 2.1. Crear el proyecto

1. Andá a [console.firebase.google.com](https://console.firebase.google.com/).
2. Clic en **Add project** / **Agregar proyecto**.
3. Ponele un nombre (ej: `founderquest-juan`). Puede ser cualquier cosa, lo importante es el **Project ID** que Firebase genera debajo — eso no se puede cambiar después.
4. Desactivá Google Analytics (no lo vas a necesitar por ahora, y evita pasos extra).
5. Clic en **Create project**. Esperá que termine.

### 2.2. Habilitar Authentication con Google

1. En el menú lateral izquierdo, clic en **Build → Authentication**.
2. Clic en **Get started**.
3. En la pestaña **Sign-in method**, clic en **Google**.
4. Activá el toggle **Enable**.
5. Poné tu email como "support email".
6. Clic en **Save**.

### 2.3. Crear la base de datos Firestore

1. En el menú lateral, clic en **Build → Firestore Database**.
2. Clic en **Create database**.
3. Elegí la ubicación más cercana a San Juan — recomiendo **southamerica-east1 (São Paulo)** o **us-east1**. Esta elección es permanente.
4. Elegí **Start in production mode** (arrancamos con todo bloqueado y después aplicamos nuestras reglas).
5. Clic en **Create**.

### 2.4. Aplicar las reglas de seguridad

1. Dentro de Firestore, clic en la pestaña **Rules**.
2. Borrá todo lo que haya y pegá el contenido completo del archivo `firestore.rules` de este repo.
3. Clic en **Publish**.

### 2.5. Registrar la app web y obtener credenciales

1. En la pantalla de inicio del proyecto (o en **Project settings** — el ícono de engranaje arriba a la izquierda), bajá hasta **Your apps**.
2. Clic en el ícono `</>` (web).
3. Ponele un nick (ej: `founderquest-web`).
4. **NO** marques "Also set up Firebase Hosting" todavía (lo hacemos desde CLI en la Parte 3).
5. Clic en **Register app**.
6. Firebase te muestra un objeto `firebaseConfig`. **COPIALO TODO**. Se ve así:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "founderquest-juan.firebaseapp.com",
  projectId: "founderquest-juan",
  storageBucket: "founderquest-juan.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 2.6. Pegar las credenciales en el proyecto

Abrí `src/lib/firebase.js` y reemplazá los placeholders con los valores reales del objeto que copiaste.

### 2.7. Probar el login en local

```bash
npm run dev
```

Abrí `http://localhost:5173`, clic en **INICIAR MISIÓN CON GOOGLE**. Debería abrirse el popup de Google, elegís tu cuenta, y deberías entrar al dashboard. Logueá un par de acciones para verificar que se guardan (mirá en Firebase Console → Firestore Database → Data: deberías ver la subcolección `users/{tu-uid}/actions` poblándose en tiempo real).

Si algo no funciona acá, revisá la consola del navegador. El error más común es typo en las credenciales.

---

## PARTE 3 — Deployar a Firebase Hosting

### 3.1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Si te da error de permisos en Linux/Mac, probá con `sudo npm install -g firebase-tools`.

### 3.2. Autenticarte

```bash
firebase login
```

Se abre el navegador, iniciás sesión con la misma cuenta de Google con la que creaste el proyecto.

### 3.3. Inicializar Hosting en el proyecto

Desde la raíz de `founderquest/`:

```bash
firebase init hosting
```

Te va a preguntar varias cosas. Las respuestas correctas:

| Pregunta | Respuesta |
|---|---|
| Are you ready to proceed? | `Y` |
| Please select an option | **Use an existing project** |
| Select a default Firebase project | Elegí `founderquest-juan` (el que creaste) |
| What do you want to use as your public directory? | **`dist`** (muy importante — Vite buildea ahí, no a `public`) |
| Configure as a single-page app? | **`Yes`** |
| Set up automatic builds with GitHub? | `No` (lo podés activar después) |
| File dist/index.html already exists. Overwrite? | `No` |

Esto genera dos archivos: `firebase.json` y `.firebaserc`.

### 3.4. Buildear el proyecto

```bash
npm run build
```

Vite genera la versión optimizada en la carpeta `dist/`.

### 3.5. Deployar

```bash
firebase deploy --only hosting
```

Cuando termina, te da una URL del estilo `https://founderquest-juan.web.app`. **Esa es tu app en producción.** Desde el celular abrís esa URL y ya podés loguearte y usarla.

### 3.6. Autorizar el dominio de producción para Auth

Esto es fácil de olvidar y hace que el login falle silenciosamente:

1. Firebase Console → **Authentication → Settings → Authorized domains**.
2. Verificá que aparezcan `founderquest-juan.web.app` y `founderquest-juan.firebaseapp.com`. Deberían estar por defecto, pero si no, agregalos a mano.

### 3.7. Script de deploy rápido (opcional pero muy recomendado)

Abrí `package.json` y agregá un script en la sección `"scripts"`:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "deploy": "npm run build && firebase deploy --only hosting"
}
```

A partir de ahora, cada vez que quieras subir cambios:

```bash
npm run deploy
```

Un solo comando, 30-60 segundos, cambios en vivo.

---

## PARTE 4 — Usarla desde el celular

1. En el celular, abrí la URL `https://founderquest-juan.web.app`.
2. En Chrome/Safari, usá **"Agregar a pantalla de inicio"** para que quede como una app nativa.
3. Listo. El ícono queda en el home del teléfono y se abre en pantalla completa.

---

## Troubleshooting

**"Permission denied" al leer o escribir en Firestore**
Las reglas de seguridad no se publicaron. Volvé a Firebase Console → Firestore → Rules y dale Publish.

**El login con Google se abre pero vuelve sin loguearse**
El dominio no está en la lista de Authorized domains (paso 3.6).

**`npm run build` falla**
Node muy viejo. Actualizá a 20.19+ o 22.12+.

**Firebase deploy sube al dominio pero la página queda en blanco**
Casi siempre es que el `public directory` en `firebase.json` quedó como `public` en vez de `dist`. Editá `firebase.json` a mano y volvé a deployar.

**Cambio algo y no veo el cambio en producción**
Olvidaste hacer `npm run build` antes del deploy. Usá el script `npm run deploy` que ya hace los dos pasos.

---

## Lógica XP

| Acción                   | XP   | Por qué                          |
|--------------------------|------|----------------------------------|
| Mensaje LinkedIn         | +10  | El grind diario                  |
| Recibir un NO            | +25  | Insensibilización al rechazo    |
| Respuesta Positiva       | +30  | Abrió la puerta                  |
| Charla / Meet 15 min     | +50  | Salida de zona de confort        |
| Identificar 'Dolor' real | +80  | Valor estratégico                |
| Presentar MenSso         | +100 | Hito                             |
| Cierre / Pasantía / Venta| +250 | Level Up inmediato              |

## Challenge Semanal

- Objetivo fijo: **5 NOs entre lunes 00:00 y domingo 23:59** (hora local).
- Reset automático el lunes: no hace falta tocar nada, el filtro es calculado sobre tus acciones existentes.
- Estados visuales: normal (ámbar), warning pulsante (≤2 días restantes y no cumpliste), cumplido (verde).
