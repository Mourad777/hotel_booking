import React, { useEffect, useState } from "react";
import Avatar from 'react-avatar';
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { getMessage } from "../../utility/api";

const Messages = ({ }) => {
    const [message, setMessage] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const messageId = params.id;

    const getInitialData = async () => {
        await getMessage(messageId, setMessage, setIsLoading);
    }

    useEffect(() => {
        getInitialData()
    }, []);

    return (
        <div >
            {isLoading && <div style={{position: 'fixed',zIndex:5,top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <div style={{ display: 'flex' }}>
                <Avatar
                    size={60}
                    email={message.email}
                    round={true}
                />
                <div style={{ padding: 20, fontSize: '1.3em' }}>
                    <span>{message.name}</span>
                </div>
            </div>
            {/* <div style={{ padding: 20, fontSize: '1.3em' }}>
                            <span>{m.email}</span>
                        </div> */}
            <div style={{ padding: '10px 0', fontSize: '1.1em', color: '#afafaf' }}>
                <span>{new Date(message.created_at).toLocaleDateString()}</span>
            </div>
            <div style={{ padding: '10px 0', fontSize: '1.1em' }}>
                <span>{!!message.message ? message.message.substring(0, 30) + '...' : ''}</span>
            </div>
        </div>
    );
};

export default Messages;