export const getReschedualSession = async (token: string | any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/teacher/receivedRescheduleRequests?status=pending`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = response.json();
  return data;
};
