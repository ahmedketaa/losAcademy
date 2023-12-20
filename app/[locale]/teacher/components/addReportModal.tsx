"use client";

import {
  CustomFlowbiteTheme,
  Label,
  Modal,
  Radio,
  Select,
  TextInput,
  Textarea,
} from "flowbite-react";
import React, { useState } from "react";
import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import Cookies from "universal-cookie";
import LoadingButton from "../../admin/components/loadingButton";
import { useRouter } from "next/navigation";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { FaRegFileLines } from "react-icons/fa6";

export default function AddReportModal({
  openAssignModal,
  handleCloseModal,
  sessionID,
}: {
  sessionID?: any;
  openAssignModal: boolean;
  handleCloseModal: () => void;
}) {

  const idSession = sessionID && sessionID;
  const modalRef = useRef<HTMLDivElement>(null);

  const [id, setId] = useState(idSession);
  const [grade, setGrade] = useState("");
  const [comment, setComment] = useState("");
  const [arabicGrade, setArabicGrade] = useState("");
  const [quranGrade, setQuranGrade] = useState("");
  const [islamicGrade, setIslamicGrade] = useState("");
  const [arabicComment, setArabicComment] = useState("");
  const [quranComment, setQuranComment] = useState("");
  const [islamicComment, setIslamicComment] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const toast = useRef<Toast>(null);

  const showSuccess = (message: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 5000,
    });
  };
  const showError = (message: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 5000,
    });
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

  const modalTheme: CustomFlowbiteTheme["modal"] = {
    header: {
      base: "flex items-start justify-between rounded-t px-5 py-2 w-full",
      title: "w-full flex items-center gap-4 text-2xl font-semibold",
    },
  };

  const addReport = () => {
    console.log({
      sessionId: parseInt(id),
      title: "report",
      comment: comment,
      grade: grade,
      arabic: arabicGrade,
      quran: quranGrade,
      islamic: islamicGrade,
      arabicComment,
      quranComment,
      islamicComment
    });
    setIsProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: JSON.stringify({
        sessionId: parseInt(id),
        title: "report",
        comment: comment,
        grade: grade,
        arabic: arabicGrade,
        quran: quranGrade,
        islamic: islamicGrade,
        arabicComment,
        quranComment,
        islamicComment
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          showSuccess(data.message);
          window.location.reload();
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
      size={"3xl"}
    >
      <Modal.Header theme={modalTheme.header}>
        Add Report <FaRegFileLines />
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <Toast ref={toast} />
          <div>
            <div className="mb-2 block">
              <Label htmlFor="id" value="Session ID" />
            </div>
            <TextInput
              id="id"
              defaultValue={id}
              onChange={(e) => setId(e.target.value)}
              type="text"
            />
          </div>
          <h3 className="mb-3">Select Courses: </h3>
          <div id="checkbox" className="flex flex-col gap-4">
            <div className="mb-2 block">
              <div className="flex flex-col max-md:w-full w-[40%] justify-center items-start gap-3">
                <label htmlFor="arabic" className="ml-2">
                  Arabic:
                </label>
                <Select
                  id="arabic"
                  defaultValue={arabicGrade}
                  onChange={(e) => setArabicGrade(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select Arabic Grade </option>
                  <option value="excellent">Excellent</option>
                  <option value="very good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below average">Below Average</option>
                </Select>
              </div>
              <TextInput
                id="arabicComment"
                placeholder="Arabic Comment"
                type="text"
                className="my-2"
                onChange={(e) => setArabicComment(e.target.value)}
              />
            </div>
            <div className="mb-2 block">
              <div className="flex flex-col max-md:w-full w-[40%] justify-center items-start  gap-3">
                <label htmlFor="quran" className="ml-2">
                  Quran:
                </label>
                <Select
                  id="quran"
                  defaultValue={quranGrade}
                  onChange={(e) => setQuranGrade(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select Quran Grade </option>
                  <option value="excellent">excellent</option>
                  <option value="very good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below average">Below Average</option>
                </Select>
              </div>
              <TextInput
                id="quranComment"
                placeholder="Quran Comment"
                type="text"
                className="my-2"
                onChange={(e) => setQuranComment(e.target.value)}
              />
            </div>
            <div className="mb-2 block">
              <div className="flex flex-col max-md:w-full w-[40%] justify-center items-start gap-3">
                <label htmlFor="quran" className="ml-2">
                  Islamic:
                </label>
                <Select
                  id="islamic"
                  defaultValue={islamicGrade}
                  onChange={(e) => setIslamicGrade(e.target.value)}
                  className="w-full"
                >
                  <option value="">Select Islamic Grade </option>
                  <option value="excellent">excellent</option>
                  <option value="very good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below average">Below Average</option>
                </Select>
              </div>
              <TextInput
                id="islamicComment"
                placeholder="Islamic Comment"
                type="text"
                className="my-2"
                onChange={(e) => setIslamicComment(e.target.value)}
              />
            </div>
          </div>
          <fieldset className="flex w-full flex-col gap-4" id="radio">
            <legend className="mb-4">Grade</legend>
            <div className={"flex flex-row gap-4"}>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="excellent">
                  <Radio
                    id="excellent"
                    name="radio"
                    value="excellent"
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">Excellent</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="veryGood">
                  <Radio
                    id="veryGood"
                    name="radio"
                    value="very good"
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">very good</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="Good">
                  <Radio
                    id="Good"
                    name="radio"
                    value="good"
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">Good</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="Average">
                  <Radio
                    id="Average"
                    name="radio"
                    value="average"
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">Average</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="Below Average">
                  <Radio
                    id="Below Average"
                    name="radio"
                    value="below average"
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">Below Average</span>
                </Label>
              </div>
            </div>
          </fieldset>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Your message" />
            </div>
            <Textarea
              id="comment"
              placeholder="Leave a comment..."
              required
              rows={4}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="w-full">
            <LoadingButton
              title={"Add Report"}
              action={addReport}
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
