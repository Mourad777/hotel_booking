import React, { useEffect, useState } from "react";
import { List } from "semantic-ui-react";
import Avatar from 'react-avatar';
import { getSubscribers } from "../../utility/api";
import Loader from "../../components/Loader/Loader";
import { getPusher } from "../../utility/utility";

const Subscribers = ({ }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getInitialData = async () => {
        getSubscribers(setSubscribers, setIsLoading)
    }
    useEffect(() => {
        getInitialData();

        const channel = getPusher().subscribe("my-channel");
        channel.bind("SubscribersUpdated", async (data) => {
            console.log('data', data)
            getInitialData();
        });
    }, []);


    return (
        <div >
            <h1>Subscribers</h1>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <List>
                {subscribers.map((m, i) => (
                    <List.Item style={{ padding: 0 }} key={m.name + i}>
                        <div style={{ background: i % 2 === 0 ? '#f8fafc' : 'rgb(242,242,242)', padding: 10, cursor: 'pointer' }}>
                            <div style={{ display: 'flex' }}>
                                <Avatar
                                    size={60}
                                    email={m.email}
                                    round={true}
                                />
                                <div style={{ padding: 20, fontSize: '1.3em' }}>
                                    <span>{m.first_name}</span>
                                </div>
                                <div style={{ padding: 20, fontSize: '1.3em' }}>
                                    <span>{m.email}</span>
                                </div>
                            </div>
                        </div>
                    </List.Item>))}
            </List>
        </div>
    );
};

export default Subscribers;