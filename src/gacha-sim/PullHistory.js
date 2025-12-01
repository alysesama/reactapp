import { useEffect, useRef } from "react";
import { getCharSoftPityRate } from "./helpers";
import "./PullHistory.css";

function PullHistory({ poolType, stats, isOpen, onClose }) {
    const tooltipRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
            return () => {
                document.removeEventListener(
                    "mousedown",
                    handleClickOutside
                );
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const poolStats = stats[poolType] || {};
    const pullHistory = poolStats.pull_history || [];
    const totalPulls = poolStats.pull_count || 0;

    // Calculate statistics
    const fiveStarCount = pullHistory.filter(
        (h) => h[1] === 5
    ).length;
    const sixStarCount = pullHistory.filter(
        (h) => h[1] === 6
    ).length;
    const sixStarWin = pullHistory.filter(
        (h) => h[1] === 6 && h[2] === true
    ).length;
    const sixStarLose = pullHistory.filter(
        (h) => h[1] === 6 && h[2] === false
    ).length;

    const fiveStarRate =
        totalPulls > 0
            ? ((fiveStarCount / totalPulls) * 100).toFixed(
                  2
              )
            : "0.00";
    const sixStarRate =
        totalPulls > 0
            ? ((sixStarCount / totalPulls) * 100).toFixed(2)
            : "0.00";
    const winRate =
        sixStarCount > 0
            ? ((sixStarWin / sixStarCount) * 100).toFixed(2)
            : "0.00";
    const loseRate =
        sixStarCount > 0
            ? ((sixStarLose / sixStarCount) * 100).toFixed(
                  2
              )
            : "0.00";

    // Build pity segments between 6★ results (including from 0 to first 6★)
    const sixStarEntries = pullHistory
        .filter((entry) => entry[1] === 6)
        .slice()
        .sort((a, b) => a[0] - b[0]);

    const pitySegments = [];
    if (sixStarEntries.length > 0) {
        let prevPull = 0;
        sixStarEntries.forEach(([pullCount, , winFlag]) => {
            const pity = pullCount - prevPull;
            const isWin = winFlag === true;
            const isLose = winFlag === false;
            pitySegments.push({
                start: prevPull,
                end: pullCount,
                pity,
                isWin,
                isLose,
            });
            prevPull = pullCount;
        });
    }

    // Timeline calculations
    const timelineWidth = Math.max(900, totalPulls * 9); // 8px per pull, minimum 800px
    const markInterval = 10;
    const marks = [];
    if (totalPulls > 0) {
        for (
            let i = 0;
            i <= totalPulls;
            i += markInterval
        ) {
            marks.push(i);
        }
        // Ensure last mark is at totalPulls
        if (marks[marks.length - 1] !== totalPulls) {
            marks.push(totalPulls);
        }
    }

    return (
        <div
            className="pull-history-tooltip"
            ref={tooltipRef}
        >
            <div className="pull-history-container">
                <div className="pull-history-stats">
                    <div className="pull-history-stats__left">
                        <div className="stat-item">
                            <div className="stat-item__label">
                                5★
                            </div>
                            <div className="stat-item__value">
                                {fiveStarCount}
                            </div>
                            <div className="stat-item__rate">
                                {fiveStarRate}%
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item__label">
                                6★
                            </div>
                            <div className="stat-item__value">
                                {sixStarCount}
                            </div>
                            <div className="stat-item__rate">
                                {sixStarRate}%
                            </div>
                        </div>
                    </div>
                    <div className="pull-history-stats__right">
                        <div className="stat-item">
                            <div className="stat-item__label">
                                Win
                            </div>
                            <div className="stat-item__value">
                                {sixStarWin}
                            </div>
                            <div className="stat-item__rate">
                                {winRate}%
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-item__label">
                                Lose
                            </div>
                            <div className="stat-item__value">
                                {sixStarLose}
                            </div>
                            <div className="stat-item__rate">
                                {loseRate}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pull-history-timeline">
                    <div
                        className="timeline-wrapper"
                        style={{
                            width: `${timelineWidth}px`,
                        }}
                    >
                        <div className="timeline-line">
                            {marks.map((mark) => {
                                const markPosition =
                                    totalPulls > 0
                                        ? (mark /
                                              totalPulls) *
                                          100
                                        : 0;
                                return (
                                    <div
                                        key={mark}
                                        className="timeline-mark"
                                        style={{
                                            left: `${markPosition}%`,
                                        }}
                                    >
                                        <div className="timeline-mark__line"></div>
                                        <div className="timeline-mark__label">
                                            {mark}
                                        </div>
                                    </div>
                                );
                            })}

                            {pitySegments.map(
                                (segment, index) => {
                                    const {
                                        start,
                                        end,
                                        pity,
                                        isWin,
                                        isLose,
                                    } = segment;
                                    if (
                                        totalPulls <= 0 ||
                                        end <= start
                                    )
                                        return null;

                                    const spanPercent =
                                        ((end - start) /
                                            totalPulls) *
                                        100;
                                    const minPixelWidth = 12; // ensure very small pity segments still visible
                                    const minPercent =
                                        (minPixelWidth /
                                            timelineWidth) *
                                        100;
                                    const width = Math.max(
                                        spanPercent,
                                        minPercent
                                    );
                                    const center =
                                        ((start + end) /
                                            2 /
                                            totalPulls) *
                                        100;
                                    let left =
                                        center - width / 2;
                                    left = Math.max(
                                        0,
                                        Math.min(
                                            100 - width,
                                            left
                                        )
                                    );

                                    let labelText =
                                        String(pity);
                                    if (
                                        poolType ===
                                            "character" &&
                                        pity > 65
                                    ) {
                                        const prob =
                                            getCharSoftPityRate(
                                                pity
                                            ) * 100;
                                        labelText += ` (${prob.toFixed(
                                            2
                                        )}%)`;
                                    }

                                    let tierClass = "";
                                    if (pity <= 20)
                                        tierClass =
                                            "pity-label--green";
                                    else if (pity <= 65)
                                        tierClass =
                                            "pity-label--blue";
                                    else if (pity <= 70)
                                        tierClass =
                                            "pity-label--yellow";
                                    else if (pity <= 75)
                                        tierClass =
                                            "pity-label--red";
                                    else if (pity <= 80)
                                        tierClass =
                                            "pity-label--purple";

                                    const positionClass =
                                        isWin
                                            ? "pity-label--above"
                                            : isLose
                                            ? "pity-label--below"
                                            : "pity-label--above";

                                    return (
                                        <div
                                            key={`pity-${index}`}
                                            className={`pity-label ${positionClass} ${tierClass}`}
                                            style={{
                                                left: `${left}%`,
                                                width: `${width}%`,
                                            }}
                                        >
                                            <div
                                                className={`pity-label__line ${tierClass}`}
                                            />
                                            <div className="pity-label__text">
                                                +{labelText}
                                            </div>
                                        </div>
                                    );
                                }
                            )}

                            {pullHistory.map(
                                (entry, index) => {
                                    const [
                                        pullCount,
                                        rarity,
                                        win,
                                    ] = entry;
                                    const position =
                                        totalPulls > 0
                                            ? (pullCount /
                                                  totalPulls) *
                                              100
                                            : 0;
                                    const isWin =
                                        win === true;
                                    const isLose =
                                        win === false;

                                    // Ensure position is within bounds
                                    const clampedPosition =
                                        Math.max(
                                            0,
                                            Math.min(
                                                100,
                                                position
                                            )
                                        );

                                    return (
                                        <div
                                            key={`${pullCount}-${rarity}-${index}`}
                                            className={`timeline-dot timeline-dot--${
                                                rarity === 5
                                                    ? "five"
                                                    : "six"
                                            } ${
                                                isWin
                                                    ? "is-win"
                                                    : ""
                                            } ${
                                                isLose
                                                    ? "is-lose"
                                                    : ""
                                            }`}
                                            style={{
                                                left: `${clampedPosition}%`,
                                            }}
                                        >
                                            {rarity ===
                                                6 && (
                                                <>
                                                    {isWin && (
                                                        <div className="timeline-dot__label timeline-dot__label--above">
                                                            {
                                                                pullCount
                                                            }
                                                        </div>
                                                    )}
                                                    {isLose && (
                                                        <div className="timeline-dot__label timeline-dot__label--below">
                                                            {
                                                                pullCount
                                                            }
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {rarity ===
                                                5 && (
                                                <div className="timeline-dot__label timeline-dot__label--hover">
                                                    {
                                                        pullCount
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PullHistory;
