"use client";

import { CustomFlowbiteTheme, Label, Modal, Select } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import LoadingButton from "../../admin/components/loadingButton";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { convertDateTimeZone } from "@/utilities";
export default function AcceptRescheduleModal({
  openModal,
  handleCloseModal,
  session,
  updateComponent,
}: {
  openModal: boolean;
  handleCloseModal: () => void;
  session: any;
  updateComponent?: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cookies = new Cookies();
  const sessionData = session && session;
  const [isProcessing, setIsProcessing] = useState(false);
  const [newDate, setNewDate] = useState<Nullable<(Date | null)[]> | any>(null);
  const toast = useRef<any>(null);
  const router = useRouter();
  const convertDate = convertDateTimeZone;

  useEffect(() => {
    console.log(sessionData.newDatesOptions);
  }, []);
  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  };
  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 4000,
    });
  };

  const modalTheme: CustomFlowbiteTheme["modal"] = {
    header: {
      base: "flex items-start justify-between rounded-t p-5",
    },
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleCloseModal();
      }
    };

    if (openModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal, handleCloseModal]);

  if (!openModal) {
    return null;
  }

  const acceptReschedule = () => {
    if (!newDate) {
      return showError("Please select new date");
    }

    setIsProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/acceptReschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },

      body: JSON.stringify({
        rescheduleRequestId: sessionData.id,
        newDate: newDate,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          showSuccess(data.message);
          // handleCloseModal();
          router.refresh();
        } else {
          showError(data.message);
          router.refresh();
        }
        setIsProcessing(false);
        // updateComponent()
        // handleCloseModal()
      })
      .catch((err) => {
        console.log(err);
        showError(err.message);
      });
  };

  return (
    <Modal
      ref={modalRef}
      show={openModal}
      onClose={handleCloseModal}
      size={"2xl"}
    >
      <Modal.Header theme={modalTheme.header}>
        Reschedule Session :
      </Modal.Header>
      <Toast ref={toast} />
      <Modal.Body>
        <div className="m-auto flex flex-col items-center justify-center w-[260px]">
          <div className="mb-2 block">
            <Label htmlFor="newDate" value="Select New Date " />
          </div>
          <Select
            className="w-full"
            id="newDate"
            onChange={(e) => setNewDate(e.target.value)}
          >
            <option value="">Select option</option>
            <option value={sessionData.newDatesOptions[0]}>
              {convertDate(
                session.newDatesOptions[0],
                "UTC",
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                "D-MMM-YYYY hh:mm A"
              )}
            </option>
            <option value={sessionData.newDatesOptions[1]}>
              {convertDate(
                session.newDatesOptions[1],
                "UTC",
                Intl.DateTimeFormat().resolvedOptions().timeZone,
                "D-MMM-YYYY hh:mm A"
              )}
            </option>
          </Select>
          {/* <Calendar
                    id='newDate'
                    inline
                    value={newDate} 
                    onChange={(e:any) => {
                    console.log(e.value)
                    setNewDate(e.value)
                  }}
                    showTime
                    hourFormat="12"
                    className={"border-[5px] border-secondary-color rounded-xl"}
                
              /> */}
          <div className="w-full mt-3 flex items-center justify-center">
            <LoadingButton
              title={"Reschdeule Session"}
              action={acceptReschedule}
              customStyle={
                "text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-2 px-5 transition-colors"
              }
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
