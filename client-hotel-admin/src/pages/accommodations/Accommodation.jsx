import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router';
import { getAccommodation } from '../../utility/api';
import Loader from '../../components/Loader/Loader';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import TextField from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Box from '@mui/material/Box';

import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';

const Accommodation = () => {

    const { id: accommodationId } = useParams();
    const history = useHistory();
    const [accommodation, setAccommodation] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    // const [dates, setDates] = useState([]);

    const [value, setValue] = React.useState([null, null]);

    // const handleDatesChange = (event, data) => setDates(data.value);

    const getInitialData = async () => {
        await getAccommodation(setAccommodation, accommodationId, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);
    console.log('dates: ', value)

    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1>{accommodation.title}</h1>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={accommodation.image} />
            </div>
            <h3 style={{ textAlign: 'center' }}>Create a booking</h3>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <StaticDateRangePicker
                        displayStaticWrapperAs="desktop"
                        value={value}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        renderInput={(startProps, endProps) => (
                            <React.Fragment>
                                <TextField {...startProps} />
                                <Box sx={{ mx: 2 }}> to </Box>
                                <TextField {...endProps} />
                            </React.Fragment>
                        )}
                    />
                </LocalizationProvider>
            </div>
        </div >
    )
}

export default Accommodation
