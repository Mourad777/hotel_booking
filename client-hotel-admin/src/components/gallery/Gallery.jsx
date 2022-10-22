import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
const { REACT_APP_AWS_URL } = process.env;


const SortableItem = SortableElement(({ item, onImageDelete }) => (
    <div className="item">
        <div className="inner-item">
            <img className="gallery-image" src={REACT_APP_AWS_URL + item.url} />

        </div>
        <button onClick={() => onImageDelete(item.id)} style={{ cursor: 'pointer', padding: 10, color: 'red', border: 'red 1px solid', background: 'rgba(219, 112, 147,0.1)' }}>Delete</button>
    </div>
));

const SortableList = SortableContainer(({ items, onImageDelete }) => (
    <div className="admin-gallery-container">
        {items.map((item, index) => (
            <SortableItem
                key={`${item.id}`}
                index={index}
                item={item}
                onImageDelete={(id) => onImageDelete(id, index)}
            />
        ))}
    </div>
));

const SortableComponent = ({ items, setItems, onImageDelete }) => {

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setItems(arrayMove(items, oldIndex, newIndex))
    };

    return (
        <SortableList
            items={items}
            onSortEnd={onSortEnd}
            axis="xy"
            helperClass="SortableHelper"
            onImageDelete={onImageDelete}
        />
    );

}


export default SortableComponent;