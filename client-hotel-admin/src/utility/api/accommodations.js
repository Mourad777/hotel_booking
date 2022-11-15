import axios from "axios";
import { getDefaultHeader } from "../utility";
const { REACT_APP_API_URL } = process.env;

export const getAccommodations = async (setAccommodations, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/all/all`, getDefaultHeader(token));
        console.log('Fetch accommodations response', res)
        const accommodations = res.data || [];
        setAccommodations(accommodations);
        setIsLoading(false)

    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
}

export const getAccommodation = async (accommodationId, setIsLoading) => {
    const token = localStorage.getItem('token');
    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${accommodationId}`, getDefaultHeader(token));
        console.log('Fetch accommodation response', res)
        setIsLoading(false)
        return res.data || [];

    } catch (e) {
        console.log('Fetch accommodation error', e)
        setIsLoading(false)
    }
}

export const createAccommodation = async (values, setIsLoading) => {
    setIsLoading(true)
    try {
        const response = await axios.post(`${REACT_APP_API_URL}/accommodations`, values);
        console.log('Create accommodation response', response)
        setIsLoading(false)
        return response.data
    } catch (e) {
        console.log('Create accommodation error', e)
        setIsLoading(false)
    }
}

export const updateAccommodation = async (accommodationId, values, setIsLoading) => {
    let res = {};
    setIsLoading(true)
    try {
        const response = await axios.put(`${REACT_APP_API_URL}/accommodations/update/${accommodationId}`, values);
        console.log('Create accommodation response', res)
        setIsLoading(false)
        return response.data
    } catch (e) {
        console.log('Create accommodation error', e)
        setIsLoading(false)
    }
}

export const deleteAccommodation = async (id, setIsLoading) => {
    setIsLoading(true)
    try {
       const res = await axios.delete(`${REACT_APP_API_URL}/accommodations/delete/${id}`);
       setIsLoading(false)
       console.log('Fetch accommodations response', res)
    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
}