import React, { useState, useEffect, Fragment } from 'react'
import { StyledThumbnailPreview } from '../../StyledComponents';
import { useHistory } from 'react-router';
import { getAccommodations } from '../../utility/api';
import Loader from '../../components/Loader/Loader';


const Accommodations = ({ winSize }) => {

    const history = useHistory();
    const [accommodations, setAccommodations] = useState([]);
    const [isLoading, setIsLoading] = useState([]);

    const getInitialData = async () => {
        await getAccommodations(setAccommodations, setIsLoading)
    }

    useEffect(() => {
        getInitialData()
    }, []);

    // const handleDeleteBooking = async (id) => {
    //     await deleteBooking(id, setIsLoading)
    // }

    const labelStyle = { fontSize: '1.4em', display: 'block' };
    const titleStyle = { fontSize: '1.9em', display: 'block', fontStyle: 'bold' };
    if (isLoading) return <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>;

    return (
        <div style={{ margin: 'auto', maxWidth: 800 }}>

            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <h1>Accommodations</h1>
            <table style={{ margin: 'auto', width: '100%' }}>
                <tbody>
                    <tr>
                        <th style={{ fontSize: '1.2em', textAlign: 'left' }}></th>
                        <th style={{ fontSize: '1.2em', textAlign: 'left' }}>Title</th>
                        <th style={{ fontSize: '1.2em' }}>Bookings</th>
                    </tr>
                    {accommodations.map(accommodation => (
                        <Fragment key={accommodation.id}>
                            {/* <span style={titleStyle}>{p.title}</span>
                                <p style={{ margin: '5px 0', fontSize: '1.3em' }}>{`Posted on ${new Date(p.created_at).toLocaleDateString()} ${!!p.author ? 'by ' + p.author : ''}`}</p>
                                <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}><span style={{ ...labelStyle, marginRight: 10 }}>Published: </span><Checkbox disabled checked={!!p.is_published} /></div> */}

                            {/* <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                    <StyledBlueButton maxWidth onClick={() => history.push(`/post/${p.id}/comments`)}><Icon name='comment outline' size='large' /> {p.comment_count}</StyledBlueButton>
                                    <StyledBlueButton maxWidth onClick={() => history.push(`/edit-post/${p.id}`)}><Icon name='edit outline' size='large' /></StyledBlueButton>
                                    <StyledRedButton maxWidth onClick={() => handleDeletePost(p.id)}> <Icon name='trash alternate outline' size='large' /></StyledRedButton>
                                </div> */}
                            <tr style={{ height: 100 }}>
                                <td style={{ fontSize: '1.2em', textAlign: 'left' }}>
                                    <img style={{ width: 200,cursor:'pointer' }} onClick={()=>history.push(`/accommodation/${accommodation.id}`)} src={accommodation.image} />
                                </td>
                                <td style={{ fontSize: '1.2em', textAlign: 'left' }}>{accommodation.title}</td>
                                <td style={{ fontSize: '1.2em', textAlign: 'center' }}>{accommodation.accommodation_bookings.length}</td>
                            </tr>
                        </Fragment>
                    ))}
                </tbody>
            </table>
        </div >
    )
}

export default Accommodations
