import React, { useState, useEffect, Fragment } from 'react'
import { useHistory } from 'react-router';
import { getAccommodations, deleteAccommodation } from '../../utility/api/accommodations'
import Loader from '../../components/Loader/Loader';
import { Button } from 'semantic-ui-react';
import { useWindowSize } from '../../utility/windowSize';
import {
    StyledDeleteButton,
    StyledAccommodationImage,
    StyledMainContainer,
    StyledMainTitle,
    StyledMobileAccommodationImage,
    StyledMobileAccommodationTitle,
    StyledTable,
    StyledTableData,
    StyledTableHead,
    StyledTableRow,
} from '../../styles/accommodations';

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

    if (isLoading) return <Loader />;

    return (
        <StyledMainContainer>
            {isLoading && <Loader />}
            <StyledMainTitle>Accommodations</StyledMainTitle>
            {windowSize[0] > 700 ?
                <StyledTable>
                    <tbody>
                        <tr>
                            <StyledTableHead></StyledTableHead>
                            <StyledTableHead></StyledTableHead>
                            <StyledTableHead>Title</StyledTableHead>
                            <StyledTableHead>Bookings</StyledTableHead>
                        </tr>
                        {accommodations.map((accommodation, i) => (
                            <Fragment key={accommodation.id}>
                                <StyledTableRow>
                                    <StyledTableData>
                                        {i + 1}
                                    </StyledTableData>
                                    <StyledTableData>
                                        <StyledAccommodationImage onClick={() => history.push(`/create-accommodation/${accommodation.id}`)} src={REACT_APP_AWS_URL + ((accommodation.images || [])[0] || {}).url} />
                                    </StyledTableData>
                                    <StyledTableData>{accommodation.title}</StyledTableData>
                                    <StyledTableData>{accommodation.accommodation_bookings.length}</StyledTableData>
                                    <StyledTableData><Button onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</Button></StyledTableData>
                                </StyledTableRow>
                            </Fragment>
                        ))}
                    </tbody>
                </StyledTable>
                : <Fragment>
                    {accommodations.map((accommodation, i) => (
                        <div>
                            <StyledMobileAccommodationTitle>{accommodation.title}</StyledMobileAccommodationTitle>
                            <StyledMobileAccommodationImage
                                onClick={() => history.push(`/create-accommodation/${accommodation.id}`)}
                                src={REACT_APP_AWS_URL + ((accommodation.images || [])[0] || {}).url}
                            />
                            <StyledDeleteButton onClick={() => handleDeleteAccommodation(accommodation.id)}>Delete</StyledDeleteButton>
                        </div>))}
                </Fragment>
            }
        </StyledMainContainer >
    )
}

export default Accommodations
