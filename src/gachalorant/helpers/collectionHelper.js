import { getWeaponsForPool } from "./assetsCache";
import { getPoolById } from "./poolConfig";
import { getCollectionForCategory } from "./localStorageHelper";

function toRomanTier(tier) {
    const map = {
        1: "I",
        2: "II",
        3: "III",
        4: "IV",
        5: "V",
    };
    return map[tier] ?? "";
}

function buildStatsForWeapon(weapon, storedWeapon) {
    const tier = weapon.rarity ?? 1;
    const maxQualityValue = storedWeapon
        ? storedWeapon.max_qual
        : 0;
    const counts = storedWeapon
        ? {
              1: storedWeapon.tier_obt_cnt["1"] || 0,
              2: storedWeapon.tier_obt_cnt["2"] || 0,
              3: storedWeapon.tier_obt_cnt["3"] || 0,
              4: storedWeapon.tier_obt_cnt["4"] || 0,
              5: storedWeapon.tier_obt_cnt["5"] || 0,
          }
        : {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
          };
    const base = process.env.PUBLIC_URL ?? "";
    const rarityIconUrl = `${base}/valorant_assets/common/rarity-${weapon.rarity}.svg`;
    return {
        weaponId: weapon.id,
        weaponName: weapon.name,
        rarityId: weapon.rarity,
        tierLabel: toRomanTier(tier),
        maxQualityValue,
        counts,
        imageUrl: weapon.imageUrl,
        rarityIconUrl,
    };
}

export async function getCollectionForPool(poolId) {
    const pool = getPoolById(poolId);
    const weapons = await getWeaponsForPool(pool.id);
    const category = pool.category;
    const { weapons: storedWeapons, statistics } =
        await getCollectionForCategory(category);
    const storedWeaponMap = new Map();
    for (const stored of storedWeapons) {
        storedWeaponMap.set(stored.id, stored);
    }
    const result = weapons.map((weapon) => {
        const stored = storedWeaponMap.get(weapon.id);
        return buildStatsForWeapon(weapon, stored);
    });
    return {
        items: result,
        statistics,
    };
}

