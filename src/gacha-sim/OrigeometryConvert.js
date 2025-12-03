import { useEffect, useRef, useState } from "react";
import { ORIGEO_TO_OROBERYL_RATE } from "./wallet";

function OrigeometryConvert({
    isOpen,
    onClose,
    wallet,
    onExchange,
}) {
    const containerRef = useRef(null);
    const [amount, setAmount] = useState(1);
    const maxAmount = wallet?.origeometry ?? 0;
    const hasOrigeometry = maxAmount > 0;
    const clampedAmount = Math.min(
        Math.max(amount, 1),
        Math.max(maxAmount, 1)
    );
    const displayAmount = hasOrigeometry
        ? clampedAmount
        : 0;
    const sliderMin = hasOrigeometry ? 1 : 0;
    const sliderMax = hasOrigeometry ? maxAmount : 1;

    useEffect(() => {
        setAmount((prev) => {
            if (maxAmount <= 0) {
                return 1;
            }
            return Math.min(prev, maxAmount);
        });
    }, [maxAmount]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }
        const handleClick = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClick
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const handleAmountChange = (value) => {
        const numeric = Number(value);
        if (Number.isNaN(numeric)) {
            setAmount(1);
            return;
        }
        setAmount(
            Math.min(
                Math.max(numeric, 1),
                Math.max(maxAmount, 1)
            )
        );
    };

    const handleExchange = () => {
        if (maxAmount <= 0) {
            alert("Không đủ Origeometry để chuyển đổi");
            return;
        }
        onExchange(clampedAmount);
    };

    const received =
        displayAmount * ORIGEO_TO_OROBERYL_RATE;

    return (
        <div
            className="origeometry-convert"
            ref={containerRef}
        >
            <div className="origeometry-convert__line">
                <span>
                    {displayAmount} Origeometry ={" "}
                    {received.toLocaleString()} Oroberyls
                </span>
            </div>
            <div className="origeometry-convert__range">
                <button
                    type="button"
                    className="origeometry-convert__step"
                    onClick={() =>
                        handleAmountChange(
                            Math.max(clampedAmount - 1, 1)
                        )
                    }
                    disabled={maxAmount <= 0}
                >
                    Min
                </button>
                <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayAmount}
                    onChange={(event) =>
                        handleAmountChange(
                            event.target.value
                        )
                    }
                    disabled={maxAmount <= 0}
                />
                <button
                    type="button"
                    className="origeometry-convert__step"
                    onClick={() =>
                        handleAmountChange(
                            Math.min(
                                clampedAmount + 1,
                                maxAmount
                            )
                        )
                    }
                    disabled={maxAmount <= 0}
                >
                    Max
                </button>
            </div>
            <label className="origeometry-convert__label">
                or enter number of Origeometrys:
                <input
                    type="number"
                    min={sliderMin}
                    max={sliderMax}
                    value={displayAmount}
                    onChange={(event) =>
                        handleAmountChange(
                            event.target.value
                        )
                    }
                    disabled={maxAmount <= 0}
                />
            </label>
            <button
                type="button"
                className="origeometry-convert__submit"
                onClick={handleExchange}
                disabled={maxAmount <= 0}
            >
                Exchange
            </button>
        </div>
    );
}

export default OrigeometryConvert;
