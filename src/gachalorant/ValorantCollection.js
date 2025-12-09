import { useState, useEffect } from "react";
import { rollValorantOnce } from "./helpers/gachaHelper";
import {
    processGachaResult,
    getWallet,
    topUpWallet,
    purchaseBundle,
    canAffordPull,
    deductPullCost,
    getPullCost,
} from "./helpers/localStorageHelper";
import { isKnifePool } from "./helpers/poolConfig";
import PoolSwitch from "./components/PoolSwitch";
import ResultList from "./components/ResultList";
import CollectionContainer from "./components/CollectionContainer";
import PaymentDrawerValorant from "./components/PaymentDrawerValorant";
import bundles from "./bundles.json";
import "./ValorantCollection.css";

const DEFAULT_POOL_ID = "classic";

async function rollMultiple(poolId, pulls) {
    const count = Math.max(1, pulls);
    const tasks = [];
    for (let index = 0; index < count; index += 1) {
        tasks.push(rollValorantOnce(poolId));
    }
    const rolls = await Promise.all(tasks);
    const results = [];
    for (const roll of rolls) {
        if (roll) {
            const result = await processGachaResult(roll);
            if (result) {
                results.push(result);
            }
        }
    }
    return results;
}

function ValorantCollection() {
    const [poolId, setPoolId] = useState(DEFAULT_POOL_ID);
    const [results, setResults] = useState([]);
    const [hasOpenLayers, setHasOpenLayers] =
        useState(false);
    const [isCollectionOpen, setIsCollectionOpen] =
        useState(false);
    const [collectionPoolId, setCollectionPoolId] =
        useState(DEFAULT_POOL_ID);
    const [wallet, setWallet] = useState(() => getWallet());
    const [isPaymentOpen, setIsPaymentOpen] =
        useState(false);

    useEffect(() => {
        const currentWallet = getWallet();
        setWallet(currentWallet);
    }, []);

    const handlePull = async (pulls) => {
        if (!canAffordPull(poolId, pulls)) {
            const cost = getPullCost(poolId, pulls);
            const resource = isKnifePool(poolId)
                ? "R-Points"
                : "V-Points";
            const amount = isKnifePool(poolId)
                ? cost.rPoints
                : cost.vPoints;
            alert(
                `Không đủ ${resource} để pull. Cần ${amount.toLocaleString()} ${resource}.`
            );
            return;
        }
        const deductedWallet = deductPullCost(
            poolId,
            pulls
        );
        if (!deductedWallet) {
            alert(
                "Lỗi khi trừ resource. Vui lòng thử lại."
            );
            return;
        }
        setWallet(deductedWallet);
        try {
            const nextResults = await rollMultiple(
                poolId,
                pulls
            );
            setResults(nextResults);
            const updatedWallet = getWallet();
            setWallet(updatedWallet);
        } catch (error) {
            console.error("Error during pull:", error);
            alert(
                "Có lỗi xảy ra khi pull. Vui lòng thử lại."
            );
        }
    };

    const handleOpenLayerCountChange = (count) => {
        setHasOpenLayers(count > 0);
    };

    const handleOpenCollection = () => {
        setCollectionPoolId(poolId);
        setIsCollectionOpen(true);
    };

    const handleCloseCollection = () => {
        setIsCollectionOpen(false);
    };

    const handleTopUpUsd = (amount) => {
        topUpWallet(amount);
        const updatedWallet = getWallet();
        setWallet(updatedWallet);
    };

    const handleCheckoutBundle = (bundle) => {
        const updatedWallet = purchaseBundle(
            bundle.id,
            bundle.price_usd
        );
        if (updatedWallet) {
            setWallet(updatedWallet);
        }
    };

    const getPullButtonLabel = (pulls) => {
        const cost = getPullCost(poolId, pulls);
        const isKnife = isKnifePool(poolId);
        const resource = isKnife ? "R-Points" : "V-Points";
        const amount = isKnife
            ? cost.rPoints
            : cost.vPoints;
        return `Pull ${pulls} (${amount.toLocaleString()} ${resource})`;
    };

    const vPointIcon =
        (process.env.PUBLIC_URL ?? "") +
        "/valorant_assets/common/v-point.png";
    const rPointIcon =
        (process.env.PUBLIC_URL ?? "") +
        "/valorant_assets/common/r-point.png";

    return (
        <div className="vlc-shell">
            <header className="vlc-header">
                <div className="vlc-header__left">
                    <PoolSwitch
                        poolId={poolId}
                        onPoolChange={setPoolId}
                    />
                    <button
                        type="button"
                        className="vlc-button"
                        onClick={handleOpenCollection}
                    >
                        Collection
                    </button>
                </div>
                <div className="vlc-header__right">
                    <div className="vlc-currency">
                        <img
                            src={rPointIcon}
                            alt="R-Point"
                            className="vlc-currency__icon"
                        />
                        <span className="vlc-currency__value">
                            {(
                                wallet.rPoints || 0
                            ).toLocaleString()}
                        </span>
                    </div>
                    <div className="vlc-currency vlc-currency--accent">
                        <img
                            src={vPointIcon}
                            alt="V-Point"
                            className="vlc-currency__icon"
                        />
                        <span className="vlc-currency__value">
                            {(
                                wallet.vPoints || 0
                            ).toLocaleString()}
                        </span>
                        <button
                            type="button"
                            className="vlc-currency__add"
                            onClick={() =>
                                setIsPaymentOpen(true)
                            }
                        >
                            +
                        </button>
                    </div>
                </div>
            </header>

            <main className="vlc-display">
                {results.length === 0 ? (
                    <div className="vlc-empty">
                        Chưa có kết quả. Thử gacha Valorant?
                    </div>
                ) : (
                    <ResultList
                        results={results}
                        onOpenLayerCountChange={
                            handleOpenLayerCountChange
                        }
                    />
                )}
            </main>

            <footer className="vlc-controls">
                <div className="vlc-pull-buttons">
                    <button
                        type="button"
                        className="vlc-button"
                        onClick={() => handlePull(1)}
                        disabled={
                            hasOpenLayers ||
                            !canAffordPull(poolId, 1)
                        }
                    >
                        {getPullButtonLabel(1)}
                    </button>
                    <button
                        type="button"
                        className="vlc-button vlc-button--accent"
                        onClick={() => handlePull(10)}
                        disabled={
                            hasOpenLayers ||
                            !canAffordPull(poolId, 10)
                        }
                    >
                        {getPullButtonLabel(10)}
                    </button>
                </div>
            </footer>
            {isCollectionOpen && (
                <CollectionContainer
                    poolId={collectionPoolId}
                    onClose={handleCloseCollection}
                />
            )}
            {isPaymentOpen && (
                <PaymentDrawerValorant
                    isOpen={isPaymentOpen}
                    onClose={() => setIsPaymentOpen(false)}
                    wallet={{
                        balance_usd:
                            wallet.balance_usd || 0,
                        balance_usd_spent:
                            wallet.balance_usd_spent || 0,
                        vpoint: wallet.vPoints || 0,
                        bundles_info: bundles,
                    }}
                    onTopUp={handleTopUpUsd}
                    onCheckout={handleCheckoutBundle}
                />
            )}
        </div>
    );
}

export default ValorantCollection;
