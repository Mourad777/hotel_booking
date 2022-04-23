import React, { useRef } from "react";
// import useDrag and useDrop hooks from react-dnd
import { useDrag, useDrop } from "react-dnd";




const type = "Image"; // Need to pass which type element can be draggable, its a simple string or Symbol. This is like an Unique ID so that the library know what type of element is dragged or dropped on.

const Image = ({ image, index, moveImage }) => {

    
    const ref = useRef(null); // Initialize the reference

    // useDrop hook is responsible for handling whether any item gets hovered or dropped on the element
    const [, drop] = useDrop({
        // accept receives a definition of what must be the type of the dragged item to be droppable
        accept: type,
        // This method is called when we hover over an element while dragging
        hover(item) { // item is the dragged element
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            // current element where the dragged element is hovered on
            const hoverIndex = index;
            // If the dragged element is hovered in the same place, then do nothing
            if (dragIndex === hoverIndex) {
                return;
            }
            // If it is dragged around other elements, then move the image and set the state with position changes
            moveImage(dragIndex, hoverIndex);
            /*
              Update the index for dragged item directly to avoid flickering
              when the image was half dragged into the next
            */
            item.index = hoverIndex;
        }
    });

    // useDrag will be responsible for making an element draggable. It also expose, isDragging method to add any styles while dragging
    const [{ isDragging }, drag] = useDrag(() => ({
        // what type of item this to determine if a drop target accepts it
        type: type,
        // data of the item to be available to the drop methods
        item: { id: image.id, index },
        // method to collect additional data for drop handling like whether is currently being dragged
        collect: (monitor) => {
            return {
                isDragging: monitor.isDragging(),
            };
        },
    }));

    /* 
      Initialize drag and drop into the element using its reference.
      Here we initialize both drag and drop on the same element (i.e., Image component)
    */
    drag(drop(ref));

    // Add the reference to the element
    return (
        <div
            ref={ref}
            style={{ opacity: isDragging ? 0 : 1 }}
            className="file-item"
        >
            <img alt={`img - ${image.id}`} src={image.src} className="file-img" />
        </div>
    );
};

const ImageList = ({ images, moveImage }) => {
    const renderImage = (image, index) => {
        return image ? (
            <Image
                image={image}
                index={index}
                key={`${image.id}-image`}
                moveImage={moveImage}
            />
        ) : null;
    };
    return <section className="file-list">{images.map(renderImage)}</section>;
}

export default ImageList;
