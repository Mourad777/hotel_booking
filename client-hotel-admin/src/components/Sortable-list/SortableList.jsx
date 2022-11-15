import React from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";
import { StyledAdminGalleryContainer, StyledDeleteButton, StyledGalleryImage, StyledInnerItem, StyledItem } from "../styles/sortable-list";
const { REACT_APP_AWS_URL } = process.env;

const SortableItem = SortableElement(({ item, onImageDelete }) => (
    <StyledItem>
        <StyledInnerItem>
            <StyledGalleryImage src={REACT_APP_AWS_URL + item.url} />
        </StyledInnerItem>
        <StyledDeleteButton onClick={() => onImageDelete(item.id)}>Delete</StyledDeleteButton>
    </StyledItem>
));

const SortableList = SortableContainer(({ items, onImageDelete }) => (
    <StyledAdminGalleryContainer>
        {items.map((item, index) => (
            <SortableItem
                key={`${item.id}`}
                index={index}
                item={item}
                onImageDelete={(id) => onImageDelete(id, index)}
            />
        ))}
    </StyledAdminGalleryContainer>
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
            onImageDelete={onImageDelete}
        />
    );

}


export default SortableComponent;