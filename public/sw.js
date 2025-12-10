/* eslint-disable no-restricted-globals */
const CACHE_NAME = "valorant-assets-v1";
const ASSETS_BASE = "/valorant_assets";
const WEAPONS_JSON = `${ASSETS_BASE}/valorant_weapons.json`;

const STATIC_ASSETS = [
    WEAPONS_JSON,
    `${ASSETS_BASE}/common/v-point.png`,
    `${ASSETS_BASE}/common/r-point.png`,
    `${ASSETS_BASE}/common/rarity-1.svg`,
    `${ASSETS_BASE}/common/rarity-2.svg`,
    `${ASSETS_BASE}/common/rarity-3.svg`,
    `${ASSETS_BASE}/common/rarity-4.svg`,
    `${ASSETS_BASE}/common/rarity-5.svg`,
];

async function preloadAssets() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await fetch(WEAPONS_JSON);
        if (!response.ok) {
            return;
        }
        const data = await response.json();
        const assetUrls = new Set(STATIC_ASSETS);
        for (const entry of data) {
            const parts = entry.wp_id.split("_");
            const [category, ...rest] = parts;
            const fileName = `${rest.join("_")}.png`;
            const imageUrl = `${ASSETS_BASE}/${category}/${fileName}`;
            assetUrls.add(imageUrl);
        }
        const urlsToCache = Array.from(assetUrls);
        const batchSize = 50;
        for (
            let i = 0;
            i < urlsToCache.length;
            i += batchSize
        ) {
            const batch = urlsToCache.slice(
                i,
                i + batchSize
            );
            await Promise.allSettled(
                batch.map((url) =>
                    fetch(url)
                        .then((response) => {
                            if (response.ok) {
                                return cache.put(
                                    url,
                                    response
                                );
                            }
                        })
                        .catch(() => {})
                )
            );
        }
    } catch (error) {
        console.error("Failed to preload assets:", error);
    }
}

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).then(() => {
                return self.skipWaiting();
            });
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(
                            (name) => name !== CACHE_NAME
                        )
                        .map((name) => caches.delete(name))
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener("message", (event) => {
    if (
        event.data &&
        event.data.type === "PRELOAD_ASSETS"
    ) {
        event.waitUntil(preloadAssets());
    }
});

self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);
    if (!url.pathname.includes("/valorant_assets/")) {
        return;
    }
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request).then((response) => {
                if (!response.ok) {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(
                        event.request,
                        responseToCache
                    );
                });
                return response;
            });
        })
    );
});
