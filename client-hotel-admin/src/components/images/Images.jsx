import React, { useState, createRef, useEffect, Fragment } from "react";
import arrayMove from "array-move";
import { StyledRedButton,} from '../../StyledComponents';
import SortableGallery from '../gallery/Gallery'
import Loader from "../Loader/Loader";
import { Button } from "semantic-ui-react";


function PhotoGallery() {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(false);

    const fileInputRef = createRef();

    const onSortEnd = async ({ oldIndex, newIndex }) => {
        const reArrangedPhotos = arrayMove(items, oldIndex, newIndex);
        setItems(reArrangedPhotos);
    };

    useEffect(() => {
        getInitialData()
    }, []);


    const handleImageUpload = async e => {
        e.preventDefault()
        const file = e.target.files[0];
        const newPhotoFormData = new FormData();
        newPhotoFormData.append('image', file);
    };

    const handleImageDetails = (photo) => setSelectedPhoto(photo);
    

    const handleDeleteImage = async (id) => {
        // await deletePhoto(id, setIsLoading)
        const newArray = items.filter(p => p.id !== id);
        setItems(newArray);
    }
    return (
        <div>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1 style={{ textAlign: 'center' }}>Photo Gallery</h1>
            {selectedPhoto ?
                <div style={{ maxWidth: 500, margin: 'auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: 20 }}>
                        <img style={{ maxWidth: 500, width: '100%' }} src={selectedPhoto.src} />
                    </div>
                  
                    <div style={{ display: 'flex', marginTop: 20 }}>
                        <StyledRedButton style={{ maxWidth: 100, }} onClick={() => setSelectedPhoto(null)}
                        >
                            Back
                        </StyledRedButton>
                    </div>
                </div>
                : (
                    <Fragment>
                        <div style={{ marginTop: 20 }}>
                            <Button onClick={() => fileInputRef.current.click()} icon="image">
                                Upload Photo
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                onChange={handleImageUpload}
                            />
                        </div>
                        <SortableGallery
                            handleDetails={handleImageDetails}
                            handleDelete={handleDeleteImage}
                            items={items}
                            onSortEnd={onSortEnd}
                            axis={"xy"}
                            galleryType="photo"
                        />
                    </Fragment>
                )}
        </div>
    );
}

export default PhotoGallery;