
export const getCurrentTeacher = async (token: any) => {
    if(token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if(data.status === "success") {
            return data
        } else {
            console.log("fetch error")
            return false
        }
    }
}
