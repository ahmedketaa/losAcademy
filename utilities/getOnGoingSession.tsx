export const getOnGoingSession = async (token: string | any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/teacher/ongoingSession`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await response.json();
  return data;
};
