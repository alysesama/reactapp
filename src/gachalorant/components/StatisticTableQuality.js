import { useMemo } from "react";
import { QUALITY_TIERS } from "../helpers/gachaHelper";
import {
    computeQualityStats,
    formatPercent,
} from "../helpers/statisticHelper";
import "./StatisticContainer.css";

function StatisticTableQuality({ wpDb }) {
    const data = useMemo(
        () => computeQualityStats(wpDb),
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
                        {data.tiers.map((tier) => (
                            <th
                                key={tier.id}
                                className="statistic-table__value-col"
                            >
                                <div className="statistic-table__label">
                                    {
                                        tier.label.split(
                                            " "
                                        )[0]
                                    }
                                </div>
                                <div className="statistic-table__sub">
                                    Base {tier.min}-
                                    {tier.max}%
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
                            {QUALITY_TIERS.map((tier) => {
                                const value =
                                    category.counts[
                                        tier.id
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
                                        key={tier.id}
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
                        {QUALITY_TIERS.map((tier) => {
                            const value =
                                data.totals.counts[
                                    tier.id
                                ] || 0;
                            const percent = formatPercent(
                                value,
                                data.totals.total
                            );
                            return (
                                <td
                                    key={tier.id}
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

export default StatisticTableQuality;
