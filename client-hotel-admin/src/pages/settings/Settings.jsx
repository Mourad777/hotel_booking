import React, { useState, useEffect } from 'react'
import { Checkbox } from 'semantic-ui-react';
import Loader from '../../components/Loader/Loader';
import { getConfiguration, updateConfiguration } from '../../utility/api';

const RegisterUser = ({ }) => {
    const [isMessagesAllowed, setIsMessagesAllowed] = useState(null);
    const [isCommentsApprovalRequired, setIsCommentsApprovalRequired] = useState(null);

    const [isLoading, setIsLoading] = useState(false);

    const handleAllowMessages = async e => {
        const formData = new FormData();
        formData.append('is_messages_allowed', !isMessagesAllowed ? 1 : 0);
        await updateConfiguration(formData, setIsLoading);
        getInitialData()
    };

    const handleRequireCommentsApproval = async e => {
        const formData = new FormData();
        formData.append('is_comments_approval_required', !isCommentsApprovalRequired ? 1 : 0);
        await updateConfiguration(formData, setIsLoading);
        getInitialData();
    };

    const getInitialData = async () => {
        const config = await getConfiguration(setIsLoading);
        if (config.is_messages_allowed !== 1 && config.is_messages_allowed !== 0) {
            setIsMessagesAllowed(true);

        } else {
            setIsMessagesAllowed(config.is_messages_allowed === 1 ? true : false);
        }
        if (config.is_comments_approval_required !== 1 && config.is_comments_approval_required !== 0) {
            setIsCommentsApprovalRequired(true);

        } else {
            setIsCommentsApprovalRequired(config.is_comments_approval_required === 1 ? true : false);
        }
    }

    useEffect(() => {
        getInitialData();
    }, []);


    return (
        <div style={{ margin: 'auto', maxWidth: 400 }}>
            <h1>Settings</h1>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}

            <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, padding: 20, fontSize: '1.2em' }}><span style={{ marginRight: 10 }}>Messages Allowed</span>
                <Checkbox checked={!!isMessagesAllowed} onChange={handleAllowMessages} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: 200, padding: 20, fontSize: '1.2em' }}><span style={{ marginRight: 10 }}>Comments approval required</span>
                <Checkbox checked={!!isCommentsApprovalRequired} onChange={handleRequireCommentsApproval} />
            </div>
        </div>
    )
}

export default RegisterUser
