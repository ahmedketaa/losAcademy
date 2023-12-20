export const getMyAllSessions = async (token: string | any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APIURL}/teacher/sessions`,
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
