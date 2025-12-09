import PoolSwitch from "./PoolSwitch";

function CollectionSwitch({ poolId, onPoolChange }) {
    return (
        <PoolSwitch poolId={poolId} onPoolChange={onPoolChange} />
    );
}

export default CollectionSwitch;

