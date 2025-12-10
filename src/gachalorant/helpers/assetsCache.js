import { getPoolById, isKnifePool } from "./poolConfig";
import { getCachedAsset } from "./cacheService";

const DEFAULT_API_BASE_URL =
    process.env.REACT_APP_VALORANT_API_URL ||
    "http://localhost:4000";

const PUBLIC_ASSET_BASE = process.env.PUBLIC_URL ?? "";
const LOCAL_WEAPONS_JSON = `${PUBLIC_ASSET_BASE}/valorant_assets/valorant_weapons.json`;
const STATIC_ASSET_TIMEOUT = 5000;

let indexedWeapons = null;

function mapLocalWeapon(entry) {
    const parts = entry.wp_id.split("_");
    const [category, ...rest] = parts;
    return {
        id: entry.wp_id,
        name: entry.wp_name,
        rarity: entry.rarity,
        category,
        imageSlug: rest.join("_"),
    };
}

function toWeaponWithImage(weapon) {
    const fileName = `${weapon.imageSlug}.png`;
    const imageUrl = `${PUBLIC_ASSET_BASE}/valorant_assets/${weapon.category}/${fileName}`;
    return {
        ...weapon,
        imageUrl,
    };
}

function buildIndex(rawWeapons) {
    const index = new Map();
    rawWeapons.map(toWeaponWithImage).forEach((weapon) => {
        const key = `${weapon.category}:${weapon.rarity}`;
        const list = index.get(key) || [];
        list.push(weapon);
        index.set(key, list);
    });
    return index;
}

function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Timeout loading static asset")),
                timeout
            )
        ),
    ]);
}

async function loadWeaponsFromLocal() {
    let response = await getCachedAsset(LOCAL_WEAPONS_JSON);
    if (!response) {
        response = await fetchWithTimeout(
            LOCAL_WEAPONS_JSON,
            STATIC_ASSET_TIMEOUT
        );
    }
    if (!response.ok) {
        throw new Error("Không thể load weapon JSON tĩnh");
    }
    const data = await response.json();
    const mapped = data.map(mapLocalWeapon);
    indexedWeapons = buildIndex(mapped);
}

async function loadWeaponsFromApi() {
    const endpoint = `${DEFAULT_API_BASE_URL}/api/valorant/weapons`;
    const response = await fetchWithTimeout(
        endpoint,
        STATIC_ASSET_TIMEOUT
    );
    if (!response.ok) {
        throw new Error(
            "Không thể load danh sách weapon Valorant"
        );
    }
    const data = await response.json();
    indexedWeapons = buildIndex(data);
}

async function ensureWeaponsLoaded() {
    if (indexedWeapons) {
        return;
    }
    let lastError = null;
    try {
        await loadWeaponsFromLocal();
        return;
    } catch (error) {
        lastError = error;
    }
    try {
        await loadWeaponsFromApi();
    } catch (error) {
        throw lastError ?? error;
    }
}

function pickRandomWeapon(candidates) {
    if (!candidates || candidates.length === 0) {
        return null;
    }
    const index = Math.floor(
        Math.random() * candidates.length
    );
    return candidates[index];
}

export async function getRandomWeaponForPool(
    poolId,
    rarityId
) {
    await ensureWeaponsLoaded();
    const pool = getPoolById(poolId);
    const knifePool = isKnifePool(poolId);
    const categoryKey = knifePool ? "meele" : pool.category;
    const targetRarity = knifePool ? 4 : rarityId;
    const key = `${categoryKey}:${targetRarity}`;
    const candidates = indexedWeapons.get(key) || [];
    return pickRandomWeapon(candidates);
}

export async function getWeaponsForPool(poolId) {
    await ensureWeaponsLoaded();
    const pool = getPoolById(poolId);
    const knifePool = isKnifePool(poolId);
    const categoryKey = knifePool ? "meele" : pool.category;
    const result = [];
    indexedWeapons.forEach((list, key) => {
        if (key.startsWith(`${categoryKey}:`)) {
            list.forEach((weapon) => {
                result.push(weapon);
            });
        }
    });
    return result;
}
