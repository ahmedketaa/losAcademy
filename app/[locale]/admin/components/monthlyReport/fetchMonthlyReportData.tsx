"use client";

import { Table, Tooltip } from "flowbite-react";
import { BsTrash } from "react-icons/bs";
import { BiFile, BiSolidEditAlt, BiTrash } from "react-icons/bi";
import { useState, useRef } from "react";
import { convertDateTimeZone } from "@/utilities";
import DisplayReportModal from "./displayReportModal";
import EditMonthlyReport from "./editMonthlyReport";
import { getAllStudents } from "@/utilities/getAllStudents";
import Cookies from "universal-cookie";
import { Toast } from "primereact/toast";

export default function FetchMonthlyReportsData({
  reportData,
  updateComponent,
}: {
  reportData: any;
  updateComponent: () => void;
}) {
  const [handleAddModal, setHandleAddModal] = useState(false);
  const [handleEditModal, setHandleEditModal] = useState(false);
  const report = reportData;
  const cookies = new Cookies();
  const [visible, setVisible] = useState(false);
  const toast = useRef<Toast>(null);
  const toastB = useRef<Toast>(null);
  const toastC = useRef<Toast>(null);

  const showError = () => {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: "Deleted Success",
      life: 3000,
    });
  };
  const openAddReportModal = () => {
    setHandleAddModal(true);
  };
  const openEditReportModal = () => {
    setHandleEditModal(true);
  };
  const closeAddReportModal = () => {
    setHandleAddModal(false);
  };
  const closeHandleEditModal = () => {
    setHandleEditModal(false);
  };
  // Delete Confirmation
  const clear = () => {
    toastC.current?.clear();
    setVisible(false);
  };
  // Confirm Delete Student

  const confirm = () => {
    if (!visible) {
      setVisible(true);
      toastC.current?.clear();
      toastC.current?.show({
        severity: "warn",
        sticky: true,
        content: (
          <div
            className="flex flex-column align-items-center"
            style={{ flex: "1" }}
          >
            <div className="flex flex-col">
              <div className="text-center">
                <i
                  className="pi pi-exclamation-triangle"
                  style={{ fontSize: "3rem" }}
                ></i>
                <div className="font-bold text-xl my-3">
                  Are you sure you want to delete?
                </div>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <button
                  className="bg-danger-color hover:bg-red-400 transition-colors text-white px-5 py-2 rounded-xl"
                  onClick={() => {
                    confirmDelete();
                    clear();
                  }}
                >
                  Yes
                </button>
                <button
                  className="bg-primary-color hover:bg-blue-900 transition-colors text-white px-5 py-2 rounded-xl"
                  onClick={() => clear()}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        ),
      });
    }
  };
  const confirmDelete = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/monthlyReport/${report.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        showError();
        const timer = setTimeout(() => {
          updateComponent();
          clearTimeout(timer);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Table.Row
      key={report.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center"
    >
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        {report.id}
      </Table.Cell>
      <Table.Cell>{report.userId}</Table.Cell>
      <Table.Cell>
        {convertDateTimeZone(
          report.createdAt,
          "UTC",
          Intl.DateTimeFormat().resolvedOptions().timeZone,
          "YYYY-MM-DD h:mm A"
        )}
      </Table.Cell>
      <Table.Cell>
        <div className="flex flex-row items-center justify-center gap-3">
          <Tooltip content="View Report" style="light">
            <BiFile
              className={"text-2xl cursor-pointer text-primary-color"}
              onClick={openAddReportModal}
            />
          </Tooltip>
          <Tooltip content="Edit Report" style="light">
            <BiSolidEditAlt
              className={"text-2xl cursor-pointer text-success-color"}
              onClick={openEditReportModal}
            />
          </Tooltip>
          <Tooltip content="Delete Report" style="light">
            <BsTrash
              className={"text-2xl cursor-pointer text-danger-color"}
              onClick={confirm}
            />
          </Tooltip>
          <Toast ref={toast} />
          <Toast ref={toastB} />
          <Toast ref={toastC} position="bottom-center" />
        </div>
        <EditMonthlyReport
          openReportModal={handleEditModal}
          handleCloseModal={closeHandleEditModal}
          reportData={report}
          updateComponent={updateComponent}
        />
        <DisplayReportModal
          openAssignModal={handleAddModal}
          handleCloseModal={closeAddReportModal}
          details={report}
        />
      </Table.Cell>
    </Table.Row>
  );
}
