import axios, { AxiosResponse,  } from 'axios'
import { IPromotion } from "../constants/types"

function getBaseUrl() {
    return `http://localhost:${process.env.PORT || 8000}/`
}

export const getPromotions = async (page: any, limit: any) => {
    try {
        const response = await fetch(`${getBaseUrl()}promotion/getAll?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if (response && response.ok) {
            return await response.json()
        }
    } catch (err) {
        throw new Error(err)
    }
}

export const createPromotions = () => {
    const req = axios.post(`${getBaseUrl()}promotion/generateFakeData` )
        .then((res: AxiosResponse) => {
            if (res.data) {
                return res.data
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return req
}


export const updatePromotion = (payload: IPromotion) => {
    const req = axios.patch(`${getBaseUrl()}promotion/update/${payload.uuid}`, payload)
        .then((res: AxiosResponse) => {
            if (res.data) {
                return res.data
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return req
}


export const deletePromotion = (id: string) => {
    const req = axios.delete(`${getBaseUrl()}promotion/delete/${id}`)
        .then((res: AxiosResponse) => {
            if (res.data) {
                return res.data
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return req
}


export const addPromotion = (payload: IPromotion) => {
    const req = axios.post(`${getBaseUrl()}promotion/add`, payload )
        .then((res: AxiosResponse) => {
            if (res.data) {
                return res.data.uuid
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return req
}
