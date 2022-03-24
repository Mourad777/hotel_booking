import React, { Fragment, useRef, useState } from 'react'
import { Form, Select, Checkbox, Button } from 'semantic-ui-react'
import { uploadFile } from '../../utility/api';
import { getKey } from '../../utility/utility';

const accommodationTypes = ['Apartment', 'Studio', 'House', 'Villa', 'Condo', 'Dorm', 'Private Room']
const amenities = ['Wifi', 'Pets', 'Lockers','Children allowed', 'Breakfast', 'Laundry', 'Dorm', 'Luggage storage', 'Bar', 'Meals', 'Common Area', 'Terrace', 'Smoking Area'];

export default function CreateAccommodation() {

    const [selectedAccommodation, setSelectedAccommodation] = useState(null);
    const [formValues, setFormValues] = useState(null);
    const [accommodationImage, setAccommodationImage] = useState(null);
    const [accommodationImagePreview, setAccommodationImagePreview] = useState(null);

    const [amenitiesCheckedState, setAmenitiesCheckedState] = useState(
        new Array(amenities.length).fill(false)
    );

    const submitAccommodation = async (event) => {
        event.preventDefault();

        const file = accommodationImage;
        if(!file) return
        const thumbnailKey = getKey(file, 'accommodation-thumbnails');
        console.log('thumbnailKey', thumbnailKey)
        await uploadFile(file, thumbnailKey)
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
        console.log('name', name, 'value', value)
        setFormValues({ ...formValues, [name]: value });
    }

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        setAccommodationImagePreview(URL.createObjectURL(file))
        setAccommodationImage(file)
    }

    const fileInputRef = useRef()
    console.log('amenitiesCheckedState', amenitiesCheckedState)
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
                <h3>Thumbnail</h3>
                <img style={{width:300}} src={accommodationImagePreview} />
                <Button
                    content="Choose File"
                    labelPosition="left"
                    icon="file"
                    onClick={() => fileInputRef.current.click()}
                />
                <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={handleChangeImage}
                />

                <h4>Amenities</h4>
                {amenities.map((name, index) => {
                    return (
                        <Form.Field>
                            <input
                                key={index}
                                type="checkbox"
                                id={`custom-checkbox-${index}`}
                                name={name}
                                value={name}
                                checked={amenitiesCheckedState[index]}
                                onChange={() => handleAmenities(index)}
                            />
                            <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
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
                    <input name="price" type="number" placeholder={selectedAccommodation === "Dorm" ? "Price per bed" : 'Price'} />
                </Form.Field>
                <Checkbox onChange={handleForm} name="petsAllowed" label='Pets allowed' />
                <Checkbox onChange={handleForm} name="wifi" label='Wifi' />
                <Checkbox onChange={() => handleForm} name="childrenAllowed" label='Children allowed' />
                <Button type='submit'>Submit</Button>
            </Form>
        </Fragment>
    )
}
