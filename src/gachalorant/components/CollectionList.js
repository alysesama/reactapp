import CollectionItemList from "./CollectionItemList";

function CollectionList({ items }) {
    if (!items || items.length === 0) {
        return (
            <div className="collection-list__empty">
                Không có dữ liệu.
            </div>
        );
    }
    return (
        <div className="collection-list">
            {items.map((item) => (
                <CollectionItemList key={item.weaponId} {...item} />
            ))}
        </div>
    );
}

export default CollectionList;

