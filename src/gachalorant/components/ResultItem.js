import { useState, useRef } from "react";
import "./ResultItem.css";

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

function formatQuality(qualityValue) {
    if (typeof qualityValue !== "number") {
        return "";
    }
    return `${qualityValue.toFixed(8)}%`;
}

function getRarityIconUrl(rarityId) {
    if (!rarityId) {
        return null;
    }
    const base = process.env.PUBLIC_URL ?? "";
    return `${base}/valorant_assets/common/rarity-${rarityId}.svg`;
}

function getRewardImageUrl(type) {
    const base = process.env.PUBLIC_URL ?? "";
    return `${base}/valorant_assets/common/${type}-point.png`;
}

function ResultItem({
    weaponName,
    rarityId,
    qualityTier,
    qualityValue,
    isNew,
    rewards,
    imageUrl,
    onOpenLayerClick,
}) {
    const [isOpenLayerVisible, setIsOpenLayerVisible] =
        useState(isNew ?? false);
    const openLayerRef = useRef(null);
    const rarityClass = buildRarityClass(rarityId);
    const tierLabel = QUALITY_TIER_ROMAN[qualityTier] ?? "";
    const qualityLabel = formatQuality(qualityValue);
    const rarityIconUrl = getRarityIconUrl(rarityId);

    const handleOpenLayerClick = () => {
        if (openLayerRef.current) {
            openLayerRef.current.classList.add(
                "vlc-result-item__open-layer--opening"
            );
            setTimeout(() => {
                setIsOpenLayerVisible(false);
                if (onOpenLayerClick) {
                    onOpenLayerClick();
                }
            }, 500);
        } else {
            setIsOpenLayerVisible(false);
            if (onOpenLayerClick) {
                onOpenLayerClick();
            }
        }
    };

    return (
        <article
            className={`vlc-result-item ${rarityClass}`.trim()}
            data-quality-tier={qualityTier}
        >
            <div className="vlc-result-item__body">
                {rarityIconUrl && (
                    <img
                        className="vlc-result-item__rarity-icon-bg"
                        src={rarityIconUrl}
                        alt=""
                        aria-hidden="true"
                    />
                )}
                {isNew && (
                    <div className="vlc-result-item__new-tag">
                        NEW
                    </div>
                )}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={weaponName}
                        className="vlc-result-item__weapon-image"
                        loading="lazy"
                    />
                ) : null}
            </div>
            <div className="vlc-result-item__weapon-name">
                {weaponName}
            </div>
            {tierLabel && (
                <div className="vlc-result-item__tier-wrapper">
                    <span className="vlc-result-item__tier">
                        Tier {tierLabel}
                    </span>
                    {qualityLabel && (
                        <span className="vlc-result-item__quality-float">
                            {qualityLabel}
                        </span>
                    )}
                </div>
            )}
            {rewards && (
                <div className="vlc-result-item__rewards">
                    {rewards.vPoint > 0 && (
                        <div className="vlc-result-item__reward-item">
                            <span className="vlc-result-item__reward-value">
                                +{rewards.vPoint}
                            </span>
                            <img
                                className="vlc-result-item__reward-icon"
                                src={getRewardImageUrl("v")}
                                alt="V-Point"
                            />
                        </div>
                    )}
                    {rewards.rPoint > 0 && (
                        <div className="vlc-result-item__reward-item">
                            <span className="vlc-result-item__reward-value">
                                +{rewards.rPoint}
                            </span>
                            <img
                                className="vlc-result-item__reward-icon"
                                src={getRewardImageUrl("r")}
                                alt="R-Point"
                            />
                        </div>
                    )}
                </div>
            )}
            {isNew && isOpenLayerVisible && (
                <div
                    ref={openLayerRef}
                    className={`vlc-result-item__open-layer ${rarityClass}`.trim()}
                    onClick={handleOpenLayerClick}
                >
                    <div className="vlc-result-item__open-layer-body">
                        {rarityIconUrl && (
                            <img
                                className="vlc-result-item__open-layer-icon-bg"
                                src={rarityIconUrl}
                                alt=""
                                aria-hidden="true"
                            />
                        )}
                        <div className="vlc-result-item__open-layer-new-tag">
                            NEW
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

export default ResultItem;
