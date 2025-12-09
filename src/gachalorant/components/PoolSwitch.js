import { useState } from "react";
import {
    KNIFE_POOL,
    VALORANT_POOLS,
    getPoolById,
} from "../helpers/poolConfig";

const GRID_LAYOUT = [
    ["classic", "shorty", "frenzy", "ghost", "sheriff"],
    ["stinger", "spectre", "bucky", "judge"],
    ["bulldog", "guardian", "phantom", "vandal"],
    ["marshal", "outlaw", "operator", "ares", "odin"],
    ["knife"],
];

function buildGridCells(selectedPoolId) {
    const selectedPool = getPoolById(selectedPoolId);
    const byId = new Map(
        [...VALORANT_POOLS, KNIFE_POOL].map((pool) => [
            pool.id,
            pool,
        ])
    );
    return GRID_LAYOUT.map((column) =>
        column.map((cellId) => {
            if (!cellId) {
                return {
                    key: "empty",
                    isEmpty: true,
                };
            }
            const config = byId.get(cellId);
            if (!config) {
                return {
                    key: cellId,
                    isEmpty: true,
                };
            }
            const isActive = config.id === selectedPool.id;
            return {
                key: config.id,
                isEmpty: false,
                label: config.label,
                id: config.id,
                isActive,
            };
        })
    );
}

function PoolSwitch({ poolId, onPoolChange }) {
    const [isWeaponMenuOpen, setIsWeaponMenuOpen] =
        useState(false);
    const selectedLabel = getPoolById(poolId).label;
    const gridColumns = buildGridCells(poolId);

    const handleSelectPool = (nextPoolId) => {
        if (!nextPoolId || nextPoolId === poolId) {
            setIsWeaponMenuOpen(false);
            return;
        }
        onPoolChange(nextPoolId);
        setIsWeaponMenuOpen(false);
    };

    return (
        <div className="vlc-pool-switch">
            <div style={{ position: "relative" }}>
                <button
                    type="button"
                    className="vlc-pool-switch__btn is-active"
                    onClick={() =>
                        setIsWeaponMenuOpen(
                            (isOpen) => !isOpen
                        )
                    }
                >
                    Pool: {selectedLabel}
                </button>
                {isWeaponMenuOpen && (
                    <div className="vlc-pool-tooltip">
                        {gridColumns.map(
                            (column, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="vlc-pool-tooltip__column"
                                >
                                    {column.map(
                                        (
                                            cell,
                                            rowIndex
                                        ) => {
                                            const key = `${colIndex}-${rowIndex}-${cell.key}`;
                                            if (
                                                cell.isEmpty
                                            ) {
                                                return (
                                                    <div
                                                        key={
                                                            key
                                                        }
                                                        className="vlc-pool-tooltip__cell"
                                                    />
                                                );
                                            }
                                            return (
                                                <div
                                                    key={
                                                        key
                                                    }
                                                    className="vlc-pool-tooltip__cell"
                                                >
                                                    <button
                                                        type="button"
                                                        className={`vlc-pool-tooltip__cell-btn${
                                                            cell.isActive
                                                                ? " is-active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            handleSelectPool(
                                                                cell.id
                                                            )
                                                        }
                                                    >
                                                        {
                                                            cell.label
                                                        }
                                                    </button>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PoolSwitch;
