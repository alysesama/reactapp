const CACHE_NAME = "valorant-assets-v1";

function getServiceWorker() {
    if ("serviceWorker" in navigator) {
        return navigator.serviceWorker;
    }
    return null;
}

export async function registerServiceWorker() {
    const sw = getServiceWorker();
    if (!sw) {
        return false;
    }
    if (process.env.NODE_ENV !== "production") {
        try {
            const response = await fetch("/sw.js", {
                method: "HEAD",
            });
            if (
                !response.ok ||
                !response.headers
                    .get("content-type")
                    ?.includes("javascript")
            ) {
                console.warn(
                    "Service Worker file not available in development"
                );
                return false;
            }
        } catch (error) {
            console.warn(
                "Service Worker file not available in development"
            );
            return false;
        }
    }
    try {
        const publicUrl = process.env.PUBLIC_URL || "";
        const baseUrl = publicUrl.endsWith("/")
            ? publicUrl.slice(0, -1)
            : publicUrl;
        const swUrl = `${baseUrl}/sw.js`;
        const scope = publicUrl || "/";
        const normalizedScope = scope.endsWith("/")
            ? scope
            : `${scope}/`;
        const registration = await sw.register(swUrl, {
            scope: normalizedScope,
        });
        if (registration.waiting) {
            return true;
        }
        if (registration.installing) {
            registration.installing.addEventListener(
                "statechange",
                (e) => {
                    if (
                        e.target.state === "installed" &&
                        sw.controller
                    ) {
                        return true;
                    }
                }
            );
        }
        await sw.ready;
        return true;
    } catch (error) {
        console.warn(
            "Service Worker registration failed:",
            error.message
        );
        return false;
    }
}

export async function preloadAssets() {
    const sw = getServiceWorker();
    if (!sw || !sw.controller) {
        return false;
    }
    try {
        sw.controller.postMessage({
            type: "PRELOAD_ASSETS",
        });
        return true;
    } catch (error) {
        console.error(
            "Failed to send preload message:",
            error
        );
        return false;
    }
}

export async function getCachedAsset(url) {
    if (!("caches" in window)) {
        return null;
    }
    try {
        const cache = await caches.open(CACHE_NAME);
        const response = await cache.match(url);
        if (response) {
            return response;
        }
    } catch (error) {
        console.error("Failed to get cached asset:", error);
    }
    return null;
}

export async function isAssetCached(url) {
    const cached = await getCachedAsset(url);
    return cached !== null;
}

export async function getCacheSize() {
    if (!("caches" in window)) {
        return 0;
    }
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        let totalSize = 0;
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
        return totalSize;
    } catch (error) {
        console.error(
            "Failed to calculate cache size:",
            error
        );
        return 0;
    }
}

export async function clearCache() {
    if (!("caches" in window)) {
        return false;
    }
    try {
        const deleted = await caches.delete(CACHE_NAME);
        return deleted;
    } catch (error) {
        console.error("Failed to clear cache:", error);
        return false;
    }
}
