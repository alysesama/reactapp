import { QUALITY_TIERS, RARITY_TABLE } from "./gachaHelper";

function sumTierCounts(tierCounts) {
    if (!tierCounts || typeof tierCounts !== "object") {
        return 0;
    }
    return (
        (tierCounts["1"] || 0) +
        (tierCounts["2"] || 0) +
        (tierCounts["3"] || 0) +
        (tierCounts["4"] || 0) +
        (tierCounts["5"] || 0)
    );
}

function emptyCountMap(entries) {
    return entries.reduce((acc, entry) => {
        acc[entry.id] = 0;
        return acc;
    }, {});
}

function normalizeCategoryLabel(categoryId) {
    if (categoryId === "meele") {
        return "Knife";
    }
    if (!categoryId) {
        return "";
    }
    return `${categoryId
        .charAt(0)
        .toUpperCase()}${categoryId.slice(1)}`;
}

export function computeRarityStats(wpDb) {
    const categories = [];
    const totalByRarity = emptyCountMap(RARITY_TABLE);
    let grandTotal = 0;
    for (const [categoryId, weapons] of Object.entries(
        wpDb || {}
    )) {
        if (!Array.isArray(weapons)) {
            continue;
        }
        const rarityCounts = emptyCountMap(RARITY_TABLE);
        let categoryTotal = 0;
        for (const weapon of weapons) {
            const weaponTotal = sumTierCounts(
                weapon.tier_obt_cnt
            );
            if (
                !weapon ||
                typeof weapon.rarity !== "number"
            ) {
                continue;
            }
            rarityCounts[weapon.rarity] =
                (rarityCounts[weapon.rarity] || 0) +
                weaponTotal;
            categoryTotal += weaponTotal;
        }
        grandTotal += categoryTotal;
        for (const entry of RARITY_TABLE) {
            totalByRarity[entry.id] +=
                rarityCounts[entry.id] || 0;
        }
        categories.push({
            id: categoryId,
            label: normalizeCategoryLabel(categoryId),
            counts: rarityCounts,
            total: categoryTotal,
        });
    }
    return {
        categories,
        totals: {
            counts: totalByRarity,
            total: grandTotal,
        },
    };
}

function toRoman(numeric) {
    switch (numeric) {
        case 1:
            return "I";
        case 2:
            return "II";
        case 3:
            return "III";
        case 4:
            return "IV";
        case 5:
            return "V";
        default:
            return `${numeric}`;
    }
}

export function computeQualityStats(wpDb) {
    const categories = [];
    const totalByTier = emptyCountMap(QUALITY_TIERS);
    let grandTotal = 0;
    for (const [categoryId, weapons] of Object.entries(
        wpDb || {}
    )) {
        if (!Array.isArray(weapons)) {
            continue;
        }
        const tierCounts = emptyCountMap(QUALITY_TIERS);
        let categoryTotal = 0;
        for (const weapon of weapons) {
            const counts = weapon.tier_obt_cnt || {};
            for (const tier of QUALITY_TIERS) {
                const tierValue = counts[tier.id] || 0;
                tierCounts[tier.id] += tierValue;
                categoryTotal += tierValue;
            }
        }
        grandTotal += categoryTotal;
        for (const tier of QUALITY_TIERS) {
            totalByTier[tier.id] +=
                tierCounts[tier.id] || 0;
        }
        categories.push({
            id: categoryId,
            label: normalizeCategoryLabel(categoryId),
            counts: tierCounts,
            total: categoryTotal,
        });
    }
    const tiersWithLabel = QUALITY_TIERS.map((tier) => ({
        ...tier,
        label: `${toRoman(tier.id)} (Base ${tier.min}-${
            tier.max
        }%)`,
    }));
    return {
        categories,
        totals: {
            counts: totalByTier,
            total: grandTotal,
        },
        tiers: tiersWithLabel,
    };
}

export function formatPercent(numerator, denominator) {
    if (!denominator) {
        return "0.00";
    }
    return ((numerator / denominator) * 100).toFixed(2);
}
