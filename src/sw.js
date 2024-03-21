importScripts('assets/js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [
    // '/',

    '/assets/splascreen/icons-ios/apple-launch-1125x2436.png',
    '/assets/css/**',
    '/assets/data/**',
    '/assets/fonts/**',
    '/assets/i18n/**',
    '/assets/icons/**',
    '/assets/images/**',
    '/assets/js/**',
    '/assets/plugins/**',
    '/assets/scss/**',
    '/assets/splascreen/**',
    '/assets/css/style.css',
    '/favicon.ico',
    '/manifest.json',
    '/assets/js/app.js'
];

const APP_SHELL_INMUTABLE = [
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    '/assets/css/animate.css',
    '/assets/css/spinners.css',
    '/assets/css/iconos.css',
    '/assets/css/vendor.min.css',
    '/main.2b2d0e42d1e0e384135e.js',
    '/polyfills.8bbb231b43165d65d357.js',
    '/runtime.26209474bfa8dc87a77c.js',
    '/styles.3ff695c00d717f2d2a11.css',
];



self.addEventListener('install', e => {

    console.log('SW: Instalando Sw');

    const cacheStatic = caches.open(STATIC_CACHE).then(cache =>
        cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache =>
        cache.addAll(APP_SHELL_INMUTABLE));



    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

});



self.addEventListener('activate', e => {

    // borrar cache viejo
    console.log('SW1: Activo y listo para controlar la app');

    const respuesta = caches.keys().then(keys => {

        keys.forEach(key => {

            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }

            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil(respuesta);

});




self.addEventListener('fetch', e => {


    const respuesta = caches.match(e.request).then(res => {

        if (res) {
            return res;
        } else {

            return fetch(e.request).then(newRes => {

                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

            });

        }

    });



    e.respondWith(respuesta);

});

// evento Sync: recuperamos la conexion a internet
self.addEventListener('sync', event => {

    //console.log('Tenemos Conexión');

});