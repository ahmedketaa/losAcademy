"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import AOS from "aos";
import "aos/dist/aos.css";
import RemainSessions from "./components/RemainSessions";
import CommunityStatistics from "./components/CommunityStatistics";
import UpcomingSessions from "./components/UpcomingSessions";
import EditProfile from "./components/edit_profile";
import BookModal from "./components/BookModal";
import MyInfo from "./components/myInfo";
import BannerComponent from "./components/Banner";
import MyReports from "./myReports";
import TeacherUbsent from "./components/teacherUbsent";
import RescheduleRequests from "./components/rescheduleRequests";
import { useRouter } from "next/navigation";
import ContinueWithModal from "./components/continueWithModal";
import dynamic from "next/dynamic";
import Cookies from "universal-cookie";
import SessionsRequest from "./components/sessionsRequest";
import moment from "moment-timezone";
interface Session {
  id: number;
  sessionDates: string[];
  status: string;
  type: string;
  sessionDate: string; // You might need to adjust the type based on your actual data structure
}
interface UserInfo {
  name: string;
  email: string;
  phone: string;
  id: number;
  gender: string;
  age?: number;
  sessionPlaced: boolean; // make age optional if it may not be present in the API response
}
export default function page() {
  const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

  const [myInfo, setMyInfo] = useState<UserInfo | undefined>();
  const [mySubscription, setMySubscription] = useState<any>({});
  const router = useRouter();
  const [start, setStart] = useState<boolean>(false);
  const [pendingSessionRequest, setPendingSessionRequest] = useState<Session[]>([]);
  const [teacherUbsentSessions, setTeacherUbsentSessions] = useState<any[]>([]);
  const [myReschedule, setMyReschedule] = useState<any[]>([]);
  const [teatcherreschedule, setTeatcherReschedule] = useState<any[]>([]);

  const cookie=new Cookies();
// my subscribtion
const fetchMySubscription=()=>{
  fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/mySubscription`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
        if(data.status==="success"){
      setMySubscription(data.data);
        }
      // Set the retrieved Seeions in the state
    })
    .catch((error) => {
      console.error("Error fetching subscription:", error);
    });
}
  useEffect(() => {
    fetchMySubscription();  
  }, []);

  // teacher ubsent
  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_APIURL}/user/mySessions?status=teacher_absent`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get("token")}`,
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {

        // Assuming data.data contains the sessions
        setTeacherUbsentSessions(data.data);

        // Assuming data.data.status contains the status
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);

  const convertDateTimeZone = (
    inputTime: moment.MomentInput,
    inputTimezone: string,
    outputTimezone: string,
    ourFormat: string
  ) => {
    const convertedTime = moment(inputTime)
      .tz(inputTimezone)
      .clone()
      .tz(outputTimezone);
    return convertedTime.format(ourFormat);
  };
// fetch my reschedule
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
     
        setMyReschedule(sortedPendingRequests);
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    })
    .finally(() => {
    });
};
// fetch teacher reschedule
const fetchTeacherRescheduleRequests = () => {
  fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/receivedRescheduleRequests`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${cookie.get("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);

      const pendingRescheduleRequests = data.data.filter(
        (request: any) => request.status === "pending"
      );

      const sortedPendingRescheduleRequests = pendingRescheduleRequests.sort(
        (a: any, b: any) => {
          // Adjust the sorting logic based on your specific requirements
          return moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0])
            ? 1
            : -1;
        }
      );
      const sortedTeacherRequests = data.data.sort((a: any, b: any) =>
        moment(a.newDatesOptions[0]).isBefore(b.newDatesOptions[0]) ? 1 : -1
      );
      setTeatcherReschedule(sortedPendingRescheduleRequests);
     
    })
    .catch((error) => {
      console.error("Error fetching sessions:", error);
    })
    .finally(() => {
    });
};
useEffect(() => {
  fetchMyReschedule();
  fetchTeacherRescheduleRequests();
}, [])

  // handle first visit
  useEffect(() => {
    // Check if the 'visited' cookie exists
    const hasVisitedBefore = cookie.get('visited');

    if (!hasVisitedBefore) {
      // If it doesn't exist, it's the user's first visit 
      setStart(true);
      // Set the 'visited' cookie to true with an expiry date
      cookie.set('visited', true, { maxAge: 2592000 }); // Expires in 1 month days
    } else {
      setStart(false)
    }
  }, []);
  

// sesion request
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/mySessionReq`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);
        
        const sortedSessions = data.data.map((session: Session) => ({
          ...session,
          sessionDates: session.sessionDates.map((date) =>
            moment(date).toDate()
          ),
        }));

        sortedSessions.sort((a: Session, b: Session) => {
          const dateA = new Date(
            Math.max(...a.sessionDates.map((date: any) => date.getTime()))
          );
          const dateB = new Date(
            Math.max(...b.sessionDates.map((date: any) => date.getTime()))
          );
          return dateB.getTime() - dateA.getTime();
        });

        // console.log("sorted session requests ",sortedSessions);
        const pendingSessions = sortedSessions.filter((session :Session) => session.status === "pending");
        setPendingSessionRequest(pendingSessions);
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);




  const [openContinueWithModal, setOpenContinueWithModal] = useState(false);
  useEffect(() => {
    const currentPageUrl = window.location.href;

    // Log the current page's URL to the console
    // console.log(`Current page URL: ${currentPageUrl}`);

    // Parse the URL to get the query parameters
    const urlSearchParams = new URLSearchParams(window.location.search);
    const fromUserContinueParam = urlSearchParams.get("fromUserContinue");

    // Log the query parameter to the console
    // console.log(`fromUserContinue parameter: ${fromUserContinueParam}`);

    // Check if the query parameter is true
    if (fromUserContinueParam === "true") {
      // If true, set the state to open the modal
      setOpenContinueWithModal(true);
    }
  }, []);

  const [steps] = useState<any[]>([
    {
      content: <h1>Hello This Tips To Show You Your Page Sections</h1>,
      placement: "center",
      target: "body",
    },
    {
      target: ".book_section",
      content:
        "From here, you can book a free session or a paid session after subscribing to a plan.",
    },
    {
      target: ".reports_section",
      content: "The reports that your teachers write about you appear here",
    },
    {
      target: ".community_section",
      content:
        "our community statistics appear here, including your attendance.",
    },
    {
      target: ".remain_sessions_section",
      content: "All your pending sessions appear here.",
    },
    {
      target: ".rescheduling_section",
      content:
        "All rescheduling requests, whether from you or your teacher, appear here.",
    },
    {
      target: ".teacher_ubsent_section",
      content: "The sessions that your teacher was absent from appear here.",
    },
  ]);

  useEffect(() => {
    // console.log(pendingSessionRequest);
    
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <main
      className={
        "ps-10 pe-10 pt-[7rem] max-md:mt-7  max-md:justify-between max-md:items-center"
      }
    >
      {/* <button
      className="underline text-secondary-color"
      onClick={()=>setStart(true)}
      >Show Website Guides</button> */}

      {start ? (
        <Joyride
          steps={steps}
          run={start}
          continuous
          showProgress
          showSkipButton
        />
      ) : (
        ""
      )}

      <ContinueWithModal
        openContinueWithModal={openContinueWithModal}
        setOpenContinueWithModal={setOpenContinueWithModal}
      />
      {mySubscription.lenght==0?  (
        <BannerComponent
          message={"You Want To Enjoy Sessions?"}
          animation={"animate-bounce"}
          header={"Los Academy Plans"}
        />
      ):''}
      <div className="myInfo flex justify-center items-center">
        <MyInfo myInfo={myInfo} />
      </div>
      <div className="grid grid-cols-3 max-sm:grid-cols-1 max-md:grid-cols-2 justify-between gap-5	 mt-7">
        <div className="card w-full  ">
          <EditProfile setMyInfo={setMyInfo} />
          <div className="">
          <h3 className={`${styles.secondary_head} pb-2 ml-3 my-2`}>
            </h3>
            {myReschedule.length>0 || teatcherreschedule.length>0?
             <div
             className={`my-11 p-3 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px]	rescheduling_section`}
           >
             <h3 className={`${styles.secondary_head} mb-3 mt-2 ml-2`}>
               Reschedule Requests{" "}
             </h3>
 
             <div data-aos="fade-up" className=" ">
               <RescheduleRequests  fromStudentProfile={true} />
             </div>
           </div>
          :''}
         
            <div
              className={`community_section	w-full my-11 p-3 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px]	`}
            >
              <h4 className={`${styles.secondary_head} mb-3 ml-3`}>
                Community statistics :
              </h4>
              <div data-aos="fade-down">
                <CommunityStatistics />
              </div>
            </div>
            {teacherUbsentSessions.length>0? 
            (
              <>
               <div
            className={`mr-1  mb-10 mt-10  p-5  shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px] 	`}
          >
            <h3 className={`${styles.secondary_head} pb-2 ml-3 my-2`}>
              Teacher Ubsent Sessions
            </h3>
            <div
              data-aos="fade-up"
              data-aos-anchor="#example-anchor"
              data-aos-offset="500"
              data-aos-duration="500"
              className="h-[200px] teacher_ubsent_section scrollAction "
            >
              <TeacherUbsent />
            </div>
          </div>
              </>
            ):''}
           
          </div>
        </div>
        <div className="card w-full mr-3  ">
          <h3 className={`${styles.main_head} mb-8 `}>Sessions</h3>
          <div
            data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration="2000"
            className="upcoming_section "
          >
            <UpcomingSessions />
          </div>
          <div
              className={`mb-10 mt-10  shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px] p-5 pb-10 w-full remain_sessions_section`}
            >
              <h4 className={`${styles.secondary_head} pb-2`}>
                Remain Sessions:{" "}
               
              </h4>
              <div data-aos="fade-up">
                <RemainSessions  />
              </div>
            </div>
          <div
            className={` ${
              myInfo?.sessionPlaced == true ? "hidden" : ""
            } my-11 shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px]		 p-5  	`}
          >
            <h4 className={`${styles.secondary_head} ml-3 my-2`}>
              Book a Session
            </h4>
            <div
              data-aos="fade-right"
              className={`flex flex-col justify-center items-center book_section`}
            >
              <BookModal myInfo={myInfo} />
            </div>
          </div>
        </div>
        <div className="card w-full ">
          <h3 className={`${styles.main_head} mb-8`}>Reports</h3>
          <div
            className={`mr-1  p-3  shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px] reports_section	`}
          >
            <h4 className={`${styles.secondary_head} ml-3 my-2`}>My Reports</h4>
            <div data-aos="fade-right" className="scrollAction h-[160px]">
              <MyReports />
            </div>
          </div>
          {pendingSessionRequest.length>0 ? (
              <>
               <div
               data-aos="fade-up"
              className={` mb-10 mt-10  shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px] p-5 pb-10 w-full remain_sessions_section`}
            >
               <h4 className={`${styles.secondary_head} mb-5 ml-3`}>
                Your Session Requests :
              </h4>
              <div className="scrollAction mx-2 h-[250px]">
                <SessionsRequest fromStudentProfile={true} />
              </div>
              </div>
              </>
            ):''}
           
        </div>
      </div>
    </main>
  );
}
