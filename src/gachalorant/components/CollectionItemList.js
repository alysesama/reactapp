import "./CollectionContainer.css";

const QUALITY_TIERS = [
    { id: 1, min: 0, max: 30 },
    { id: 2, min: 30, max: 55 },
    { id: 3, min: 55, max: 75 },
    { id: 4, min: 75, max: 90 },
    { id: 5, min: 90, max: 100 },
];

const QUALITY_TIER_ROMAN = {
    1: "I",
    2: "II",
    3: "III",
    4: "IV",
    5: "V",
};

function buildRarityClass(rarityId) {
    if (!rarityId) {
        return "";
    }
    return `vlc-result-item--rarity-${rarityId}`;
}

function formatQuality(value) {
    if (typeof value !== "number") {
        return "";
    }
    return value.toFixed(8);
}

function getQualityTierId(qualityValue) {
    if (typeof qualityValue !== "number") {
        return 1;
    }
    const matched =
        QUALITY_TIERS.find(
            (tier) =>
                qualityValue >= tier.min &&
                qualityValue < tier.max
        ) ?? QUALITY_TIERS[QUALITY_TIERS.length - 1];
    return matched.id;
}

function CollectionItemList({
    weaponName,
    rarityId,
    tierLabel,
    maxQualityValue,
    counts,
    imageUrl,
    rarityIconUrl,
}) {
    const rarityClass = buildRarityClass(rarityId);
    const qualityTier = getQualityTierId(maxQualityValue);
    const calculatedTierLabel =
        QUALITY_TIER_ROMAN[qualityTier] ?? "I";
    const totalCount =
        (counts?.[1] || 0) +
        (counts?.[2] || 0) +
        (counts?.[3] || 0) +
        (counts?.[4] || 0) +
        (counts?.[5] || 0);
    const isUnobtain = totalCount === 0;
    const shouldShowOverlay = isUnobtain && rarityId > 2;
    const base = process.env.PUBLIC_URL ?? "";
    const overlayRarityIconUrl = rarityId
        ? `${base}/valorant_assets/common/rarity-${rarityId}.svg`
        : null;
    return (
        <article
            className={`collection-item ${rarityClass}${
                isUnobtain ? " unobtain" : ""
            }`.trim()}
            data-quality-tier={qualityTier}
        >
            <div className="collection-item__body">
                {rarityIconUrl ? (
                    <img
                        className="collection-item__icon-bg"
                        src={rarityIconUrl}
                        alt=""
                        aria-hidden="true"
                    />
                ) : null}
                {imageUrl ? (
                    <img
                        className="collection-item__weapon-image"
                        src={imageUrl}
                        alt={weaponName}
                        loading="lazy"
                    />
                ) : null}
            </div>
            <div className="collection-item__name">
                {weaponName}
            </div>
            <div className="collection-item__quality">
                <span className="collection-item__quality-label">
                    Highest Quality value:
                </span>
                <span className="collection-item__quality-value">
                    {calculatedTierLabel}:&nbsp;
                    {formatQuality(maxQualityValue)}%
                </span>
            </div>
            <div className="collection-item__counts">
                {[1, 2, 3, 4, 5].map((tier) => {
                    const value = counts?.[tier] ?? 0;
                    const isZero = value === 0;
                    const className = isZero
                        ? "collection-item__count is-zero"
                        : `collection-item__count collection-item__count--tier-${tier}`;
                    return (
                        <span
                            key={tier}
                            className={className}
                        >
                            {value}
                        </span>
                    );
                })}
            </div>
            {shouldShowOverlay && (
                <div
                    className={`collection-item__overlay ${rarityClass}`.trim()}
                >
                    <div className="collection-item__overlay-body">
                        {overlayRarityIconUrl && (
                            <img
                                className="collection-item__overlay-icon-bg"
                                src={overlayRarityIconUrl}
                                alt=""
                                aria-hidden="true"
                            />
                        )}
                    </div>
                </div>
            )}
        </article>
    );
}

export default CollectionItemList;
