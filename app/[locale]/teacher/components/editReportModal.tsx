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

export default function EditReportModal({
  openAssignModal,
  handleCloseModal,
  reportDetails,
}: {
  reportDetails: any;
  openAssignModal: boolean;
  handleCloseModal: () => void;
}) {
  const report = reportDetails && reportDetails;
  const modalRef = useRef<HTMLDivElement>(null);

  const [reportId, setReportId] = useState(report.id);
  const [grade, setGrade] = useState(report.grade);
  const [comment, setComment] = useState(report.comment);
  const [arabicGrade, setArabicGrade] = useState(report.arabic);
  const [quranGrade, setQuranGrade] = useState(report.quran);
  const [islamicGrade, setIslamicGrade] = useState(report.islamic);
  const [arabicComment, setArabicComment] = useState(report.arabicComment);
  const [quranComment, setQuranComment] = useState(report.quranComment);
  const [islamicComment, setIslamicComment] = useState(report.islamicComment);

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const cookies = new Cookies();
  const toast = useRef<Toast>(null);

  const showSuccess = (msg: string) => {
    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: msg,
      life: 4000,
    });
  };
  const showError = (msg: string) => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: msg,
      life: 4000,
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

  const editReport = () => {
    // Create an object to store updated fields
    const updatedFields: { [key: string]: any } = {};

    // Compare and assign updated fields to the object
    if (grade !== report.grade && grade !== "") {
      updatedFields.grade = grade;
    }
    if (comment !== report.comment && comment !== "") {
      updatedFields.comment = comment;
    }
    if (arabicGrade !== report.arabic && arabicGrade !== "") {
      updatedFields.arabic = arabicGrade;
    }
    if (quranGrade !== report.quran && quranGrade !== "") {
      updatedFields.quran = quranGrade;
    }
    if (islamicGrade !== report.islamic && islamicGrade !== "") {
      updatedFields.islamic = islamicGrade;
    }
    if (arabicComment !== report.arabicComment && arabicComment !== "") {
      updatedFields.arabicComment = arabicComment;
    }
    if (quranComment !== report.quranComment && quranComment !== "") {
      updatedFields.quranComment = quranComment;
    }
    if (islamicComment !== report.islamicComment && islamicComment !== "") {
      updatedFields.islamicComment = islamicComment;
    }

    if (Object.keys(updatedFields).length === 0) {
      setIsProcessing(false);
      showError("No updates made");
      return;
    }

    console.log(JSON.stringify(updatedFields));
    setIsProcessing(true);
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/report/${report.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
      body: JSON.stringify(updatedFields),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        if (data.status === "success") {
          showSuccess(data.message);
          router.refresh();
        } else {
          showError(data.message);
        }
        setIsProcessing(false);
      })
      .catch((err) => {
        console.log(err);
        showError(err);
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
        Edit Report <FaRegFileLines />
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
              defaultValue={reportId}
              onChange={(e) => setReportId(e.target.value)}
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
                  <option value="excellent">excellent</option>
                  <option value="very good">Very Good</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below average">Below Average</option>
                </Select>
              </div>
              <TextInput
                id="arabicComment"
                defaultValue={arabicComment}
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
                defaultValue={quranComment}
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
                defaultValue={islamicComment}
                type="text"
                className="my-2"
                onChange={(e) => setIslamicComment(e.target.value)}
              />
            </div>
          </div>
          <fieldset className="flex max-w-md flex-col gap-4" id="radio">
            <legend className="mb-4">Grade</legend>
            <div className={"flex flex-row gap-4"}>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="excellent">
                  <Radio
                    id="excellent"
                    name="radio"
                    value="excellent"
                    defaultChecked={grade === "excellent" ? true : false}
                    className="h-4 w-4"
                    onClick={(e: any) => {
                      setGrade(e.target.value);
                    }}
                  />
                  <span className="ml-2">Excellent</span>
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Label className="cursor-pointer" htmlFor="Good">
                  <Radio
                    id="Good"
                    name="radio"
                    value="good"
                    defaultChecked={grade === "good" ? true : false}
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
                    defaultChecked={grade === "average" ? true : false}
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
                    defaultChecked={grade === "below average" ? true : false}
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
              defaultValue={comment}
              required
              rows={4}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <div className="w-full">
            <LoadingButton
              title={"Edit Report"}
              action={editReport}
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
