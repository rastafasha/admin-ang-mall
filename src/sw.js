// SW custom DESHABILITADO.
// Motivo: en iOS (PWA/A2HS) esta implementación puede entrar en conflicto con el
// Service Worker oficial de Angular (ngsw-worker.js) y terminar sirviendo recursos
// corruptos, causando pantalla blanca.
//
// Mantengo este archivo para no romper el build, pero no registra ni intercepta fetch.

/* eslint-disable no-restricted-globals */

self.addEventListener('install', () => {
  // no-op
});

self.addEventListener('activate', (event) => {
  // no-op
  event.waitUntil(Promise.resolve());
});

self.addEventListener('fetch', () => {
  // no-op
});

self.addEventListener('sync', () => {
  // no-op
});

