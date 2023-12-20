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
  import { useRouter } from "next/navigation";
  import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
  import { FaRegFileLines } from "react-icons/fa6";
  import LoadingButton from "@/app/[locale]/admin/components/loadingButton";
  import { myStudents } from "@/utilities/getMyStudents";

  export default function AddMonthlyReport({
      openReportModal,
    handleCloseModal,
    updateComponent
  }: {
      openReportModal: boolean;
    handleCloseModal: () => void;
    updateComponent: () => void;
  }) {
    const modalRef = useRef<HTMLDivElement>(null);

    const [studentId, setStudentId] = useState("");
    const [comment, setComment] = useState("");
    const [arabicGrade, setArabicGrade] = useState("");
    const [quranGrade, setQuranGrade] = useState("");
    const [islamicGrade, setIslamicGrade] = useState("");
    const [arabicToPage, setArabicToPage] = useState("")
    const [quranToPage, setQuranToPage] = useState("")
    const [islamicToPage, setIslamicToPage] = useState("")
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const cookies = new Cookies();
    const toast = useRef<Toast>(null);
    const myStudentsData = myStudents(cookies.get('token'));

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

      if (openReportModal) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openReportModal, handleCloseModal]);
    if (!openReportModal) {
      return null;
    }

    const modalTheme: CustomFlowbiteTheme["modal"] = {
      header: {
        base: "flex items-start justify-between rounded-t px-5 py-2 w-full",
        title: "w-full flex items-center gap-4 text-2xl font-semibold",
      },
    };


    const addReport = () => {

      const reportData: {[key: string]: any } = {}

      if(studentId !== "") {
        reportData.userId = studentId
      }
      if(comment !== "") {
        reportData.comment = comment
      }
      if(arabicGrade !== "") {
        reportData.arabicGrade = arabicGrade
      }
      if(quranGrade !== "") {
        reportData.quranGrade = quranGrade
      }
      if(islamicGrade !== "") {
        reportData.islamicGrade = islamicGrade
      }
      if(arabicToPage !== "") {
        reportData.arabicToPage = parseInt(arabicToPage)
      }
      if(quranToPage !== "") {
        reportData.quranToPage = parseInt(quranToPage)
      }
      if(islamicToPage !== "") {
        reportData.islamicToPage = parseInt(islamicToPage)
      }

      
      if(Object.keys(reportData).length === 0) {
        showError("No data to added monthly report")
        return
    }

      console.log(reportData);
      setIsProcessing(true);
      fetch(`${process.env.NEXT_PUBLIC_APIURL}/monthlyReport/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cookies.get("token")}`,
        },
        body: JSON.stringify(reportData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            showSuccess(data.message);
            updateComponent();
            // router.refresh();
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
        show={openReportModal}
        onClose={handleCloseModal}
        size={"3xl"}
      >
        <Modal.Header theme={modalTheme.header}>
          Add Monthly Report <FaRegFileLines />
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <Toast ref={toast} />
            <div>
              <div className="mb-2 block">
                <Label htmlFor="id" value="Select User" />
              </div>
              <Select
                id="id"
                defaultValue={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full"
              >
                <option value="">Select User</option>
                {myStudentsData && myStudentsData.map((student: any, index: number) => {
                  return (
                    <option key={index} value={student.id}>
                      {student.name} - { student.id.substring(student.id.length - 4, student.id.length)}
                    </option>
                  );
                })}
              </Select>
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
                  id="arabicToPage"
                  placeholder="Arabic To Page"
                  type="text"
                  className="my-2"
                  onChange={(e) => setArabicToPage(e.target.value)}
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
                  id="quranToPage"
                  placeholder="Quran To Page"
                  type="text"
                  className="my-2"
                  onChange={(e) => setQuranToPage(e.target.value)}
                />
              </div>
              <div className="mb-2 block">
                <div className="flex flex-col max-md:w-full w-[40%] justify-center items-start  gap-3">
                  <label htmlFor="islamic" className="ml-2">
                    Islamic:
                  </label>
                  <Select
                    id="islamic"
                    defaultValue={islamicGrade}
                    onChange={(e) => setIslamicGrade(e.target.value)}
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
                  id="islamicToPage"
                  placeholder="Islamic To Page"
                  type="text"
                  className="my-2"
                  onChange={(e) => setIslamicToPage(e.target.value)}
                />
              </div>
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
          </div>
        </Modal.Body>
      </Modal>
    );
  }
