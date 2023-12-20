"use client";
import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
function CommunityStatistics() {
  const cookie = new Cookies();

  const [communityStatistics, setCommunityStatistics] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/myStatistics`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);

        setCommunityStatistics(data.data);
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching  History sessions:", error);
      });
  }, []);

  return (
    <div>
      <div className={`flex justify-center gap-3 items-center mt-10 overflow-hidden`}>
        <div
          className="bg-secondary-color max-sm:px-2  sm:px-4 w-fit text-center md:px-2 max-[400px]:px-1 max-[400px]:py-4  hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-3 lg:px-10  rounded-3xl  mx-auto "
          
        >
          <span className="block text-center">Done</span>
          {`  (${communityStatistics[0]?.count || 0})Sessions`}
          </div>
        <div
          className="bg-secondary-color sm:px-4 max-sm:px-2 w-fit text-center md:px-2 hover:bg-secondary-hover text-sm max-[400px]:px-1 max-[400px]:py-4 font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-3 lg:px-10  rounded-3xl  mx-auto "
        >
          <span className="block text-center">
          Attendence
          </span>
          {communityStatistics[0]?.percent||0}
          </div>
      </div>
    </div>
  );
}

export default CommunityStatistics;
