import React from "react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Calendar, CalendarProps } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import PrimaryButton from "../../components/PrimaryButton";
import { Toast } from "primereact/toast";
import ViewCourses from "./viewCourses";
import { Button } from "flowbite-react";
import { useRouter } from "next/navigation";

function BookFreeSession({ setOpenBookModal }: any) {
  const [freedatetime12h, setFreeDateTime12h] = useState<Nullable<Date> | any>(
    null
  );
  const [selectedCourses, setSelectedCourses] = useState<any[]>([]);
  const handleSelectCourses = (courses: any[]) => {
    setSelectedCourses(courses);
  };
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
const router=useRouter();
  const toast = useRef<Toast>(null);
  const cookie = new Cookies();
  const url = process.env.NEXT_PUBLIC_APIURL;
  const token = cookie.get("token");

  const showSuccessMessage = (message: any) => {
    toast?.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 5000,
    });
  };

  const showErrorMessage = (message: any) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
  };
  const handleBookFreeClick = () => {
    if (
      !freedatetime12h ||
      !Array.isArray(freedatetime12h) ||
      freedatetime12h.length === 0
    ) {
      showErrorMessage("Please select at least one date for booking.");
      return;
    }

    const selectedDates = freedatetime12h.map((date) => date.toISOString());

    const selectedCourseTitles = selectedCourses.map((course) => course.title.toLowerCase());

      const requestBody = {
        sessionDates: selectedDates,
        courses: selectedCourseTitles,
      };
      setIsProcessing(true);
    fetch(`${url}/session/free/request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsProcessing(false);
        if (data.status === "success") {
          showSuccessMessage("Booking Free Session successful");
          setTimeout(() => {
            setOpenBookModal(false);
            router.refresh();
          }, 4000);
        } else {
          setIsProcessing(false);
          showErrorMessage(data.message);
        }
      })
      .catch((error) => {
        // console.error("Error fetching Free sessions:", error);
        showErrorMessage("Booking failed");
      });
  };

  useEffect(() => {
    // console.log(freedatetime12h);
  }, [freedatetime12h]);

  return (
    <div className=" flex justify-center flex-col items-center gap-5">
      <div className="courses w-full flex justify-center">
        <ViewCourses onSelectCourses={handleSelectCourses} />
      </div>
      <Calendar
        value={freedatetime12h}
        onChange={(e: CalendarProps | any) => setFreeDateTime12h(e.value)}
        showTime
        hourFormat="12"
        style={{
          outline: "4px solid var(--secondary-color)",
          borderRadius: "16px",
          width: "408px",
          height:'100%'
        }}
        inline
        selectionMode="multiple"
      />
      <div>
      <Button
        onClick={handleBookFreeClick}
        color="purple"
        isProcessing={isProcessing}
        pill
        size="md"
        className={
          "bg-secondary-color hover:bg-[#3b369a] text-white 	py-2 border rounded-3xl text-md px-10	 transition-all	duration-500 "
        }
      >
        <p>Book Free Session</p>
      </Button>
       
      </div>
      <Toast ref={toast} />
    </div>
  );
}

export default BookFreeSession;
