'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "012d6d548f59b420ce0168b4bfd3b729",
"assets/assets/fonts/IBMPlexMono/IBMPlexMono-Bold.ttf": "36183581f89e93328498c9073e402f85",
"assets/assets/fonts/IBMPlexMono/IBMPlexMono-Italic.ttf": "0d808068d751810c39b3c92048c169f8",
"assets/assets/fonts/IBMPlexMono/IBMPlexMono-Regular.ttf": "cb46f1f18358474393e7ccd02be3998a",
"assets/assets/fonts/IBMPlexSerif/IBMPlexSerif-Bold.ttf": "58e4633f72e3feca1e4fcf9f32d2217c",
"assets/assets/fonts/IBMPlexSerif/IBMPlexSerif-Italic.ttf": "b38b47f1cb5acc36e0e232043be25f28",
"assets/assets/fonts/IBMPlexSerif/IBMPlexSerif-Medium.ttf": "9ca7848f37491852b10287aca8bf390b",
"assets/assets/fonts/IBMPlexSerif/IBMPlexSerif-Regular.ttf": "bfc0c1efd48c7e6dcbd2504c849a3a51",
"assets/assets/ico/linkedin.png": "9628614f16c88832cdce6cb4eff05c0a",
"assets/assets/img/avatar_lg.png": "1eddff252b0cccd454092c2eec6c5c0d",
"assets/assets/img/avatar_sm.png": "eef651ba0d80ad94acb26b063966118e",
"assets/assets/img/bs.png": "b4702fd2569cf4f38da43d7bf7ca8b60",
"assets/assets/img/bs_sm.png": "f6aed8eabbd2bfe833e9804ed7551989",
"assets/assets/img/convex.png": "758ed54edd921a4e876e5d527490855e",
"assets/assets/img/convex_sm.png": "e7f54ea700ee467f4882d00db5cea823",
"assets/assets/img/credits.png": "7a58c4087285dc9681b0f911596cf8a5",
"assets/assets/img/cs.png": "0dc1fb71ac46db6bfa00369ee25d3181",
"assets/assets/img/cs_sm.png": "6e339adce4f9d9954caecef99e87d05f",
"assets/assets/img/game_inventory.png": "e1f48a45edbd02dd7ad1056467bac486",
"assets/assets/img/map.png": "c68ccc8ade3a61ab592a152e2c277263",
"assets/assets/img/mission1.png": "730f2165002723b673a39adba7223271",
"assets/assets/img/mission2.png": "ead72da9e8ef1cf977c43df02c3c8d23",
"assets/assets/img/models_dotframe.png": "df178652e962d7e66a1aa9b78a9115dc",
"assets/assets/img/models_fullframe.png": "41853af8ad308a78d59e43ef86334355",
"assets/assets/img/models_wireframe.png": "983832b3de69303a4d40be082d100377",
"assets/assets/img/regatearte_logo.png": "11198296ba8a362f36315b20b1cc37f0",
"assets/assets/json/posts.json": "7a4a86a779e9032581cd741bada518a6",
"assets/assets/txt/about.txt": "65eed3239a50c4e48749c4102719b6ab",
"assets/assets/txt/flutter.txt": "934a6d843ee9ec910d32039b413286e9",
"assets/assets/txt/gamejam.txt": "8da6179743c29d4a078e5cf5e67f5fcc",
"assets/assets/txt/genos.txt": "667fb9083e8cda9a2fd92a9e30b608f1",
"assets/assets/txt/raytracer.txt": "d41d8cd98f00b204e9800998ecf8427e",
"assets/assets/txt/solar_system.txt": "d708b9a832f638638cc082a311c45a83",
"assets/assets/txt/vulkan_opengl.txt": "44b4557daf742089639ab3419db6b9b8",
"assets/FontManifest.json": "08597e108469c38d2e8937d45e4e2555",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/NOTICES": "f57fbb7708a1953a1d24b92204fefd83",
"index.html": "79c3a72d76fbad1a5cad82a5a41d3244",
"/": "79c3a72d76fbad1a5cad82a5a41d3244",
"main.dart.js": "255aac2a6289c1b6d1c5b6cbf608c2b7",
"manifest.json": "76daedaa41119128ab2bbae06937c36b",
"version.json": "25f42d75ef904194283f2aeb522c7b96"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
