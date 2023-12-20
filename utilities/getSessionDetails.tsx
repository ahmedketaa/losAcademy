"use client"

import Cookies from "universal-cookie"

export const getSessionsDetails =  (id: any) => {
    const token = new Cookies();
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.get("token")}`
        }
    })
    .then(response => response.json())
    .then(data => {
        return data
    }).catch(err => console.log(err))
}