"use client";

import { CustomFlowbiteTheme, Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import MonthlyReportCombBox from "./monthlyReportCombBox";
import FetchMonthlyReportsData from "./fetchMonthlyReportData";

export default function MonthlyReportTable() {
  const [allReports, setAllReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const cookies = new Cookies();
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);
  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const getPaginatedData = () => {
    const endIndex = first + rows;
    return allReports.slice(first, endIndex);
  };
  const displaydReports = getPaginatedData();

  const customTheme: CustomFlowbiteTheme["table"] = {
    head: {
      base: "group/head text-xs uppercase text-black-color-one bg-white-color p-[15px] text-center",
      cell: {
        base: "group-first/head:first:rounded-tl-lg group-first/head:last:rounded-tr-lg bg-white-color px-6 py-3",
      },
    },
  };

  const getMonthlyReport = () => {
    fetch(`${process.env.NEXT_PUBLIC_APIURL}/monthlyReport`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAllReports(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getMonthlyReport();
  }, []);

  const updateComponent = () => {
    getMonthlyReport();
  };

  return (
    <>
      <MonthlyReportCombBox updateComponent={updateComponent} />
      <div className={"px-5 py-4"}>
        <Table>
          <Table.Head theme={customTheme.head}>
            <Table.HeadCell theme={customTheme.head}>#Report ID</Table.HeadCell>
            <Table.HeadCell theme={customTheme.head}>
              Student Name
            </Table.HeadCell>
            <Table.HeadCell theme={customTheme.head}>
              Report Date
            </Table.HeadCell>
            <Table.HeadCell theme={customTheme.head}>options</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {isLoading ? (
              <Table.Row>
                <td>
                  <Spinner size="xl" />
                </td>
              </Table.Row>
            ) : allReports && allReports.length > 0 ? (
              displaydReports.map((report: any, index: number) => {
                return (
                  <FetchMonthlyReportsData
                    key={index}
                    reportData={report}
                    updateComponent={updateComponent}
                  />
                );
              })
            ) : (
              <tr>
                <td className="p-5">There is No Monthly Reports</td>
              </tr>
            )}
          </Table.Body>
        </Table>
        <div className="card mt-4">
          <Paginator
            first={first}
            rows={rows}
            totalRecords={allReports.length}
            rowsPerPageOptions={[10, 20, 30]}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </>
  );
}
