import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

const SortableItem = SortableElement(({ item }) => (
    <div className="item">
        <div className="inner-item">
            <img className="gallery-image" src={item.src} />
        </div>
    </div>
));

const SortableList = SortableContainer(({ items }) => (
    <div className="admin-gallery-container">
        {items.map((item, index) => (
            <SortableItem
                key={`${item.id}`}
                index={index}
                item={item}
            />
        ))}
    </div>
));

const SortableComponent = ({ items, setItems }) => {

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex))
    };

    return (
        <SortableList
            items={items}
            onSortEnd={onSortEnd}
            axis="xy"
            helperClass="SortableHelper"
        />
    );

}


export default SortableComponent;