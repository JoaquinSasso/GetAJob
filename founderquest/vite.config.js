// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			// registerType: "autoUpdate" → cuando deployás una nueva versión,
			// el service worker la descarga en background y la activa en la
			// próxima recarga. No hay prompt "hay una actualización, recargá".
			registerType: "autoUpdate",

			// Archivos estáticos que se incluyen en el caché del SW.
			// Cualquier cosa de /public que quieras accesible offline va acá.
			includeAssets: [
				"favicon.ico",
				"favicon.svg",
				"favicon-96x96.png",
				"apple-touch-icon.png",
				"web-app-manifest-192x192.png",
				"web-app-manifest-512x512.png",
			],

			// El manifest lo gestiona el plugin (no hace falta manifest.webmanifest manual).
			manifest: {
				name: "FounderQuest",
				short_name: "FQ",
				description: "Convertí la fricción social en XP",
				theme_color: "#0a0d0b",
				background_color: "#0a0d0b",
				display: "standalone",
				orientation: "portrait",
				start_url: "/",
				scope: "/",
				icons: [
					{
						src: "/web-app-manifest-192x192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any",
					},
					{
						src: "/web-app-manifest-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "maskable",
					},
				],
			},

			workbox: {
				// Qué archivos pre-cachea el SW al instalarse.
				// El shell de la app (HTML, JS, CSS, fuentes) queda disponible offline.
				globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],

				// No intentamos cachear peticiones a Firebase: Firestore ya tiene
				// su propio sistema de caché offline (IndexedDB vía persistentLocalCache).
				// Duplicar caché con el SW causaría conflictos.
				navigateFallbackDenylist: [/^\/__/, /firestore\.googleapis\.com/],

				// Google Fonts sí las cacheamos para que las tipografías carguen
				// instantáneo y funcionen offline.
				runtimeCaching: [
					{
						urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-stylesheets",
							expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
						},
					},
					{
						urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
						handler: "CacheFirst",
						options: {
							cacheName: "google-fonts-webfonts",
							expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 365 },
						},
					},
				],
			},

			// En desarrollo, dejar el SW desactivado evita cachés fantasma
			// mientras estás iterando con npm run dev.
			devOptions: {
				enabled: false,
			},
		}),
	],
});
