import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router';
import { getAccommodations, deleteAccommodation } from '../../utility/api/accommodations'
import Loader from '../../components/Loader/Loader';
import { Button } from 'semantic-ui-react';
import { useWindowSize } from '../../utility/windowSize';
const { REACT_APP_AWS_URL } = process.env;

const Accommodations = ({ }) => {

    const history = useHistory();
    const [accommodations, setAccommodations] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getInitialData = async () => {
        await getAccommodations(setAccommodations, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    const handleDeleteAccommodation = async (accommodationId) => {
        await deleteAccommodation(accommodationId, setIsLoading)
        setAccommodations(accommodations => {
            //get index of accommodation to delete
            const accommodationIndex = accommodations.findIndex(accommodation => accommodation.id === accommodationId)
            return accommodations.splice(accommodationIndex, 1)
        })
    }

    const windowSize = useWindowSize()
    console.log('windowSize', windowSize)
    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1 style={{textAlign:'center'}}>Accommodations</h1>
            {windowSize[0] > 700 ?
                <table style={{ margin: 'auto', width: '100%' }}>
                    <tbody>
                        <tr>
                            <th style={{ fontSize: '1.2em', textAlign: 'left' }}></th>
                            <th style={{ fontSize: '1.2em', textAlign: 'left' }}></th>
                            <th style={{ fontSize: '1.2em', textAlign: 'left' }}>Title</th>
                            <th style={{ fontSize: '1.2em' }}>Bookings</th>
                        </tr>
                        {accommodations.map((accommodation, i) => (
                            <Fragment key={accommodation.id}>
                                <tr style={{ height: 100 }}>
                                    <td style={{ fontSize: '1.2em', textAlign: 'left', cursor: 'pointer' }} onClick={() => history.push(`/create-accommodation/${accommodation.id}`)}>{i + 1}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'left' }}>
                                        <img style={{ width: 200, cursor: 'pointer' }} onClick={() => history.push(`/create-accommodation/${accommodation.id}`)} src={REACT_APP_AWS_URL + ((accommodation.images || [])[0] || {}).url} />
                                    </td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'left', cursor: 'pointer' }} onClick={() => history.push(`/create-accommodation/${accommodation.id}`)}>{accommodation.title}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{accommodation.accommodation_bookings.length}</td>
                                    <td style={{ fontSize: '1.2em', textAlign: 'center' }}><Button onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</Button></td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
                : <Fragment>
                    {accommodations.map((accommodation, i) => (
                        <div>
                            <h2 style={{textAlign:'center'}}>{accommodation.title}</h2>
                            <img style={{ width: '100%', cursor: 'pointer' }} onClick={() => history.push(`/create-accommodation/${accommodation.id}`)} src={REACT_APP_AWS_URL + ((accommodation.images || [])[0] || {}).url} />
                            <Button style={{width:'100%'}} onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</Button>
                        </div>))}
                </Fragment>
            }



        </div >
    )
}

export default Accommodations
