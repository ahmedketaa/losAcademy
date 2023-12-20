"use client"

import { useEffect, useState } from "react"

export const getAllStudents = (token: string) => {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.status === "success"){
                setData(data.data)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])
   return data
}