import { cookies } from "next/headers";

export const getStaticData = async (api: string | any) => {
    const token = cookies().get('token')
    const res = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/${api}`, {
        method: "GET",
        headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token?.value}`
                    }
    })
    const data = await res.json();
    const total = await data;
    return total;
}