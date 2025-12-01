import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import ResultCard from "./ResultCard";
import PullHistory from "./PullHistory";
import {
    loadStats,
    saveStats,
    rollGacha,
    addOroberyl,
    resetPoolStats,
    getDisplayRates,
    getCosts,
    getCharSoftPityRate,
} from "./helpers";
import "./GachaSim.css";

function GachaSim() {
    const [poolType, setPoolType] = useState("character");
    const [stats, setStats] = useState(() => loadStats());
    const [results, setResults] = useState([]);
    const [addOroberylAmount, setAddOroberylAmount] =
        useState("");
    const [showAddOroberyl, setShowAddOroberyl] =
        useState(false);
    const [showPullHistory, setShowPullHistory] =
        useState(false);
    const [autoIntervalMs, setAutoIntervalMs] =
        useState(100);
    const [isAutoPulling, setIsAutoPulling] =
        useState(false);

    // Save stats to localStorage whenever they change
    useEffect(() => {
        saveStats(stats);
    }, [stats]);

    const handlePull = useCallback(
        (pulls) => {
            try {
                const {
                    results: newResults,
                    updatedStats,
                } = rollGacha(poolType, pulls, stats);

                const stamped = newResults.map(
                    (result, index) => ({
                        rarity: result.rarity,
                        win: result.win,
                        pullNumber: result.pullNumber,
                        order: index + 1,
                        id: `${Date.now()}-${index}-${
                            result.rarity
                        }`,
                    })
                );

                setResults(stamped);
                setStats(updatedStats);
                // Save immediately after update
                saveStats(updatedStats);
            } catch (error) {
                alert(error.message);
            }
        },
        [poolType, stats]
    );

    const handleAddOroberyl = () => {
        const amount = parseInt(addOroberylAmount, 10);
        if (isNaN(amount) || amount <= 0) {
            alert("Vui lòng nhập số lượng hợp lệ");
            return;
        }
        const updated = addOroberyl(amount, stats);
        setStats(updated);
        saveStats(updated);
        setAddOroberylAmount("");
        setShowAddOroberyl(false);
    };

    const handleResetPool = () => {
        if (
            window.confirm(
                `Bạn có chắc muốn reset statistics của ${
                    poolType === "character"
                        ? "Character"
                        : "Weapon"
                } pool về mặc định?`
            )
        ) {
            const updated = resetPoolStats(poolType, stats);
            setStats(updated);
            saveStats(updated);
            setResults([]);
        }
    };

    const displayRates = useMemo(
        () => getDisplayRates(poolType),
        [poolType]
    );
    const costs = useMemo(() => getCosts(), []);

    const poolStats = stats[poolType];
    const isCharacter = poolType === "character";
    const currency = isCharacter
        ? stats.character.oroberyl
        : stats.weapon.arsenal_token;
    const currencyLabel = isCharacter
        ? "Oroberyl"
        : "Arsenal Token";
    const currencyLabelPlural = `${currencyLabel}(s)`;
    const canPullSingle =
        isCharacter && currency >= costs.character.single;
    const canPullMulti = isCharacter
        ? currency >= costs.character.multi
        : currency >= costs.weapon.multi;

    const sixStarSegments = useMemo(() => {
        if (!poolStats?.pull_history) return [];
        const entries = poolStats.pull_history
            .filter((entry) => entry[1] === 6)
            .map((entry) => ({
                pull: entry[0],
                win: entry[2] === true,
            }));
        entries.sort((a, b) => a.pull - b.pull);
        if (!entries.length) return [];

        let prevPull = 0;
        return entries.map((entry) => {
            const segment = {
                pity: entry.pull - prevPull,
                win: entry.win,
            };
            prevPull = entry.pull;
            return segment;
        });
    }, [poolStats]);

    const getPityProbabilityValue = (pityValue) => {
        if (poolType === "character") {
            return getCharSoftPityRate(
                Math.max(0, pityValue)
            );
        }
        if (pityValue >= 30) return 1;
        return displayRates[6] / 100;
    };

    const getPityTierClass = (pity) => {
        if (pity <= 20) return "pity-label--green";
        if (pity <= 65) return "pity-label--blue";
        if (pity <= 70) return "pity-label--yellow";
        if (pity <= 75) return "pity-label--red";
        if (pity <= 80) return "pity-label--purple";
        return "";
    };

    const pityValues = sixStarSegments.map((segment) =>
        Math.max(0, segment.pity)
    );
    const averagePityRaw =
        pityValues.length > 0
            ? pityValues.reduce(
                  (sum, value) => sum + value,
                  0
              ) / pityValues.length
            : 0;
    const minPity =
        pityValues.length > 0
            ? Math.min(...pityValues)
            : null;
    const maxPity =
        pityValues.length > 0
            ? Math.max(...pityValues)
            : null;

    // Calculate statistics
    const totalPulls = poolStats.pull_count;
    const currentPity = poolStats.pity;
    // Calculate spent currency
    const spentCurrency = isCharacter
        ? totalPulls * costs.character.single
        : Math.floor(totalPulls / 10) * costs.weapon.multi;

    const formatPityMetric = (
        pityValue,
        probabilityValue
    ) => {
        if (
            pityValue === null ||
            probabilityValue === null
        ) {
            return "-- (--%)";
        }
        return `${pityValue} (${probabilityValue.toFixed(
            2
        )}%)`;
    };

    const averagePity =
        pityValues.length > 0
            ? Math.round(averagePityRaw)
            : null;
    const averageProbability =
        pityValues.length > 0
            ? getPityProbabilityValue(averagePityRaw) * 100
            : null;

    const lowestProbability =
        minPity !== null
            ? getPityProbabilityValue(minPity) * 100
            : null;
    const highestProbability =
        maxPity !== null
            ? getPityProbabilityValue(maxPity) * 100
            : null;

    const currentSixRatePercent = (
        getPityProbabilityValue(currentPity) * 100
    ).toFixed(2);

    const handleToggleAutoPull = () => {
        if (isAutoPulling) {
            setIsAutoPulling(false);
            return;
        }
        if (!canPullMulti) {
            alert(
                "Không đủ currency để bắt đầu auto pull."
            );
            return;
        }
        setIsAutoPulling(true);
    };

    useEffect(() => {
        if (!isAutoPulling) return undefined;

        if (!canPullMulti) {
            setIsAutoPulling(false);
            return undefined;
        }

        const interval = Math.max(
            50,
            Number(autoIntervalMs) || 0
        );
        const timer = setTimeout(() => {
            handlePull(10);
        }, interval);

        return () => clearTimeout(timer);
    }, [
        isAutoPulling,
        canPullMulti,
        autoIntervalMs,
        handlePull,
    ]);

    return (
        <div className="gacha-shell">
            <div className="gacha-header">
                <div className="gacha-header__left">
                    <div className="pool-switch">
                        <button
                            type="button"
                            className={`pool-switch__btn ${
                                poolType === "character"
                                    ? "is-active"
                                    : ""
                            }`}
                            onClick={() => {
                                setPoolType("character");
                                setResults([]);
                            }}
                        >
                            Character
                        </button>
                        <button
                            type="button"
                            className={`pool-switch__btn ${
                                poolType === "weapon"
                                    ? "is-active"
                                    : ""
                            }`}
                            onClick={() => {
                                setPoolType("weapon");
                                setResults([]);
                            }}
                        >
                            Weapon
                        </button>
                    </div>
                    <button
                        type="button"
                        className="pool-reset"
                        onClick={handleResetPool}
                        title={`Reset ${
                            poolType === "character"
                                ? "Character"
                                : "Weapon"
                        } pool statistics`}
                    >
                        Reset
                    </button>
                </div>
                <div className="gacha-header__right">
                    <div
                        className="gacha-header__pull-history"
                        style={{ position: "relative" }}
                    >
                        <button
                            type="button"
                            className="pull-history-btn"
                            onClick={() =>
                                setShowPullHistory(
                                    !showPullHistory
                                )
                            }
                            title="Xem Pull History"
                        >
                            Pull History
                        </button>
                        <PullHistory
                            poolType={poolType}
                            stats={stats}
                            isOpen={showPullHistory}
                            onClose={() =>
                                setShowPullHistory(false)
                            }
                        />
                    </div>
                    <div className="currency-display">
                        <span className="currency-display__label">
                            {currencyLabel}:
                        </span>
                        <span className="currency-display__value">
                            {currency.toLocaleString()}
                        </span>
                        {isCharacter && (
                            <button
                                type="button"
                                className="currency-display__add"
                                onClick={() =>
                                    setShowAddOroberyl(
                                        !showAddOroberyl
                                    )
                                }
                                title="Thêm Oroberyl"
                            >
                                +
                            </button>
                        )}
                    </div>
                    {showAddOroberyl && isCharacter && (
                        <div className="add-oroberyl">
                            <input
                                type="number"
                                className="add-oroberyl__input"
                                placeholder="Số lượng"
                                value={addOroberylAmount}
                                onChange={(e) =>
                                    setAddOroberylAmount(
                                        e.target.value
                                    )
                                }
                                min="1"
                            />
                            <button
                                type="button"
                                className="add-oroberyl__btn"
                                onClick={handleAddOroberyl}
                            >
                                Thêm
                            </button>
                            <button
                                type="button"
                                className="add-oroberyl__btn add-oroberyl__btn--cancel"
                                onClick={() => {
                                    setShowAddOroberyl(
                                        false
                                    );
                                    setAddOroberylAmount(
                                        ""
                                    );
                                }}
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="gacha-display">
                {results.length === 0 ? (
                    <div className="gacha-empty">
                        Chưa có kết quả. Thử gacha nhé?
                    </div>
                ) : (
                    <div className="gacha-results">
                        {results.map((result) => (
                            <ResultCard
                                key={result.id}
                                rarity={result.rarity}
                                order={result.order}
                                win={result.win}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="gacha-controls">
                <div className="gacha-controls__body">
                    <div className="gacha-rate-panel">
                        <div className="rate-card">
                            <span className="rate-card__label rate-card__label--five">
                                5★ Rate
                            </span>
                            <span className="rate-card__value rate-card__value--five">
                                {displayRates[5].toFixed(2)}
                                %
                            </span>
                        </div>
                        <div className="rate-card">
                            <span className="rate-card__label">
                                6★ Rate
                            </span>
                            <span
                                className={`rate-card__value ${getPityTierClass(
                                    currentPity
                                )} rate-card__value--six`}
                            >
                                {currentSixRatePercent}%
                            </span>
                        </div>
                    </div>

                    <div className="gacha-stat-panel">
                        <div className="stat-grid__row">
                            <span className="stat-grid__label">
                                Total pulls spent:
                            </span>
                            <span className="stat-grid__value">
                                {totalPulls} ={" "}
                                {spentCurrency.toLocaleString()}{" "}
                                {currencyLabelPlural}
                            </span>
                        </div>
                        <div className="stat-grid__row stat-grid__row--split">
                            <span className="stat-grid__label">
                                Current pity:{" "}
                                <strong>
                                    {currentPity}
                                </strong>
                            </span>
                            <span className="stat-grid__label">
                                Average pity:{" "}
                                <strong>
                                    {formatPityMetric(
                                        averagePity,
                                        averageProbability
                                    )}
                                </strong>
                            </span>
                        </div>
                        <div className="stat-grid__row stat-grid__row--split">
                            <span className="stat-grid__label">
                                Lowest pity:{" "}
                                <strong>
                                    {formatPityMetric(
                                        minPity,
                                        lowestProbability
                                    )}
                                </strong>
                            </span>
                            <span className="stat-grid__label">
                                Highest pity:{" "}
                                <strong>
                                    {formatPityMetric(
                                        maxPity,
                                        highestProbability
                                    )}
                                </strong>
                            </span>
                        </div>
                    </div>
                    <div className="gacha-buttons">
                        <div className="auto-control">
                            <input
                                type="number"
                                min="50"
                                step="50"
                                className="auto-control__input"
                                value={autoIntervalMs}
                                onChange={(e) =>
                                    setAutoIntervalMs(
                                        e.target.value
                                    )
                                }
                                disabled={isAutoPulling}
                            />
                            <button
                                type="button"
                                className={`gacha-button auto-control__button${
                                    isAutoPulling
                                        ? " is-active"
                                        : ""
                                }`}
                                onClick={
                                    handleToggleAutoPull
                                }
                            >
                                {isAutoPulling
                                    ? "Stop Auto"
                                    : "Auto"}
                            </button>
                        </div>

                        <div className="pull-buttons">
                            {isCharacter && (
                                <button
                                    type="button"
                                    className="gacha-button"
                                    onClick={() =>
                                        handlePull(1)
                                    }
                                    disabled={
                                        !canPullSingle ||
                                        isAutoPulling
                                    }
                                >
                                    Pull x1 (
                                    {costs.character.single.toLocaleString()}
                                    )
                                </button>
                            )}
                            <button
                                type="button"
                                className="gacha-button gacha-button--accent"
                                onClick={() =>
                                    handlePull(
                                        isCharacter
                                            ? 10
                                            : 10
                                    )
                                }
                                disabled={!canPullMulti}
                            >
                                Pull x10 (
                                {isCharacter
                                    ? costs.character.multi.toLocaleString()
                                    : costs.weapon.multi.toLocaleString()}
                                )
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GachaSim;
