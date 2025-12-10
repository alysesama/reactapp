import bundles from "../bundles.json";

const WALLET_KEY = "gachalorant_wallet";
const COLLECTION_KEY = "gachalorant_collection";

const PUBLIC_ASSET_BASE = process.env.PUBLIC_URL ?? "";
const LOCAL_WEAPONS_JSON = `${PUBLIC_ASSET_BASE}/valorant_assets/valorant_weapons.json`;
const STATIC_ASSET_TIMEOUT = 5000;

const RARITY_REWARD_TABLE = [
    { rarityId: 1, vPoint: 25, rPoint: 0 },
    { rarityId: 2, vPoint: 50, rPoint: 0 },
    { rarityId: 3, vPoint: 125, rPoint: 0 },
    { rarityId: 4, vPoint: 1980, rPoint: 10 },
    { rarityId: 5, vPoint: 2040, rPoint: 10 },
];

const RARITY_REWARD_NEW_TABLE = [
    { rarityId: 1, vPoint: 150, rPoint: 0 },
    { rarityId: 2, vPoint: 200, rPoint: 0 },
    { rarityId: 3, vPoint: 600, rPoint: 0 },
    { rarityId: 4, vPoint: 5940, rPoint: 30 },
    { rarityId: 5, vPoint: 6120, rPoint: 30 },
];

function getDefaultWalletTemplate() {
    return {
        balance_usd: 0,
        balance_usd_spent: 0,
        vPoints: 0,
        rPoints: 0,
        first_bonus_used: [],
    };
}

function getDefaultCollectionTemplate() {
    const now = Math.floor(Date.now() / 1000);
    return {
        version: 1,
        nextCheck: now + 3600,
        lastCheck: now,
        statistics: {},
        wp_db: {},
    };
}

function getWalletTemplate() {
    try {
        const stored = localStorage.getItem(WALLET_KEY);
        if (!stored) {
            return getDefaultWalletTemplate();
        }
        const parsed = JSON.parse(stored);
        if (
            typeof parsed.balance_usd !== "number" ||
            typeof parsed.balance_usd_spent !== "number" ||
            typeof parsed.vPoints !== "number" ||
            typeof parsed.rPoints !== "number" ||
            !Array.isArray(parsed.first_bonus_used)
        ) {
            return getDefaultWalletTemplate();
        }
        return parsed;
    } catch (error) {
        return getDefaultWalletTemplate();
    }
}

function getCollectionTemplate() {
    try {
        const stored = localStorage.getItem(COLLECTION_KEY);
        if (!stored) {
            return getDefaultCollectionTemplate();
        }
        const parsed = JSON.parse(stored);
        if (
            typeof parsed.version !== "number" ||
            typeof parsed.nextCheck !== "number" ||
            typeof parsed.lastCheck !== "number" ||
            !parsed.wp_db ||
            typeof parsed.wp_db !== "object" ||
            !parsed.statistics ||
            typeof parsed.statistics !== "object"
        ) {
            return getDefaultCollectionTemplate();
        }
        return parsed;
    } catch (error) {
        return getDefaultCollectionTemplate();
    }
}

function saveWallet(wallet) {
    try {
        localStorage.setItem(
            WALLET_KEY,
            JSON.stringify(wallet)
        );
        return true;
    } catch (error) {
        console.error("Failed to save wallet:", error);
        return false;
    }
}

function saveCollection(collection) {
    try {
        localStorage.setItem(
            COLLECTION_KEY,
            JSON.stringify(collection)
        );
        return true;
    } catch (error) {
        console.error("Failed to save collection:", error);
        return false;
    }
}

function getRewards(rarityId, isNew) {
    const table = isNew
        ? RARITY_REWARD_NEW_TABLE
        : RARITY_REWARD_TABLE;
    const matched = table.find(
        (entry) => entry.rarityId === rarityId
    );
    if (!matched) {
        return { vPoint: 0, rPoint: 0 };
    }
    return {
        vPoint: matched.vPoint,
        rPoint: matched.rPoint,
    };
}

function sumTierObtCnt(tierObtCnt) {
    if (!tierObtCnt || typeof tierObtCnt !== "object") {
        return 0;
    }
    return (
        (tierObtCnt["1"] || 0) +
        (tierObtCnt["2"] || 0) +
        (tierObtCnt["3"] || 0) +
        (tierObtCnt["4"] || 0) +
        (tierObtCnt["5"] || 0)
    );
}

function calculateStatistics(wpDb) {
    const statistics = {};
    for (const [category, weapons] of Object.entries(
        wpDb
    )) {
        if (!Array.isArray(weapons)) {
            continue;
        }
        let total = 0;
        let obtained = 0;
        for (const weapon of weapons) {
            total += 1;
            const totalCnt = sumTierObtCnt(
                weapon.tier_obt_cnt
            );
            if (totalCnt > 0) {
                obtained += 1;
            }
        }
        if (total > 0) {
            statistics[category] = { total, obtained };
        }
    }
    return statistics;
}

function fetchWithTimeout(url, timeout) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(
                () => reject(new Error("Timeout loading asset")),
                timeout
            )
        ),
    ]);
}

function mapLocalWeaponToApiFormat(entry) {
    const parts = entry.wp_id.split("_");
    const [category, ...rest] = parts;
    const fileName = `${rest.join("_")}.png`;
    const imageUrl = `${PUBLIC_ASSET_BASE}/valorant_assets/${category}/${fileName}`;
    return {
        id: entry.wp_id,
        name: entry.wp_name,
        rarity: entry.rarity,
        category,
        imageUrl,
    };
}

async function loadWeaponsFromStatic() {
    const response = await fetchWithTimeout(
        LOCAL_WEAPONS_JSON,
        STATIC_ASSET_TIMEOUT
    );
    if (!response.ok) {
        throw new Error("Không thể load weapon JSON tĩnh");
    }
    const data = await response.json();
    return data.map(mapLocalWeaponToApiFormat);
}

async function loadWeaponsFromAPI() {
    const DEFAULT_API_BASE_URL =
        process.env.REACT_APP_VALORANT_API_URL ||
        "http://localhost:4000";
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
    return data;
}

function buildWeaponDBFromWeapons(weapons) {
    const wpDb = {};
    for (const weapon of weapons) {
        const category = weapon.category;
        if (!wpDb[category]) {
            wpDb[category] = [];
        }
        const existing = wpDb[category].find(
            (w) => w.id === weapon.id
        );
        if (!existing) {
            wpDb[category].push({
                id: weapon.id,
                max_qual: 0,
                tier_obt_cnt: {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0,
                },
            });
        }
    }
    return wpDb;
}

function mergeWeaponDBs(existingDb, newDb) {
    const merged = { ...existingDb };
    for (const [category, newWeapons] of Object.entries(
        newDb
    )) {
        if (!merged[category]) {
            merged[category] = [];
        }
        for (const newWeapon of newWeapons) {
            const existing = merged[category].find(
                (w) => w.id === newWeapon.id
            );
            if (!existing) {
                merged[category].push({
                    id: newWeapon.id,
                    max_qual: 0,
                    tier_obt_cnt: {
                        1: 0,
                        2: 0,
                        3: 0,
                        4: 0,
                        5: 0,
                    },
                });
            }
        }
    }
    return merged;
}

async function ensureWeaponDB() {
    const collection = getCollectionTemplate();
    const now = Math.floor(Date.now() / 1000);
    const shouldCheck =
        !collection.wp_db ||
        Object.keys(collection.wp_db).length === 0 ||
        now >= collection.nextCheck;
    if (!shouldCheck) {
        return collection;
    }
    let weapons = null;
    let lastError = null;
    try {
        weapons = await loadWeaponsFromStatic();
    } catch (error) {
        lastError = error;
        try {
            weapons = await loadWeaponsFromAPI();
        } catch (apiError) {
            console.error(
                "Failed to load weapons from static assets:",
                lastError
            );
            console.error(
                "Failed to load weapons from API:",
                apiError
            );
            return collection;
        }
    }
    if (!weapons) {
        return collection;
    }
    try {
        const newDb = buildWeaponDBFromWeapons(weapons);
        const mergedDb = mergeWeaponDBs(
            collection.wp_db || {},
            newDb
        );
        const updatedCollection = {
            ...collection,
            wp_db: mergedDb,
            nextCheck: now + 3600,
            lastCheck: now,
        };
        if (
            !collection.statistics ||
            Object.keys(collection.statistics).length === 0
        ) {
            updatedCollection.statistics =
                calculateStatistics(mergedDb);
        }
        saveCollection(updatedCollection);
        return updatedCollection;
    } catch (error) {
        console.error(
            "Failed to build weapon database:",
            error
        );
        return collection;
    }
}

function updateStatisticsIncremental(
    statistics,
    category,
    wasObtained,
    isNowObtained
) {
    if (!statistics[category]) {
        statistics[category] = { total: 0, obtained: 0 };
    }
    if (!wasObtained && isNowObtained) {
        statistics[category].obtained += 1;
    }
}

export function getWallet() {
    return getWalletTemplate();
}

export function topUpWallet(amountUsd) {
    const wallet = getWalletTemplate();
    wallet.balance_usd += amountUsd;
    saveWallet(wallet);
    return wallet;
}

export function purchaseBundle(bundleId, priceUsd) {
    const wallet = getWalletTemplate();
    if (wallet.balance_usd < priceUsd) {
        return null;
    }
    const bundle = bundles.find((b) => b.id === bundleId);
    if (!bundle) {
        return null;
    }
    const hasFirstBonus =
        !wallet.first_bonus_used.includes(bundleId);
    const fixedVPoints = bundle.return_fixed?.vpoint ?? 0;
    const firstBonusVPoints =
        bundle.return_first_bonus?.vpoint ?? 0;
    const bonusVPoints = bundle.return_bonus?.vpoint ?? 0;
    const vPointsToAdd = hasFirstBonus
        ? fixedVPoints + firstBonusVPoints
        : fixedVPoints + bonusVPoints;
    wallet.balance_usd -= priceUsd;
    wallet.balance_usd_spent += priceUsd;
    wallet.vPoints += vPointsToAdd;
    if (hasFirstBonus) {
        wallet.first_bonus_used.push(bundleId);
    }
    saveWallet(wallet);
    return wallet;
}

export function getBundleInfo(bundleId) {
    const wallet = getWalletTemplate();
    const bundle = bundles.find((b) => b.id === bundleId);
    if (!bundle) {
        return null;
    }
    const hasFirstBonus =
        !wallet.first_bonus_used.includes(bundleId);
    const fixedVPoints = bundle.return_fixed?.vpoint ?? 0;
    const firstBonusVPoints =
        bundle.return_first_bonus?.vpoint ?? 0;
    const bonusVPoints = bundle.return_bonus?.vpoint ?? 0;
    const totalVPoints = hasFirstBonus
        ? fixedVPoints + firstBonusVPoints
        : fixedVPoints + bonusVPoints;
    return {
        ...bundle,
        hasFirstBonus,
        totalVPoints,
        fixedVPoints,
        firstBonusVPoints,
        bonusVPoints,
    };
}

export function updateWalletPoints(vPoints, rPoints) {
    const wallet = getWalletTemplate();
    wallet.vPoints += vPoints;
    wallet.rPoints += rPoints;
    saveWallet(wallet);
    return wallet;
}

export function getPullCost(poolId, pulls) {
    const { isKnifePool } = require("./poolConfig");
    const isKnife = isKnifePool(poolId);
    if (isKnife) {
        return {
            vPoints: 0,
            rPoints: pulls === 10 ? 100 : 10,
        };
    }
    return {
        vPoints: pulls === 10 ? 1980 : 200,
        rPoints: 0,
    };
}

export function canAffordPull(poolId, pulls) {
    const wallet = getWalletTemplate();
    const cost = getPullCost(poolId, pulls);
    const hasEnoughVPoints = wallet.vPoints >= cost.vPoints;
    const hasEnoughRPoints = wallet.rPoints >= cost.rPoints;
    return hasEnoughVPoints && hasEnoughRPoints;
}

export function deductPullCost(poolId, pulls) {
    const wallet = getWalletTemplate();
    const cost = getPullCost(poolId, pulls);
    if (
        wallet.vPoints < cost.vPoints ||
        wallet.rPoints < cost.rPoints
    ) {
        return null;
    }
    wallet.vPoints -= cost.vPoints;
    wallet.rPoints -= cost.rPoints;
    saveWallet(wallet);
    return wallet;
}

export async function processGachaResult(roll) {
    if (!roll) {
        return null;
    }
    const collection = await ensureWeaponDB();
    const category = roll.category;
    const weaponId = roll.weaponId;
    const isKnife = category === "meele";
    const finalRarityId = isKnife ? 4 : roll.rarityId;
    if (!collection.wp_db[category]) {
        collection.wp_db[category] = [];
    }
    let weapon = collection.wp_db[category].find(
        (w) => w.id === weaponId
    );
    const wasObtained = weapon
        ? sumTierObtCnt(weapon.tier_obt_cnt) > 0
        : false;
    if (!weapon) {
        weapon = {
            id: weaponId,
            max_qual: 0,
            tier_obt_cnt: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            },
        };
        collection.wp_db[category].push(weapon);
    }
    const isNew = sumTierObtCnt(weapon.tier_obt_cnt) === 0;
    if (roll.qualityValue > weapon.max_qual) {
        weapon.max_qual = roll.qualityValue;
    }
    const tierKey = String(roll.qualityTier);
    if (weapon.tier_obt_cnt[tierKey] !== undefined) {
        weapon.tier_obt_cnt[tierKey] += 1;
    }
    const isNowObtained =
        sumTierObtCnt(weapon.tier_obt_cnt) > 0;
    if (
        !collection.statistics ||
        Object.keys(collection.statistics).length === 0
    ) {
        collection.statistics = calculateStatistics(
            collection.wp_db
        );
    } else {
        updateStatisticsIncremental(
            collection.statistics,
            category,
            wasObtained,
            isNowObtained
        );
    }
    saveCollection(collection);
    const rewards = isKnife
        ? { vPoint: 0, rPoint: 0 }
        : getRewards(finalRarityId, isNew);
    if (!isKnife) {
        updateWalletPoints(rewards.vPoint, rewards.rPoint);
    }
    return {
        id: `${weaponId}-${Date.now()}-${Math.random()
            .toString(16)
            .slice(2)}`,
        weaponId: roll.weaponId,
        weaponName: roll.weaponName,
        rarityId: finalRarityId,
        qualityValue: roll.qualityValue,
        qualityTier: roll.qualityTier,
        category: roll.category,
        imageUrl: roll.imageUrl,
        isNew,
        rewards,
    };
}

export async function getStatistics() {
    const collection = await ensureWeaponDB();
    if (
        !collection.statistics ||
        Object.keys(collection.statistics).length === 0
    ) {
        collection.statistics = calculateStatistics(
            collection.wp_db
        );
        saveCollection(collection);
    }
    return collection.statistics;
}

export async function getCollectionForCategory(category) {
    const collection = await ensureWeaponDB();
    const weapons = collection.wp_db[category] || [];
    const statistics = await getStatistics();
    const categoryStats = statistics[category] || {
        total: 0,
        obtained: 0,
    };
    return {
        weapons,
        statistics: categoryStats,
    };
}
