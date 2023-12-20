export const getUpComingSession = async (token: string | any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/teacher/upcomingSession`,
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
