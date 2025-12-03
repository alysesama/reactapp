import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    BASE_CURRENCY,
    SUPPORTED_CURRENCIES,
} from "./wallet";

const CACHE_KEY = "gacha_sim_currency_rates";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const RATES_ENDPOINT =
    "https://open.er-api.com/v6/latest/CNY";

const buildInitialRates = () => {
    const initial = {};
    SUPPORTED_CURRENCIES.forEach(({ code }) => {
        initial[code] = code === BASE_CURRENCY ? 1 : null;
    });
    return initial;
};

const readCache = () => {
    if (typeof window === "undefined") {
        return null;
    }
    try {
        const raw = window.localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            !parsed?.timestamp ||
            Date.now() - parsed.timestamp > CACHE_TTL_MS
        ) {
            return null;
        }
        return parsed.rates || null;
    } catch (error) {
        console.warn(
            "Không thể đọc cache currency:",
            error
        );
        return null;
    }
};

const writeCache = (rates) => {
    if (typeof window === "undefined") {
        return;
    }
    try {
        window.localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
                timestamp: Date.now(),
                rates,
            })
        );
    } catch (error) {
        console.warn(
            "Không thể lưu cache currency:",
            error
        );
    }
};

const buildRates = (payload) => {
    if (!payload?.rates) {
        return buildInitialRates();
    }
    return SUPPORTED_CURRENCIES.reduce(
        (acc, { code }) => ({
            ...acc,
            [code]:
                code === BASE_CURRENCY
                    ? 1
                    : payload.rates[code] ?? null,
        }),
        {}
    );
};

export const useCurrencyRates = () => {
    const [rates, setRates] = useState(() => {
        const cached = readCache();
        return cached || buildInitialRates();
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRates = useCallback(async () => {
        if (typeof window === "undefined") {
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(RATES_ENDPOINT);
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            const payload = await response.json();
            if (payload?.result === "error") {
                throw new Error(
                    payload?.error || "API error"
                );
            }
            const freshRates = buildRates(payload);
            setRates(freshRates);
            writeCache(freshRates);
        } catch (fetchError) {
            console.error(
                "Không thể tải currency rates:",
                fetchError
            );
            setError(
                fetchError?.message ||
                    "Không thể tải tỷ giá tiền tệ"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (readCache()) {
            return;
        }
        fetchRates();
    }, [fetchRates]);

    const convertFromCny = useCallback(
        (amount, targetCurrency) => {
            if (!amount) return 0;
            if (targetCurrency === BASE_CURRENCY) {
                return amount;
            }
            const rate = rates[targetCurrency];
            if (!rate || rate <= 0) {
                return amount;
            }
            return amount * rate;
        },
        [rates]
    );

    const convertToCny = useCallback(
        (amount, sourceCurrency) => {
            if (!amount) return 0;
            if (sourceCurrency === BASE_CURRENCY) {
                return amount;
            }
            const rate = rates[sourceCurrency];
            if (!rate || rate <= 0) {
                return 0;
            }
            return amount / rate;
        },
        [rates]
    );

    const metaMap = useMemo(
        () =>
            SUPPORTED_CURRENCIES.reduce(
                (acc, entry) => ({
                    ...acc,
                    [entry.code]: entry,
                }),
                {}
            ),
        []
    );

    const formatDisplay = useCallback(
        (amountCny, targetCurrency) => {
            const meta =
                metaMap[targetCurrency] ||
                metaMap[BASE_CURRENCY];
            const value = convertFromCny(
                amountCny,
                targetCurrency
            );
            return `${meta.symbol}${value.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: meta.decimals,
                    maximumFractionDigits: meta.decimals,
                }
            )}`;
        },
        [convertFromCny, metaMap]
    );

    return {
        rates,
        isLoading,
        error,
        refresh: fetchRates,
        convertFromCny,
        convertToCny,
        formatDisplay,
    };
};
