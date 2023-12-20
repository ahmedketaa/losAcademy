"use client";

import { CustomFlowbiteTheme, Datepicker, Label, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import LoadingButton from "../../admin/components/loadingButton";
import { useRouter } from "next/navigation";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Toast } from "primereact/toast";

export default function RescheduleModal({
  openAssignModal,
  handleCloseModal,
  session,
}: {
  openAssignModal: boolean;
  handleCloseModal: () => void;
  session: any;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const cookies = new Cookies();
  const [message, setMessage] = useState("");
  const sessionData = session && session;
  const [isProcessing, setIsProcessing] = useState(false);
  const [startRangeDate, setStartRangeDate] = useState<
    Nullable<(Date | null)[]> | any
  >(null);
  const [endRangeDate, setEndRangeDate] = useState<
    Nullable<(Date | null)[]> | any
  >(null);
  const toast = useRef<any>(null);
  const userName =
    (sessionData &&
      sessionData.SessionInfo &&
      sessionData.SessionInfo.user &&
      sessionData.SessionInfo.user.name) ||
    "name not found :)";

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

    if (openAssignModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openAssignModal, handleCloseModal]);

  if (!openAssignModal) {
    return null;
  }

  const reschduleRequest = () => {
    console.log({
      sessionId: sessionData.id,
      newDateStartRange: [
        new Date(startRangeDate).toISOString(),
        new Date(endRangeDate).toISOString(),
      ],
    });
    setIsProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher/requestReschedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },

      body: JSON.stringify({
        sessionId: sessionData.id,
        newDatesOptions: [
          new Date(startRangeDate).toISOString(),
          new Date(endRangeDate).toISOString(),
        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          showSuccess(data.message);
        } else {
          showError(data.message);
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err.message);
        setIsProcessing(false);
      });
  };

  return (
    <Modal
      ref={modalRef}
      show={openAssignModal}
      onClose={handleCloseModal}
      size={"2xl"}
    >
      <Modal.Header theme={modalTheme.header}>
        Reschedule Session for Student :{" "}
        <span className="capitalize font-bold italic">{userName}</span>
      </Modal.Header>
      <Toast ref={toast} />
      <Modal.Body>
        <div className="m-auto flex flex-col items-center justify-center">
          <div className="mb-2 block">
            <Label htmlFor="rengeDateEnd" value="Select Option Date One " />
          </div>
          <input
            type="datetime-local"
            className="border-[5px] border-secondary-color rounded-xl"
            defaultValue={startRangeDate}
            onChange={(e) => setStartRangeDate(e.target.value)}
          />
          <div className="mb-2 block">
            <Label htmlFor="rengeDateEnd" value="Select Option Date Two " />
          </div>
          <input
            type="datetime-local"
            className="border-[5px] border-secondary-color rounded-xl"
            defaultValue={endRangeDate}
            onChange={(e) => setEndRangeDate(e.target.value)}
          />
          <div className="w-full mt-3 flex items-center justify-center">
            <LoadingButton
              title={"Reschdeule Session"}
              action={reschduleRequest}
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
