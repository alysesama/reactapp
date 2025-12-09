export const KNIFE_POOL_ID = "knife";

export const VALORANT_POOLS = [
    {
        id: "classic",
        label: "Classic",
        category: "classic",
    },
    {
        id: "shorty",
        label: "Shorty",
        category: "shorty",
    },
    {
        id: "frenzy",
        label: "Frenzy",
        category: "frenzy",
    },
    {
        id: "ghost",
        label: "Ghost",
        category: "ghost",
    },
    {
        id: "sheriff",
        label: "Sheriff",
        category: "sheriff",
    },
    {
        id: "stinger",
        label: "Stinger",
        category: "stinger",
    },
    {
        id: "spectre",
        label: "Spectre",
        category: "spectre",
    },
    {
        id: "bucky",
        label: "Bucky",
        category: "bucky",
    },
    {
        id: "judge",
        label: "Judge",
        category: "judge",
    },
    {
        id: "bulldog",
        label: "Bulldog",
        category: "bulldog",
    },
    {
        id: "guardian",
        label: "Guardian",
        category: "guardian",
    },
    {
        id: "phantom",
        label: "Phantom",
        category: "phantom",
    },
    {
        id: "vandal",
        label: "Vandal",
        category: "vandal",
    },
    {
        id: "marshal",
        label: "Marshal",
        category: "marshal",
    },
    {
        id: "outlaw",
        label: "Outlaw",
        category: "outlaw",
    },
    {
        id: "operator",
        label: "Operator",
        category: "operator",
    },
    {
        id: "ares",
        label: "Ares",
        category: "ares",
    },
    {
        id: "odin",
        label: "Odin",
        category: "odin",
    },
];

export const KNIFE_POOL = {
    id: KNIFE_POOL_ID,
    label: "Knife",
    category: "meele",
};

export function isKnifePool(poolId) {
    return poolId === KNIFE_POOL_ID;
}

export function getPoolById(poolId) {
    if (poolId === KNIFE_POOL_ID) {
        return KNIFE_POOL;
    }
    return (
        VALORANT_POOLS.find((pool) => pool.id === poolId) ??
        VALORANT_POOLS[0]
    );
}
