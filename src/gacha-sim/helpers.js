const STORAGE_KEY = "gacha_sim";

// Character pool rates
const CHAR_RATES = {
    4: 0.912,
    5: 0.08,
    6: 0.008,
};

// Weapon pool rates
const WEAPON_RATES = {
    4: 0.81,
    5: 0.15,
    6: 0.04,
};

// Character pool costs and rewards
const CHAR_COST = 500; // oroberyl per pull
const CHAR_REWARDS = {
    4: 20,
    5: 200,
    6: 2000,
};

// Weapon pool costs
const WEAPON_COST = 1980; // arsenal_token per 10 pulls

// Default statistics structure
const DEFAULT_STATS = {
    character: {
        oroberyl: 10000,
        pull_count: 0,
        pity: 0,
        hard_pity_available: true,
        pull_history: [],
    },
    weapon: {
        arsenal_token: 0,
        pull_count: 0,
        pity: 0,
        pull_history: [],
    },
};

// Load statistics from localStorage
export const loadStats = () => {
    if (typeof window === "undefined") return DEFAULT_STATS;
    try {
        const raw =
            window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Deep merge with defaults to ensure all fields exist
            return {
                character: {
                    ...DEFAULT_STATS.character,
                    ...(parsed.character || {}),
                    pull_history:
                        parsed.character?.pull_history ||
                        [],
                },
                weapon: {
                    ...DEFAULT_STATS.weapon,
                    ...(parsed.weapon || {}),
                    pull_history:
                        parsed.weapon?.pull_history || [],
                },
            };
        }
    } catch (error) {
        console.warn(
            "Không thể đọc gacha_sim từ localStorage:",
            error
        );
    }
    return DEFAULT_STATS;
};

// Save statistics to localStorage
export const saveStats = (stats) => {
    if (typeof window === "undefined") return;
    try {
        // Ensure we have valid stats structure
        const statsToSave = {
            character: {
                oroberyl: stats.character?.oroberyl ?? 0,
                pull_count:
                    stats.character?.pull_count ?? 0,
                pity: stats.character?.pity ?? 0,
                hard_pity_available:
                    stats.character?.hard_pity_available ??
                    true,
                pull_history: Array.isArray(
                    stats.character?.pull_history
                )
                    ? stats.character.pull_history
                    : [],
            },
            weapon: {
                arsenal_token:
                    stats.weapon?.arsenal_token ?? 0,
                pull_count: stats.weapon?.pull_count ?? 0,
                pity: stats.weapon?.pity ?? 0,
                pull_history: Array.isArray(
                    stats.weapon?.pull_history
                )
                    ? stats.weapon.pull_history
                    : [],
            },
        };
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(statsToSave)
        );
    } catch (error) {
        console.error(
            "Không thể lưu gacha_sim vào localStorage:",
            error
        );
    }
};

// Calculate soft pity rate for character pool
// Soft pity starts after 65 pulls (from pull 66 onwards)
export const getCharSoftPityRate = (pity) => {
    if (pity <= 65) return CHAR_RATES[6];
    if (pity >= 79) return 1.0;
    // Linear increase from pull 66 to 80 (pity 66-80)
    const progress = (pity - 65) / (79 - 65);
    return CHAR_RATES[6] + progress * (1.0 - CHAR_RATES[6]);
};

// Get last 5* or 6* pull count from history
const getLastHighRarityPull = (
    history,
    currentPullCount
) => {
    if (history.length === 0) return null;
    // History is sorted by pull_count descending
    const lastHigh = history.find((h) => h[1] >= 5);
    return lastHigh ? lastHigh[0] : null;
};

// Check if shiny guarantee is active
// After 9 pulls without 5/6*, the 10th pull is guaranteed (>= 10)
// If no 5/6* has been pulled yet and we're at pull 10+, guarantee
const isShinyGuarantee = (
    lastHighPull,
    currentPullCount
) => {
    // If no 5/6* has been pulled yet, guarantee at pull 10+
    if (lastHighPull === null) {
        return currentPullCount >= 10;
    }
    // If we have a 5/6* but it's been 10+ pulls since then, guarantee
    return currentPullCount - lastHighPull >= 10;
};

// Pick rarity with rates
const pickRarity = (rates, custom6Rate = null) => {
    const roll = Math.random();
    const sixRate = custom6Rate ?? rates[6];
    const fiveRate = rates[5];

    if (roll < sixRate) return 6;
    if (roll < sixRate + fiveRate) return 5;
    return 4;
};

// Roll character pool
const rollCharacter = (poolStats, isShinyGuaranteed) => {
    const {
        pity = 0,
        pull_count = 0,
        hard_pity_available = true,
        pull_history = [],
    } = poolStats;

    // Hard pity check (trigger at pull 120 from last 6*)
    const last6Pull = pull_history.find((h) => h[1] === 6);
    const pullsSinceLast6 = last6Pull
        ? pull_count - last6Pull[0]
        : pull_count;
    const isHardPity =
        hard_pity_available && pullsSinceLast6 >= 120;

    // Shiny guarantee (5* or above within 10 pulls)
    if (isShinyGuaranteed) {
        const shinyRoll = Math.random();
        // 50% chance for 5*, 50% for 6*
        // Use actual probability of pulling 5* as (rate4 + rate5), and 6* as rate6
        const totalRate45 = CHAR_RATES[4] + CHAR_RATES[5];
        if (shinyRoll < totalRate45)
            return { rarity: 5, win: null };
        const win = Math.random() < 0.5; // 50/50 for 6*
        return { rarity: 6, win };
    }

    // Hard pity: guarantee 6* rate-up
    if (isHardPity) {
        return { rarity: 6, win: true };
    }

    // Soft pity calculation
    const sixRate = getCharSoftPityRate(pity);
    const rarity = pickRarity(CHAR_RATES, sixRate);

    // Win/lose for 6* (50/50)
    if (rarity === 6) {
        const win = Math.random() < 0.5;
        return { rarity: 6, win };
    }

    return { rarity, win: null };
};

// Roll weapon pool (only 10 pulls)
const rollWeapon = (poolStats, isShinyGuaranteed) => {
    const { pity = 0 } = poolStats;

    // Guarantee 6* within 30 pulls
    if (pity >= 29) {
        const win = Math.random() < 0.75; // 75% win rate
        return { rarity: 6, win };
    }

    // Shiny guarantee
    if (isShinyGuaranteed) {
        // Use actual probability of pulling 5* as (rate4 + rate5), and 6* as rate6
        const shinyRoll = Math.random();
        const totalRate45 =
            WEAPON_RATES[4] + WEAPON_RATES[5];
        if (shinyRoll < totalRate45)
            return { rarity: 5, win: null };
        const win = Math.random() < 0.75; // 75/25 for 6*
        return { rarity: 6, win };
    }

    const rarity = pickRarity(WEAPON_RATES);

    // Win/lose for 6* (75/25)
    if (rarity === 6) {
        const win = Math.random() < 0.75;
        return { rarity: 6, win };
    }

    return { rarity, win: null };
};

// Main roll function
export const rollGacha = (poolType, pulls, stats) => {
    const isCharacter = poolType === "character";
    const pullCount = isCharacter ? pulls : 10; // Weapon only has 10 pulls

    // Validate currency
    if (isCharacter) {
        const cost = CHAR_COST * pulls;
        if (stats.character.oroberyl < cost) {
            throw new Error(
                `Không đủ oroberyl. Cần ${cost}, hiện có ${stats.character.oroberyl}`
            );
        }
    } else {
        if (stats.weapon.arsenal_token < WEAPON_COST) {
            throw new Error(
                `Không đủ arsenal token. Cần ${WEAPON_COST}, hiện có ${stats.weapon.arsenal_token}`
            );
        }
    }

    // Ensure pool stats exist with all required fields
    const defaultPoolStats = isCharacter
        ? DEFAULT_STATS.character
        : DEFAULT_STATS.weapon;
    const poolStats = {
        ...defaultPoolStats,
        ...(stats[poolType] || {}),
        pull_history: stats[poolType]?.pull_history || [],
    };

    const results = [];
    // Deep copy stats to avoid mutating original
    let updatedStats = {
        character: { ...stats.character },
        weapon: { ...stats.weapon },
    };
    let updatedPoolStats = { ...poolStats };

    // Process each pull
    for (let i = 0; i < pullCount; i++) {
        const currentPullCount =
            updatedPoolStats.pull_count + 1;
        const lastHighPull = getLastHighRarityPull(
            updatedPoolStats.pull_history,
            currentPullCount
        );
        const isShinyGuaranteed = isShinyGuarantee(
            lastHighPull,
            currentPullCount
        );

        // Roll
        const result = isCharacter
            ? rollCharacter(
                  updatedPoolStats,
                  isShinyGuaranteed
              )
            : rollWeapon(
                  updatedPoolStats,
                  isShinyGuaranteed
              );

        const rarity = result.rarity;
        const win = result.win;

        // Update pity
        if (rarity === 6) {
            updatedPoolStats.pity = 0;
            // Check if hard pity should be disabled (character only)
            if (isCharacter && win === true) {
                updatedPoolStats.hard_pity_available = false;
            }
        } else {
            updatedPoolStats.pity += 1;
        }

        // Save to history if 5* or 6*
        if (rarity >= 5) {
            updatedPoolStats.pull_history.push([
                currentPullCount,
                rarity,
                win,
            ]);
            // Keep history sorted by pull_count descending
            updatedPoolStats.pull_history.sort(
                (a, b) => b[0] - a[0]
            );
        }

        // Update currency - ensure we're working with numbers
        if (isCharacter) {
            const currentOroberyl =
                updatedStats.character.oroberyl || 0;
            updatedStats.character = {
                ...updatedStats.character,
                oroberyl: Math.max(
                    0,
                    currentOroberyl - CHAR_COST
                ),
            };
            // Add arsenal token reward
            const currentTokens =
                updatedStats.weapon.arsenal_token || 0;
            updatedStats.weapon = {
                ...updatedStats.weapon,
                arsenal_token:
                    currentTokens +
                    (CHAR_REWARDS[rarity] || 0),
            };
        } else {
            // Weapon cost is per 10 pulls, only deduct once
            if (i === 0) {
                const currentTokens =
                    updatedStats.weapon.arsenal_token || 0;
                updatedStats.weapon = {
                    ...updatedStats.weapon,
                    arsenal_token: Math.max(
                        0,
                        currentTokens - WEAPON_COST
                    ),
                };
            }
        }

        updatedPoolStats.pull_count = currentPullCount;
        results.push({
            rarity,
            win,
            pullNumber: currentPullCount,
        });

        // Update stats reference for next iteration
        // Merge pool stats with existing currency to avoid overwriting currency updates
        if (isCharacter) {
            updatedStats.character = {
                ...updatedPoolStats,
                oroberyl: updatedStats.character.oroberyl, // Preserve currency
            };
        } else {
            updatedStats.weapon = {
                ...updatedPoolStats,
                arsenal_token:
                    updatedStats.weapon.arsenal_token, // Preserve currency
            };
        }
    }

    // Note: Guarantee result (character only, every 240 pulls) is handled separately
    // and not included in roll results as it's a free reward

    return { results, updatedStats };
};

// Add oroberyl
export const addOroberyl = (amount, stats) => {
    const updated = { ...stats };
    updated.character.oroberyl =
        (updated.character.oroberyl || 0) + amount;
    return updated;
};

// Reset pool statistics to default
export const resetPoolStats = (poolType, stats) => {
    const updated = { ...stats };
    if (poolType === "character") {
        // Reset all character stats including pull_history and currency
        updated.character = {
            oroberyl: 0,
            pull_count: 0,
            pity: 0,
            hard_pity_available: true,
            pull_history: [],
        };
    } else {
        // Reset all weapon stats including pull_history and currency
        updated.weapon = {
            arsenal_token: 0,
            pull_count: 0,
            pity: 0,
            pull_history: [],
        };
    }
    return updated;
};

// Get display rates for UI
export const getDisplayRates = (poolType) => {
    if (poolType === "character") {
        return {
            4: CHAR_RATES[4] * 100,
            5: CHAR_RATES[5] * 100,
            6: CHAR_RATES[6] * 100,
        };
    }
    return {
        4: WEAPON_RATES[4] * 100,
        5: WEAPON_RATES[5] * 100,
        6: WEAPON_RATES[6] * 100,
    };
};

// Get costs
export const getCosts = () => ({
    character: { single: CHAR_COST, multi: CHAR_COST * 10 },
    weapon: { single: null, multi: WEAPON_COST },
});
