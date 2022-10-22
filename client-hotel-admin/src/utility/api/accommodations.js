import axios from "axios";
import { getDefaultHeader } from "../utility";
const { REACT_APP_API_URL } = process.env;

export const getAccommodations = async (setAccommodations, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/accommodations/all/all`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
    console.log('Fetch accommodations response', res)
    const accommodations = res.data || [];
    setAccommodations(accommodations);
    setIsLoading(false)
}

export const getAccommodation = async (accommodationId, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/accommodations/${accommodationId}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch accommodation error', e)
        setIsLoading(false)
    }
    console.log('Fetch accommodation response', res)
    setIsLoading(false)
    return res.data || [];

}

export const createAccommodation = async (values, setIsLoading) => {
    // const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.post(`${REACT_APP_API_URL}/accommodations`, values);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Create accommodation error', e)
        setIsLoading(false)
    }
    console.log('Create accommodation response', res)
    setIsLoading(false)
    return res.data
}

export const updateAccommodation = async (accommodationId, values, setIsLoading) => {
    // const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.put(`${REACT_APP_API_URL}/accommodations/update/${accommodationId}`, values);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Create accommodation error', e)
        setIsLoading(false)
    }
    console.log('Create accommodation response', res)
    setIsLoading(false)
    return res.data
}

export const deleteAccommodation = async (id, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res;
    setIsLoading(true)
    try {
        res = await axios.delete(`${REACT_APP_API_URL}/accommodations/delete/${id}`);

    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch accommodations response', res)
}