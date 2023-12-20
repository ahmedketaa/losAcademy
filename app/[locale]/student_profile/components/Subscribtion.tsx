"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import PrimaryButton from "../../components/PrimaryButton";
import CancelSubscription from "./CancelSubscription";
import StudentPlanModal from "./StudentPlanModal";

export default function Subscribtion({
  setOpenSubscribtionModal,
  openSubscribtionModal,
}: any) {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");
  const [mySubscription, setMySubscription] = useState<any[]>([]);
  const [showSubscriptionDetails, setShowSubscriptionDetails] = useState(true);
  const [openPlansModal, setOpenPlansModal] = useState<boolean>(false);
  const handleCancelSubscriptionClick = () => {
    setShowSubscriptionDetails(false);
  };
  const handleClose = () => {
    setOpenSubscribtionModal(false);
    setShowSubscriptionDetails(true);
  };
  // Function to handle stay subscription click
  const handleStaySubscriptionClick = () => {
    setShowSubscriptionDetails(true);
  };
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

  // Subsribtion Sessions Api

  useEffect(() => {
    fetch(`${url}/user/mySubscription`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // console.log("obj", data.data);
        // console.log("status", data.status);

        
        if(data.status==="success"){
        }
        const planData = data.data && data.data.planId ? data.data : null;

        if (planData) {
          // Update the state with the plan data
          setMySubscription([planData]);
        } else {
          // Handle the case where the plan information is missing or invalid
          // console.log("Invalid or missing plan information in the API response");
        }
        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        console.error("Error fetching sessions:", error);
      });
  }, []);


  return (
    <>
      <StudentPlanModal
        openPlansModal={openPlansModal}
        setOpenPlansModal={setOpenPlansModal}
      />

      {/* <Button onClick={() => setOpenSubscribtionModal(true)}>Toggle Subscription modal</Button> */}
      <Modal
        show={openSubscribtionModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"2xl"}
        onClose={handleClose}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>
        <Modal.Body>
          {showSubscriptionDetails? (
            <>
             {mySubscription.length!==0 ? (
            <div className="p-10 pt-3">
              <h3 className="font-semibold text-lg mb-3">Subscriptions</h3>
              <div className="content mt-5">
                <div className="flex justify-between  ">
                  <h3 className="pl-2 text-md font-medium">Plan Details</h3>
                  <div>
                    <p className="bg-green-500 text-white px-3 text-center py-1 rounded-lg">
                      {mySubscription[0]?.planTitle || "No Plan"}
                    </p>
                    <p className="bg-[--secondary-color] text-center my-1 text-white px-3 py-1 rounded-lg">
                       {(mySubscription[0]?.type || "standard").toUpperCase()}
                    </p>
                    <p className="bg-white text-center my-1.5 shadow px-3 py-1 rounded-lg">
                     {(mySubscription[0]?.status || "standard").toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="border border-[#828282] rounded-2xl mt-5 px-8 py-5 w-fit ">
                  <ul className="list-disc ml-3">
                    <li>
                      {mySubscription[0]?.sessionsPerWeek || 0} Days Per Week{" "}
                    </li>
                    <li className="my-2">
                      {mySubscription[0]?.price || 0}$ per Month{" "}
                    </li>
                    <li>
                      Session Duration {mySubscription[0]?.sessionDuration || 0}{" "}
                      mins
                    </li>
                  </ul>
                </div>
                <div className="flex justify-between mt-10">
                  <div>
                    <h3 className="font-medium text-lg mb-3">
                      Subscription Date
                    </h3>
                    <p>
                      {convertDateTimeZone(
                        mySubscription[0]?.subscriptionStartAt,
                        "UTC",
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "MMM D,YYYY"
                      )}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-3">Renewal Date</h3>
                    <p>
                      {convertDateTimeZone(
                        mySubscription[0]?.subscriptionEndAt,
                        "UTC",
                        Intl.DateTimeFormat().resolvedOptions().timeZone,
                        "MMM D,YYYY"
                      )}
                    </p>
                  </div>
                </div>
                <div className="buttons flex gap-4 justify-center mt-8 mb-0">
                  <PrimaryButton
                    onClick={handleCancelSubscriptionClick}
                    text="Cancel Plan"
                    ourStyle="border-red-500 hover:bg-secondary-color hover:text-white hover:border-secondary-color  border-2  text-red-500 font-medium hover:border-red-700	py-2 border rounded-3xl text-md px-10	transition-all	duration-200 "
                  />
                  <PrimaryButton
                    text="Change Plan"
                    ourStyle="bg-secondary-color hover:bg-[#3b369a] text-white	py-2 border rounded-3xl text-md px-10	 transition-all	duration-500 "
                  />
                </div>
              </div>
            </div>
            )
            :(
              <div className="p-2 pt-">
              <h3 className="font-semibold text-lg mb-3">Subscriptions</h3>
              <div className="content mt-1">
                <p className="text-lg">No Plan</p>
              </div>
            </div>
            )}
            </>

          ): (
            <CancelSubscription onCancel={handleStaySubscriptionClick} />

          )}
           
         
        </Modal.Body>
      </Modal>
    </>
  );
}
  

