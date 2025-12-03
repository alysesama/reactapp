import "./GachaSim.css";

const rarityClassMap = {
    4: "rarity-4",
    5: "rarity-5",
    6: "rarity-6",
};

const rarityLabel = {
    4: "",
    5: "",
    6: "",
};

function ResultCard({ rarity, order, win }) {
    const rarityClass =
        rarityClassMap[rarity] ?? rarityClassMap[4];
    const title = rarityLabel[rarity] ?? rarityLabel[4];
    const showWinLose = rarity === 6 && win !== null;

    return (
        <div className={`result-card ${rarityClass}`}>
            <div className="result-card__order"></div>
            <div className="result-card__rarity">
                {rarity}★
            </div>
            {showWinLose && (
                <div
                    className={`result-card__winlose ${
                        win ? "is-win" : "is-lose"
                    }`}
                >
                    {win ? "Rate-up" : "Off-Rate"}
                </div>
            )}
            <div className="result-card__label">
                {title}
            </div>
        </div>
    );
}

export default ResultCard;
