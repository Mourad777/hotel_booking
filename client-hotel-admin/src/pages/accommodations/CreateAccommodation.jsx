import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Form, Select, Checkbox, Button } from 'semantic-ui-react'
import { uploadFile } from '../../utility/api/files'
import { createAccommodation } from '../../utility/api/accommodations'
import { createImage } from '../../utility/api/images'
import { getKey } from '../../utility/utility';
import SortableGallery from '../../components/gallery/Gallery'
import arrayMove from "array-move";
import Dropzone from '../../components/dropzone';
import ImageList from '../../components/imageList';
import cuid from 'cuid'
import { DndProvider } from "react-dnd";
import update from "immutability-helper";
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useParams } from 'react-router-dom'
import { getAmenities } from '../../utility/api/amenities'
const accommodationTypes = ['Apartment', 'Studio', 'House', 'Villa', 'Condo', 'Dorm', 'Private Room']
// const amenities = ['Wifi', 'Pets', 'Lockers', 'Children allowed', 'Breakfast', 'Laundry', 'Dorm', 'Luggage storage', 'Bar', 'Meals', 'Common Area', 'Terrace', 'Smoking Area'];



const getAmenitiesIds = (amenities, amenitiesCheckedState) => {

    return amenities.filter((amenity,i)=>amenitiesCheckedState[i] === true).map(selectedAmenity=>selectedAmenity.id)

}

export default function CreateAccommodation({ match }) {

    const { id: accommodationId } = useParams()
    console.log('accommodationId', accommodationId);
    let newId;
    if (!accommodationId) newId = cuid();
    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [amenities, setAmenities] = useState([]);
    const [formValues, setFormValues] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [amenitiesCheckedState, setAmenitiesCheckedState] = useState([])

    const getInitialData = async () => {
        await getAmenities(setAmenities,setAmenitiesCheckedState, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    console.log('amenitiesCheckedState', amenitiesCheckedState)


    console.log('amenities: ', amenities)

    const onDrop = useCallback(acceptedFiles => {
        // Loop through accepted files
        acceptedFiles.map(async (file, i) => {
            const awsPath = `accommodation-${accommodationId || newId}/pictures`;

            const key = getKey(file, awsPath)
            //upload file to aws
            const fileInfo = await uploadFile(file, key);
            console.log('file info')
            //create image document in postgres which has the url info and the associated accommodation id
            const imageUrl = fileInfo.data.presignedUrl.url + '/' + key
            const imageData = await createImage({ url: imageUrl, accommodationId, isThumbnail: false }, setIsLoading)
            console.log('new image', imageData)
            // Initialize FileReader browser API
            const reader = new FileReader();
            // onload callback gets called after the reader reads the file data
            reader.onload = function (e) {
                // add the image into the state. Since FileReader reading process is asynchronous, its better to get the latest snapshot state (i.e., prevState) and update it. 
                setImages(prevState => [
                    ...prevState,
                    { id: imageData.newImage.id, src: imageUrl, title: '', index: i }
                ]);
            };
            // Read the file as Data URL (since we accept only images)
            reader.readAsDataURL(file);
            return file;
        });
    }, []);

    console.log('images:', images)

    const submitAccommodation = async (event) => {
        event.preventDefault();
        console.log('creating accommodation: ', formValues)
        const values = {
            accommodationId: accommodationId || newId,
            ...formValues,
            amenities:getAmenitiesIds(amenities,amenitiesCheckedState),
            isDraft: false,
            type:selectedAccommodation,
            images,
        }
        await createAccommodation(values, setIsLoading)
    }

    const handleAmenities = (position) => {
        console.log('position: ',position)
        const updatedCheckedState = amenitiesCheckedState.map((item, index) =>
            index === position ? !item : item
        );
        setAmenitiesCheckedState(updatedCheckedState);
    };

    const handleForm = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        console.log('name', name, 'value', value)
        setFormValues({ ...formValues, [name]: value });
    }

    return (
        <Fragment>
            <h2>Create a new accommodation</h2>

            <Form onSubmit={submitAccommodation}>
                <Form.Field>
                    <label>Title</label>
                    <input onChange={handleForm} name="title" placeholder='Title' />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <textarea onChange={handleForm} name="description" placeholder='Description' />
                </Form.Field>
                <Form.Field>
                    <label>Capacity</label>
                    <input onChange={handleForm} type="number" name="capacity" placeholder='Capacity' />
                </Form.Field>
                <Form.Field>
                    <label>Number of beds</label>
                    <input disabled={selectedAccommodation !== 'Dorm'} onChange={handleForm} type="number" name="beds" placeholder='Number of beds' />
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
                    <input onChange={handleForm} name="price" type="number" placeholder={selectedAccommodation === "Dorm" ? "Price per bed" : 'Price'} />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>

            <Dropzone onDrop={onDrop} accept={"image/*"} />

            <SortableGallery items={images} setItems={setImages} />


        </Fragment>
    )
}
