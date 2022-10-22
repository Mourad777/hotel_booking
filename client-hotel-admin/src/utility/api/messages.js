import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const getMessages = async (setMessages, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    let res = {};
    try {
        res = await axios.get(`${REACT_APP_API_URL}/messages`, getDefaultHeader(token));
    } catch (e) {
        console.log('Messages response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch messages response', res)
    const messages = res.data || [];
    setMessages(messages);
}


export const getMessage = async (messageId, setMessage, setIsLoading) => {
    setIsLoading(true)
    let res;
    try {
        res = await axios.get(`${REACT_APP_API_URL}/message/${messageId}`);
    } catch (e) {
        console.log('Message response error: ', e);
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch message response', res)
    const message = res.data;
    setMessage(message);
}