import { useState, useEffect, useRef } from "react";
import ResultItem from "./ResultItem";
import "./ResultList.css";

function ResultList({ results, onOpenLayerCountChange }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [openLayerCount, setOpenLayerCount] = useState(0);
    const imageRefs = useRef([]);

    useEffect(() => {
        if (!results || results.length === 0) {
            setIsLoaded(false);
            setOpenLayerCount(0);
            return;
        }

        setIsLoaded(false);
        imageRefs.current = [];
        const newOpenLayerCount = results.filter(
            (result) => result.isNew
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
    }, [results]);

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
            {results.map((result) => (
                <ResultItem
                    key={result.id}
                    weaponName={result.weaponName}
                    rarityId={result.rarityId}
                    qualityTier={result.qualityTier}
                    qualityValue={result.qualityValue}
                    imageUrl={result.imageUrl}
                    isNew={result.isNew}
                    rewards={result.rewards}
                    onOpenLayerClick={handleOpenLayerClick}
                />
            ))}
        </div>
    );
}

export default ResultList;


