import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Select, Checkbox, Button } from 'semantic-ui-react'
import { uploadFile } from '../../utility/api/files'
import { createAccommodation, updateAccommodation, getAccommodation } from '../../utility/api/accommodations'
import { createImage, deleteImage } from '../../utility/api/images'
import { getKey, orderPhotos } from '../../utility/utility';
import SortableGallery from '../../components/gallery/Gallery'
import Dropzone from '../../components/dropzone';
import cuid from 'cuid'
import { useParams, useHistory } from 'react-router-dom'
import { getAmenities } from '../../utility/api/amenities'

const accommodationTypes = ['Apartment', 'Studio', 'House', 'Villa', 'Condo', 'Private Room']

const isObjectEmpty = (obj) => {
    return obj
        && Object.keys(obj).length === 0
        && Object.getPrototypeOf(obj) === Object.prototype
}

const validateAccommodationForm = (values) => {
    const errors = {}
    if (!values.title) errors.title = 'Please provide a title';
    if (isNaN(values.price) || !values.price) errors.price = 'Please provide a price';
    if ((values.beds < 2) && values.selectedAccommodation === 'Dorm') errors.beds = 'Select at least 2 beds';
    return errors;
}


const getAmenitiesIds = (amenities, amenitiesCheckedState) => {
    return amenities.filter((amenity, i) => amenitiesCheckedState[i] === true).map(selectedAmenity => selectedAmenity.id)
}

export default function CreateAccommodation({ match }) {
    const history = useHistory();

    const { id: accommodationId } = useParams()
    let newId;
    if (!accommodationId) newId = cuid();
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [amenities, setAmenities] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [formErrors, setFormErrors] = useState({});
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [amenitiesCheckedState, setAmenitiesCheckedState] = useState([])

    const getInitialData = async () => {

        const amenitiesList = await getAmenities(setAmenitiesCheckedState, setIsLoading);
        setAmenities(amenitiesList)
        if (accommodationId) { //if there is and accommodatin id that means we are editing a previously created accommodation and need to populate the form
            const { images, type, beds=[], imagesOrder, amenities, ...rest } = await getAccommodation(accommodationId, setIsLoading);
            const amenitiesValues = amenitiesList.map(amenity => amenities.findIndex(chosenAmenity => chosenAmenity.name === amenity.name) > -1)
            setAmenitiesCheckedState(amenitiesValues)
            setImages(orderPhotos(images, imagesOrder))
            setSelectedAccommodation(type)
            setFormValues({ ...rest, beds: beds.length })
        } else {
            setFormValues({ }) // necessary in case we have previous state from a preloaded form that we were editing so that the values don't carry over but instead start fresh
        }
    }

    useEffect(() => {
        getInitialData()
    }, []);


    const onDrop = useCallback(acceptedFiles => {
        // Loop through accepted files
        acceptedFiles.map(async (file, i) => {
            const awsPath = `accommodation-${accommodationId || newId}/pictures`;
            const key = getKey(file, awsPath)
            //upload file to aws
            await uploadFile(file, key);
            //create image document in postgres which has the url info and the associated accommodation id
            const imageData = await createImage({ url: key, accommodationId, isThumbnail: false }, setIsLoading)
            // Initialize FileReader browser API
            const reader = new FileReader();
            // onload callback gets called after the reader reads the file data
            reader.onload = function (e) {
                // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it. 
                setImages(prevState => [
                    ...prevState,
                    { id: imageData.newImage.id, url: key, title: '', index: i }
                ]);
            };
            // Read the file as Data URL (since we accept only images)
            reader.readAsDataURL(file);
            return file;
        });
    }, []);


    const submitAccommodation = async (event) => {

        const validationErrors = validateAccommodationForm({ ...formValues, selectedAccommodation });
        if (!isObjectEmpty(validationErrors)) {
            setFormErrors(validationErrors)
            return;
        }


        event.preventDefault();
        const values = {
            accommodationId: accommodationId || newId,
            ...formValues,
            amenities: getAmenitiesIds(amenities, amenitiesCheckedState),
            isDraft: false,
            type: selectedAccommodation,
            images: images.map(image => image.id),
        }
        if (accommodationId) {
            await updateAccommodation(accommodationId, values, setIsLoading)
        } else {
            await createAccommodation(values, setIsLoading)
        }
        history.push('/accommodations')
        
    }

    const handleImageDeletion = async (id,index) => {
        setImages((previousImages) =>{
            const newList = previousImages.slice(0, index).concat(previousImages.slice(index + 1, previousImages.length))
            return newList;
        })
    }

    const handleAmenities = (position) => {
        const updatedCheckedState = amenitiesCheckedState.map((item, index) =>
            index === position ? !item : item
        );
        setAmenitiesCheckedState(updatedCheckedState);
    };

    const handleForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <Fragment>
            <h2>Create a new accommodation</h2>

            <Form onSubmit={submitAccommodation}>
                <Form.Field>
                    <label>Title</label>
                    <input onChange={handleForm} value={formValues.title} name="title" placeholder='Title' />
                    <label style={{ color: 'red' }}>{formErrors.title}</label>
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <textarea onChange={handleForm} value={formValues.description} name="description" placeholder='Description' />
                </Form.Field>
                <Form.Field>
                    <label>Capacity</label>
                    <input onChange={handleForm} value={formValues.capacity} type="number" name="capacity" placeholder='Capacity' />
                </Form.Field>

                <h4>Amenities</h4>
                {amenities.map((amenity, index) => {
                    return (
                        <Form.Field>
                            <Checkbox
                                key={index}
                                label={amenity.name}
                                name={amenity.name}
                                value={index}
                                checked={amenitiesCheckedState[index]}
                                onChange={() => handleAmenities(index)}
                            />
                        </Form.Field>
                    );
                })}

                <Select
                    placeholder='Accommodation type'
                    options={accommodationTypes.map(accommodation => ({ key: accommodation, value: accommodation, text: accommodation }))}
                    value={selectedAccommodation}
                    onChange={(event, data) => setSelectedAccommodation(data.value)} />
                <Form.Field>
                    <label>{selectedAccommodation === "Dorm" ? "Price per bed" : 'Price'}</label>
                    <input onChange={handleForm} name="price" value={formValues.price} type="number" placeholder={selectedAccommodation === "Dorm" ? "Price per bed" : 'Price'} />
                    <label style={{ color: 'red' }}>{formErrors.price}</label>
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>

            <Dropzone onDrop={onDrop} accept={"image/*"} />

            <SortableGallery onImageDelete={handleImageDeletion} items={images} setItems={setImages} />


        </Fragment>
    )
}
