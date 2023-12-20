
export const checkUserIsVerify = async (token: any) => {
    if(token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data.data.verified
    }
}