import "./StatisticContainer.css";

const TAB_KEYS = {
    rarity: "rarity",
    quality: "quality",
};

function StatisticSwitch({ activeTab, onChange }) {
    return (
        <div className="statistic-switch">
            <button
                type="button"
                className={`statistic-switch__tab ${
                    activeTab === TAB_KEYS.rarity
                        ? "is-active"
                        : ""
                }`}
                onClick={() => onChange(TAB_KEYS.rarity)}
            >
                Rarity Analysis
            </button>
            <button
                type="button"
                className={`statistic-switch__tab ${
                    activeTab === TAB_KEYS.quality
                        ? "is-active"
                        : ""
                }`}
                onClick={() => onChange(TAB_KEYS.quality)}
            >
                Quality Analysis
            </button>
        </div>
    );
}

export default StatisticSwitch;
export { TAB_KEYS };

