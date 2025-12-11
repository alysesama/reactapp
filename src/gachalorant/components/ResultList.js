import { useState, useEffect, useRef } from "react";
import ResultItem from "./ResultItem";
import "./ResultList.css";

function ResultList({
    results,
    onOpenLayerCountChange,
    skipNewLayer,
    includeHighRarity,
}) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [openLayerCount, setOpenLayerCount] = useState(0);
    const imageRefs = useRef([]);

    const shouldShowOpenLayer = (result) => {
        if (!result.isNew) {
            return false;
        }
        if (!skipNewLayer) {
            return true;
        }
        if (includeHighRarity) {
            return false;
        }
        return (
            result.rarityId === 4 || result.rarityId === 5
        );
    };

    useEffect(() => {
        if (!results || results.length === 0) {
            setIsLoaded(false);
            setOpenLayerCount(0);
            return;
        }

        setIsLoaded(false);
        imageRefs.current = [];
        const newOpenLayerCount = results.filter((result) =>
            shouldShowOpenLayer(result)
        ).length;
        setOpenLayerCount(newOpenLayerCount);

        const imagePromises = results
            .filter((result) => result.imageUrl)
            .map((result) => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                    img.src = result.imageUrl;
                    imageRefs.current.push(img);
                });
            });

        Promise.all(imagePromises).then(() => {
            setIsLoaded(true);
        });
    }, [results, skipNewLayer, includeHighRarity]);

    useEffect(() => {
        if (onOpenLayerCountChange) {
            onOpenLayerCountChange(openLayerCount);
        }
    }, [openLayerCount, onOpenLayerCountChange]);

    const handleOpenLayerClick = () => {
        setOpenLayerCount((prev) => Math.max(0, prev - 1));
    };

    if (!results || results.length === 0) {
        return null;
    }

    return (
        <div
            className="vlc-results"
            style={{
                opacity: isLoaded ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
            }}
        >
            {results.map((result) => {
                const allowOpenLayer =
                    shouldShowOpenLayer(result);
                return (
                    <ResultItem
                        key={result.id}
                        weaponName={result.weaponName}
                        rarityId={result.rarityId}
                        qualityTier={result.qualityTier}
                        qualityValue={result.qualityValue}
                        imageUrl={result.imageUrl}
                        isNew={result.isNew}
                        rewards={result.rewards}
                        allowOpenLayer={allowOpenLayer}
                        onOpenLayerClick={
                            handleOpenLayerClick
                        }
                    />
                );
            })}
        </div>
    );
}

export default ResultList;
