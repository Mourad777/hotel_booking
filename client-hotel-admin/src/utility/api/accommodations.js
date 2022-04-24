import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const getAccommodations = async (setAccommodations, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/accommodations/all/all`, getDefaultHeader(token));

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
        res = await axios.get(`${AppUrl}api/accommodations/${accommodationId}`, getDefaultHeader(token));

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

        const response = await axios.post('http://localhost:3001/api/accommodations', values);

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

        const response = await axios.put(`http://localhost:3001/api/accommodations/update/${accommodationId}`, values);

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
        res = await axios.delete(`${AppUrl}api/accommodations/delete/${id}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch accommodations error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch accommodations response', res)
}