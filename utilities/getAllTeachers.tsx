export const getAllTeachers: any = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json()).then(data => {
        return data;
    }).catch(err => console.log(err))
}