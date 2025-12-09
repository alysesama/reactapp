import { getRandomWeaponForPool } from "./assetsCache";
import { KNIFE_POOL_ID } from "./poolConfig";

const RARITY_TABLE = [
    { id: 1, name: "Select Edition", probability: 79.92 },
    { id: 2, name: "Deluxe Edition", probability: 15.98 },
    { id: 3, name: "Premium Edition", probability: 3.2 },
    { id: 4, name: "Exclusive Edition", probability: 0.64 },
    { id: 5, name: "Ultra Edition", probability: 0.26 },
];

const QUALITY_TIERS = [
    { id: 1, min: 0, max: 30 },
    { id: 2, min: 30, max: 55 },
    { id: 3, min: 55, max: 75 },
    { id: 4, min: 75, max: 90 },
    { id: 5, min: 90, max: 100 },
];

function rollRarityId() {
    const roll = Math.random() * 100;
    let cursor = 0;
    const matched =
        RARITY_TABLE.find((entry) => {
            const nextCursor = cursor + entry.probability;
            const isInRange =
                roll >= cursor && roll < nextCursor;
            cursor = nextCursor;
            return isInRange;
        }) ?? RARITY_TABLE[RARITY_TABLE.length - 1];
    return matched.id;
}

function rollQualityValue() {
    const value = Math.random() * 100;
    return Math.round(value * 100000000) / 100000000;
}

function getQualityTierId(qualityValue) {
    const matched =
        QUALITY_TIERS.find(
            (tier) =>
                qualityValue >= tier.min &&
                qualityValue < tier.max
        ) ?? QUALITY_TIERS[QUALITY_TIERS.length - 1];
    return matched.id;
}

function isWeapon(rarityId) {
    if (rarityId === 4) {
        return Math.random() < 0.5;
    }
    if (rarityId === 5) {
        return Math.random() < 0.6666;
    }
    return true;
}

export async function rollValorantOnce(poolId) {
    const rarityId = rollRarityId();
    const qualityValue = rollQualityValue();
    const qualityTier = getQualityTierId(qualityValue);

    let actualPoolId = poolId;
    if (
        poolId !== KNIFE_POOL_ID &&
        (rarityId === 4 || rarityId === 5)
    ) {
        if (!isWeapon(rarityId)) {
            actualPoolId = KNIFE_POOL_ID;
        }
    }

    const weapon = await getRandomWeaponForPool(
        actualPoolId,
        rarityId
    );
    if (!weapon) {
        return null;
    }
    return {
        weaponId: weapon.id,
        weaponName: weapon.name,
        rarityId,
        qualityValue,
        qualityTier,
        category: weapon.category,
        imageUrl: weapon.imageUrl,
    };
}
