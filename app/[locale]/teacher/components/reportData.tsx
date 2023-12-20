"use client";

import { AiOutlineFileText } from "react-icons/ai";
import { BsFileEarmarkArrowDown } from "react-icons/bs";
import { BiSolidEditAlt } from "react-icons/bi";
import ReportModal from "./reportModal";
import { useState } from "react";
import { Tooltip } from "flowbite-react";
import EditReportModal from "./editReportModal";
import { convertDateTimeZone } from "@/utilities";

export default function ReportData({
  data,
  visibleEdit,
}: {
  data: any;
  visibleEdit?: any;
}) {
  const reports = data && data;

  const convertDate = convertDateTimeZone;
  const [selectedReport, setselectedReport]: any = useState(false);
  const [selectedEditReport, setselectedEditReport]: any = useState(false);

  const handleOpen = () => {
    setselectedReport(true);
  };
  const handleCloseModal = () => {
    setselectedReport(false);
  };
  const handleOpenEdit = () => {
    setselectedEditReport(true);
  };
  const handleCloseEditModal = () => {
    setselectedEditReport(false);
  };

  return (
    <div
      className={
        "bg-white-color px-8 py-5 rounded-[16px] flex justify-between items-center w-full my-4 flex-wrap"
      }
    >
      <div className={"flex items-center justify-center gap-5"}>
        <AiOutlineFileText className={"text-[26px]"} />
        <div className={"flex flex-col gap-2"}>
          <p className={"font-semibold text-base"}>{`Report ID ${
            reports.id
          } (${convertDate(
            reports.createdAt,
            "UTC",
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            "D-MMM-YYYY"
          )})`}</p>
          <span>{reports.title}</span>
        </div>
      </div>
      <div className={"flex gap-5 items-center ms-auto"}>
        <button className={"smallBtn"} onClick={handleOpen}>
          View
        </button>
        {visibleEdit ? (
          <Tooltip content="Edit Report">
            <BiSolidEditAlt
              className={"text-2xl cursor-pointer"}
              style={{ color: "green" }}
              onClick={handleOpenEdit}
            />
          </Tooltip>
        ) : (
          ""
        )}
        <EditReportModal
          openAssignModal={selectedEditReport}
          handleCloseModal={handleCloseEditModal}
          reportDetails={reports}
        />
      </div>
      <ReportModal
        openAssignModal={selectedReport}
        handleCloseModal={handleCloseModal}
        details={reports}
      />
    </div>
  );
}
