import React, { useEffect, useRef, useState } from "react";
import { Button, Modal } from "flowbite-react";
import Cookies from "universal-cookie";
import { Calendar, CalendarProps } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Toast } from "primereact/toast";

function ContinueWithModal({
  openContinueWithModal,
  setOpenContinueWithModal,
}: any) {
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");
  const [continueWithFirstDate, setContinueWithFirstDate] = useState<
    Nullable<Date> | any
  >(null);
  const [latestSession, setLatestSession]:any = useState<any[]>([]);
const [isProcessing, setIsProcessing] = useState(false)
  const toast = useRef<Toast>(null);

  const showSuccess = (msg: any) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 5000,
    });
  };

  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 5000,
    });
  };
  useEffect(() => {
    fetchLatestSession();
  }, [openContinueWithModal]);

  const fetchLatestSession = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/myLatestSession`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`, // Correct the header key to 'Authorization'
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("latest", data.data);

        setLatestSession(data.data);
        // console.log(data?.data[0]?.id);

        // Set the retrieved Seeions in the state
      })
      .catch((error) => {
        // console.error("Error fetching sessions:", error);
      });
  };
  const accept = (sessionId: any) => {
    const continueData = {
      sessionId: Number(sessionId),
      willContinue: true,
    };
    console.log(continueData);

    fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/continueWithTeacher`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cookie.get("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(continueData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        if (data.status === "success") {
          // console.log("POST request successful:", data);
          toast.current?.show({
            severity: "info",
            summary: "Confirmed",
            detail: "You have accepted continue with teacher",
            life: 3000,
          });
        
        } else {
          // console.error(data);
        }
      })
      .catch((error) => {
        console.error("Error during POST request:", error);
      });
  };
  const placeDates = () => {

    accept(latestSession[0]?.id);
    if (
      !continueWithFirstDate ||
      !Array.isArray(continueWithFirstDate) ||
      continueWithFirstDate.length === 0
    ) {
      showError("Please select at least one date for booking.");
      return;
    }
    if (continueWithFirstDate && Array.isArray(continueWithFirstDate) && continueWithFirstDate.length > 0) {
      const selectedDates = continueWithFirstDate.map((date) => date.toISOString());
    
    // console.log("placeDates function is triggered");

    setIsProcessing(true)

    const rescheduleData = {
      sessionDates: selectedDates,
    };

    fetch(`${url}/session/placeSessionDates`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rescheduleData),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        setIsProcessing(false)
        if (data.status === "success") {
          window.history.replaceState(null, '', '/student_profile')
          showSuccess("session with this teacher placed successfully");
          console.log("POST request successful:", data);
          if (typeof window !== "undefined") {
            localStorage.setItem("confirmDialog", "false");
          }
          
        } else {
          console.error(data);
          showError(data.message);
          window.history.replaceState(null, '', '/student_profile')
        setIsProcessing(false)

        }
      
      })
      .catch((error) => {
        window.history.replaceState(null, '', '/student_profile')

        console.error("Error during POST request:", error);
        
      });
  };}

  return (
    <div>
      <Toast ref={toast} />
      <Modal
        show={openContinueWithModal}
        className="block  space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"xl"}
        onClose={() => setOpenContinueWithModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>

        <Modal.Body>
          <div>
            <h3 className="font-semibold text-lg mb-3">Book Sessions</h3>
            <div className="flex flex-col gap-5">
              <h4>Now You Should Please Your Session Dates That Avilible To You</h4>
              <div className="taps flex justify-center  h-1/2">
                <Calendar
                panelClassName="h-fit "
                  value={continueWithFirstDate}
                  onChange={(e: CalendarProps | any) =>
                    setContinueWithFirstDate(e.value)
                  }
                  showTime
                  inline
                  selectionMode="multiple"
                  hourFormat="12"
                  style={{
                    outline: "4px solid var(--secondary-color)",
                    width: "100%",
                  }}
                  placeholder="Select  Avilable Date and Time"
                />
              </div>
              <Button
              onClick={placeDates}
              color="purple"
              isProcessing={isProcessing}
              pill
              size="md"
              className=" max-md-px-1 text-white py-2 px-5 w-fit text-sm font-semibold transition-colors text- shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] h-10   rounded-full mx-auto max-md:px-4 max-md:w-45"

            >
              <p>Continue</p>
            </Button>
              
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default ContinueWithModal;
