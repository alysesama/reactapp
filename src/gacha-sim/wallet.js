import bundles from "./bundles.json";

export const BASE_CURRENCY = "CNY";
export const SUPPORTED_CURRENCIES = [
    {
        code: "CNY",
        label: "CNY (¥)",
        symbol: "¥",
        decimals: 2,
    },
    {
        code: "USD",
        label: "USD ($)",
        symbol: "$",
        decimals: 2,
    },
    {
        code: "JPY",
        label: "JPY (¥)",
        symbol: "¥",
        decimals: 0,
    },
    {
        code: "VND",
        label: "VND (₫)",
        symbol: "₫",
        decimals: 0,
    },
];
export const ORIGEO_TO_OROBERYL_RATE = 75;

const createBundleEntry = (bundle, index) => ({
    id: bundle.id || `bundle_${index + 1}`,
    name: bundle.name || `Bundle ${index + 1}`,
    price_cny: bundle.price_cny,
    return_fixed: { ...bundle.return_fixed },
    return_bonus: { ...bundle.return_bonus },
    return_first_bonus: { ...bundle.return_first_bonus },
    return_first_bonus_available: true,
});

export const createDefaultWallet = () => ({
    balance_cny: 0,
    balance_cny_spent: 0,
    origeometry: 0,
    oroberyls: 0,
    bundles_info: bundles.map(createBundleEntry),
});

export const hydrateWallet = (storedWallet) => {
    const base = createDefaultWallet();
    if (!storedWallet) {
        return base;
    }
    const storedBundles = Array.isArray(
        storedWallet.bundles_info
    )
        ? storedWallet.bundles_info
        : [];
    return {
        balance_cny: Number(storedWallet.balance_cny) || 0,
        balance_cny_spent:
            Number(storedWallet.balance_cny_spent) || 0,
        origeometry:
            parseInt(storedWallet.origeometry, 10) || 0,
        oroberyls:
            parseInt(
                storedWallet.oroberyls ??
                    storedWallet.oroberyl,
                10
            ) || 0,
        bundles_info: base.bundles_info.map((bundle) => {
            const existing = storedBundles.find(
                (entry) => entry.id === bundle.id
            );
            if (!existing) {
                return bundle;
            }
            return {
                ...bundle,
                return_first_bonus_available:
                    existing.return_first_bonus_available !==
                    undefined
                        ? existing.return_first_bonus_available
                        : true,
            };
        }),
    };
};

export const getBundleById = (wallet, bundleId) =>
    wallet.bundles_info.find(
        (bundle) => bundle.id === bundleId
    ) || null;

export const getBundleReward = (bundle) => {
    if (!bundle) return 0;
    const bonus = bundle.return_first_bonus_available
        ? bundle.return_first_bonus.origeometry
        : bundle.return_bonus.origeometry;
    return bundle.return_fixed.origeometry + bonus;
};

export const applyBundlePurchase = (wallet, bundleId) => {
    const bundle = getBundleById(wallet, bundleId);
    if (!bundle) {
        throw new Error("Không tìm thấy bundle đã chọn");
    }
    if (wallet.balance_cny < bundle.price_cny) {
        throw new Error("Balance không đủ cho bundle này");
    }
    const reward = getBundleReward(bundle);
    return {
        wallet: {
            ...wallet,
            balance_cny:
                wallet.balance_cny - bundle.price_cny,
            balance_cny_spent:
                wallet.balance_cny_spent + bundle.price_cny,
            origeometry: wallet.origeometry + reward,
            bundles_info: wallet.bundles_info.map((entry) =>
                entry.id === bundle.id
                    ? {
                          ...entry,
                          return_first_bonus_available: false,
                      }
                    : entry
            ),
        },
        reward,
    };
};

export const addBalance = (wallet, amountCny) => ({
    ...wallet,
    balance_cny: wallet.balance_cny + amountCny,
});

export const spendOroberyls = (wallet, amount) => {
    if (amount <= 0) {
        return wallet;
    }
    const next = Math.max(wallet.oroberyls - amount, 0);
    return {
        ...wallet,
        oroberyls: next,
    };
};

export const addOroberylsToWallet = (wallet, amount) => {
    if (amount <= 0) {
        return wallet;
    }
    return {
        ...wallet,
        oroberyls: wallet.oroberyls + amount,
    };
};

export const convertOrigeometry = (wallet, amount) => {
    if (amount <= 0 || amount > wallet.origeometry) {
        throw new Error(
            "Số lượng Origeometry không hợp lệ"
        );
    }
    const received = amount * ORIGEO_TO_OROBERYL_RATE;
    return {
        wallet: {
            ...wallet,
            origeometry: wallet.origeometry - amount,
            oroberyls: wallet.oroberyls + received,
        },
        received,
    };
};
