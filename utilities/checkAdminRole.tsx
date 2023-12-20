const checkAdminRole = async (id: any) => {
    let status = false;
    const response = await fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    if(data.data?.role === 'admin') {
        status = true
    } else {
        status = false
    }
    return status;
}
export default checkAdminRole;