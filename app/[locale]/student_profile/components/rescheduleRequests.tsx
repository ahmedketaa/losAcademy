import React, { useEffect, useState } from "react";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import TeacherRescduleRequests from "./teacherRescduleRequests";
import MyRescheduleRequest from "./myRescheduleRequest";
import Cookies from "universal-cookie";
import moment from "moment-timezone";

function RescheduleRequests({fromStudentProfile}:{fromStudentProfile?:boolean}) {
  const [myReschedule, setMyReschedule] = useState<any[]>([]);
  const cookie=new Cookies();
  const fetchMyReschedule = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/requestReschedule`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
  
        const pendingRequests = data.data.filter(
          (request: any) => request.status === "pending"
        );
        const sortedPendingRequests = pendingRequests.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
        const sortedRequests = data.data.sort((a: any, b: any) =>
          moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
        );
       
        setMyReschedule(sortedRequests);

        if (fromStudentProfile === true) {
          setMyReschedule(sortedPendingRequests);
        }      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      })
      .finally(() => {
      });
  };

useEffect(() => {
  // fetchMyReschedule()
}, [myReschedule])

  const customeTheme: CustomFlowbiteTheme = {
    tab: {
      tablist: {
        base: "flex flex-nowrap items-center justify-center  w-fit  ",
        tabitem: {
          styles: {
            pills: {
              active: {
                on: " bg-white focus:ring-0 text-black w-fit   border-b-2 border-[#6D67E4]	",
                off: "   focus:ring-0  hover:bg-white hover:text-black    hover:border-[#6D67E4] 	 transition-colors",
              },
            },
          },
        },
      },
    },
  };

  return (
    <>
      <Tabs.Group className="flex-nowrap justify-center" aria-label="Pills" theme={customeTheme.tab} style="pills">
      { myReschedule.length>0?
       <Tabs.Item title="My Requests">
       <MyRescheduleRequest fromStudentProfile={fromStudentProfile}/>
     </Tabs.Item>
      :''}
        <Tabs.Item title="Teacher Requests">
          <TeacherRescduleRequests fromStudentProfile={fromStudentProfile}/>
        </Tabs.Item>
      </Tabs.Group>
    </>
  );
}

export default RescheduleRequests;
