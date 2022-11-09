import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import Avatar from 'react-avatar';
import { useHistory } from "react-router-dom";
import { getMessages } from "../../utility/api";
import Loader from "../../components/Loader/Loader";
import { getPusher } from "../../utility/utility";

const Messages = ({ }) => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory()

    const getInitialData = async () => {
        getMessages(setMessages, setIsLoading)
    }
    useEffect(() => {
        getInitialData();

        const channel = getPusher().subscribe("my-channel");
        channel.bind("MessagesUpdated", async (data) => {
            getInitialData();
        });
    }, []);


    const handleMessage = (id) => {
        history.push(`/message/${id}`)
    }

    return (
        <div >
            <h1>Messages</h1>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <List>
                {messages.map((m, i) => (
                    <List.Item style={{ padding: 0 }} key={m.name + i}>
                        <div style={{ background: i % 2 === 0 ? '#f8fafc' : 'rgb(242,242,242)', padding: 10, cursor: 'pointer' }}
                            onClick={() => handleMessage(m.id)}>
                            <div style={{ display: 'flex' }}>
                                <Avatar
                                    size={60}
                                    email={m.email}
                                    round={true}
                                />
                                <div style={{ padding: 20, fontSize: '1.3em' }}>
                                    <span>{m.name}</span>
                                </div>
                            </div>
                            {/* <div style={{ padding: 20, fontSize: '1.3em' }}>
                            <span>{m.email}</span>
                        </div> */}
                            <div style={{ padding: '10px 0', fontSize: '1.1em', color: '#afafaf' }}>
                                <span>{new Date(m.created_at).toLocaleDateString()}</span>
                            </div>
                            <div style={{ padding: '10px 0', fontSize: '1.1em' }}>
                                <span>{m.message.substring(0, 30) + '...'}</span>
                            </div>
                        </div>
                    </List.Item>))}
            </List>
        </div>
    );
};

export default Messages;