import { useEffect, useMemo, useState } from "react";
import CollectionSwitch from "./CollectionSwitch";
import CollectionList from "./CollectionList";
import { getCollectionForPool } from "../helpers/collectionHelper";
import { getPoolById } from "../helpers/poolConfig";
import { getStatistics } from "../helpers/localStorageHelper";
import "./CollectionContainer.css";

function CollectionContainer({ poolId, onClose }) {
    const [activePoolId, setActivePoolId] =
        useState(poolId);
    const [items, setItems] = useState([]);
    const [categoryStatistics, setCategoryStatistics] =
        useState(null);
    const [allStatistics, setAllStatistics] =
        useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setActivePoolId(poolId);
    }, [poolId]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        Promise.all([
            getCollectionForPool(activePoolId),
            getStatistics(),
        ])
            .then(([collectionData, allStats]) => {
                if (isMounted) {
                    setItems(
                        collectionData.items ||
                            collectionData
                    );
                    setCategoryStatistics(
                        collectionData.statistics
                    );
                    setAllStatistics(allStats);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [activePoolId]);

    const statisticsDisplay = useMemo(() => {
        const pool = getPoolById(activePoolId);
        const category = pool.category;
        const categoryStats = categoryStatistics?.[
            category
        ] || {
            obtained: 0,
            total: 0,
        };
        const categoryPercent =
            categoryStats.total === 0
                ? 0
                : (categoryStats.obtained /
                      categoryStats.total) *
                  100;
        let allObtained = 0;
        let allTotal = 0;
        if (allStatistics) {
            for (const stats of Object.values(
                allStatistics
            )) {
                allObtained += stats.obtained || 0;
                allTotal += stats.total || 0;
            }
        }
        const allPercent =
            allTotal === 0
                ? 0
                : (allObtained / allTotal) * 100;
        return {
            category: {
                obtained: categoryStats.obtained,
                total: categoryStats.total,
                percent: categoryPercent,
            },
            all: {
                obtained: allObtained,
                total: allTotal,
                percent: allPercent,
            },
        };
    }, [activePoolId, categoryStatistics, allStatistics]);

    return (
        <div
            className="collection-overlay"
            onClick={onClose}
        >
            <div
                className="collection-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="collection-modal__header">
                    <div className="collection-modal__left">
                        <CollectionSwitch
                            poolId={activePoolId}
                            onPoolChange={setActivePoolId}
                        />
                    </div>
                    <div className="collection-modal__center">
                        <span className="collection-modal__metric">
                            Obtained:{" "}
                            {
                                statisticsDisplay.category
                                    .obtained
                            }
                            /
                            {
                                statisticsDisplay.category
                                    .total
                            }{" "}
                            (
                            {statisticsDisplay.category.percent.toFixed(
                                2
                            )}
                            %)
                            {" | "}
                            Total:{" "}
                            {statisticsDisplay.all.obtained}
                            /{statisticsDisplay.all.total} (
                            {statisticsDisplay.all.percent.toFixed(
                                2
                            )}
                            %)
                        </span>
                    </div>
                    <button
                        type="button"
                        className="collection-modal__close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>

                <main className="collection-modal__body">
                    {isLoading ? (
                        <div className="collection-list__empty">
                            Đang tải...
                        </div>
                    ) : (
                        <CollectionList items={items} />
                    )}
                </main>
            </div>
        </div>
    );
}

export default CollectionContainer;
