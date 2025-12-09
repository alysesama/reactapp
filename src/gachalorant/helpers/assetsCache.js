import { getPoolById, isKnifePool } from "./poolConfig";

const DEFAULT_API_BASE_URL =
    process.env.REACT_APP_VALORANT_API_URL ||
    "http://localhost:4000";

const PUBLIC_ASSET_BASE = process.env.PUBLIC_URL ?? "";

let indexedWeapons = null;

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

async function ensureWeaponsLoaded() {
    if (indexedWeapons) {
        return;
    }
    const endpoint = `${DEFAULT_API_BASE_URL}/api/valorant/weapons`;
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw new Error(
            "Không thể load danh sách weapon Valorant"
        );
    }
    const data = await response.json();
    indexedWeapons = buildIndex(data);
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