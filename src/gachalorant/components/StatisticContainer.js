import { useCallback, useEffect, useState } from "react";
import { getCollection } from "../helpers/localStorageHelper";
import StatisticSwitch, { TAB_KEYS } from "./StatisticSwitch";
import StatisticTableRarity from "./StatisticTableRarity";
import StatisticTableQuality from "./StatisticTableQuality";
import "./StatisticContainer.css";

function StatisticContainer({ onClose }) {
    const [activeTab, setActiveTab] = useState(
        TAB_KEYS.rarity
    );
    const [wpDb, setWpDb] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const collection = await getCollection();
            setWpDb(collection.wp_db || {});
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [activeTab, loadData]);

    return (
        <div className="statistic-overlay" onClick={onClose}>
            <div
                className="statistic-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="statistic-modal__header">
                    <h2 className="statistic-modal__title">
                        Statistic
                    </h2>
                    <StatisticSwitch
                        activeTab={activeTab}
                        onChange={setActiveTab}
                    />
                    <button
                        type="button"
                        className="statistic-modal__close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </header>
                <main className="statistic-modal__body">
                    {isLoading ? (
                        <div className="statistic-modal__loading">
                            Đang tải...
                        </div>
                    ) : activeTab === TAB_KEYS.rarity ? (
                        <StatisticTableRarity wpDb={wpDb} />
                    ) : (
                        <StatisticTableQuality wpDb={wpDb} />
                    )}
                </main>
            </div>
        </div>
    );
}

export default StatisticContainer;

