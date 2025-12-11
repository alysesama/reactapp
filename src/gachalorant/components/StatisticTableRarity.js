import { useMemo } from "react";
import { RARITY_TABLE } from "../helpers/gachaHelper";
import {
    computeRarityStats,
    formatPercent,
} from "../helpers/statisticHelper";
import "./StatisticContainer.css";

function StatisticTableRarity({ wpDb }) {
    const data = useMemo(
        () => computeRarityStats(wpDb),
        [wpDb]
    );
    const categories = useMemo(() => {
        return [...data.categories].sort((a, b) => {
            const isKnifeA = a.label === "Knife";
            const isKnifeB = b.label === "Knife";
            if (isKnifeA === isKnifeB) {
                return a.label.localeCompare(b.label);
            }
            return isKnifeA ? 1 : -1;
        });
    }, [data.categories]);

    return (
        <div className="statistic-table">
            <table>
                <thead>
                    <tr>
                        <th className="statistic-table__label-col">
                            Category
                        </th>
                        {RARITY_TABLE.map((entry) => (
                            <th
                                key={entry.id}
                                className="statistic-table__value-col"
                            >
                                <div className="statistic-table__label">
                                    {entry.name}
                                </div>
                                <div className="statistic-table__sub">
                                    Base {entry.probability}
                                    %
                                </div>
                            </th>
                        ))}
                        <th className="statistic-table__total-col">
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((category) => (
                        <tr key={category.id}>
                            <td className="statistic-table__label-col">
                                {category.label}
                            </td>
                            {RARITY_TABLE.map((entry) => {
                                const value =
                                    category.counts[
                                        entry.id
                                    ] || 0;
                                const percent =
                                    formatPercent(
                                        value,
                                        category.total
                                    );
                                const isZero =
                                    value === 0 ||
                                    category.total === 0;
                                return (
                                    <td
                                        key={entry.id}
                                        className={`statistic-table__value-col ${
                                            isZero
                                                ? "is-zero"
                                                : ""
                                        }`}
                                    >
                                        <div className="statistic-table__value">
                                            {value}
                                        </div>
                                        <div className="statistic-table__sub">
                                            {percent}%
                                        </div>
                                    </td>
                                );
                            })}
                            <td className="statistic-table__total-col">
                                <div className="statistic-table__value">
                                    {category.total}
                                </div>
                            </td>
                        </tr>
                    ))}
                    <tr className="statistic-table__footer">
                        <td className="statistic-table__label-col">
                            Total
                        </td>
                        {RARITY_TABLE.map((entry) => {
                            const value =
                                data.totals.counts[
                                    entry.id
                                ] || 0;
                            const percent = formatPercent(
                                value,
                                data.totals.total
                            );
                            return (
                                <td
                                    key={entry.id}
                                    className="statistic-table__value-col"
                                >
                                    <div className="statistic-table__value">
                                        {value}
                                    </div>
                                    <div className="statistic-table__sub">
                                        {percent}%
                                    </div>
                                </td>
                            );
                        })}
                        <td className="statistic-table__total-col">
                            <div className="statistic-table__value">
                                {data.totals.total}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default StatisticTableRarity;
