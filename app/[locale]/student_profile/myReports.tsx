import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Cookies from "universal-cookie";
import moment from "moment-timezone";
import jsPDF from "jspdf";
import ReportModal from "../teacher/components/reportModal";
import ReportData from "../teacher/components/reportData";
import ContentLoader from "react-content-loader";
import Image from "next/image";

function MyReports() {
  const [myReports, setMyReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setselectedReport]: any = useState(false);

  const handleOpen = () => {
    setselectedReport(true);
  };

  const handleCloseModal = () => {
    setselectedReport(false);
  };

  const url = process.env.NEXT_PUBLIC_APIURL;
  const cookie = new Cookies();
  const token = cookie.get("token");

  const convertDateTimeZone = (
    inputTime: moment.MomentInput,
    inputTimezone: string,
    outputTimezone: string,
    ourFormat: string
  ) => {
    const convertedTime = moment(inputTime)
      .tz(inputTimezone)
      .clone()
      .tz(outputTimezone);
    return convertedTime.format(ourFormat);
  };

  const downloadPdf = async (reportId: any) => {
    const pdf = new jsPDF("p", "pt", "a4");
    const element = document.getElementById(`report-${reportId}`);

    if (element) {
      // Use try-catch to handle errors during pdf.html()
      try {
        await pdf.html(element);
        pdf.save(`Report_${reportId}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  useEffect(() => {
    // Fetch reports when the component mounts
    fetch(`${url}/user/myReports`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log(data.data);
        // Set the retrieved reports in the state
        setMyReports(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full px-2 gap-2 scrolAction ">
      {loading ? (
        // Display loading indicator while fetching data
        <>
          <p className=" overflow-hidden  mb-3 rounded-xl bg-white-color">
            <ContentLoader
              speed={2}
              width={400}
              height={100}
              viewBox="0 0 400 100"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="232" y="-10" rx="3" ry="3" width="152" height="10" />
              <rect x="246" y="23" rx="11" ry="11" width="78" height="26" />
              <rect x="209" y="102" rx="3" ry="3" width="113" height="10" />
              <rect x="88" y="30" rx="3" ry="3" width="139" height="10" />
              <rect x="25" y="25" rx="0" ry="0" width="19" height="26" />
            </ContentLoader>
          </p>{" "}
          <p className="p-2 rounded-xl bg-white-color">
            <ContentLoader
              speed={2}
              width={400}
              height={100}
              viewBox="0 0 400 100"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="232" y="-10" rx="3" ry="3" width="152" height="10" />
              <rect x="246" y="23" rx="11" ry="11" width="78" height="26" />
              <rect x="209" y="102" rx="3" ry="3" width="113" height="10" />
              <rect x="88" y="30" rx="3" ry="3" width="139" height="10" />
              <rect x="25" y="25" rx="0" ry="0" width="19" height="26" />
            </ContentLoader>
          </p>
        </>
      ) : myReports.length > 0 ? (
        // Display reports if there are any
        myReports.map((report, index) => (
          <ReportData data={report} key={index} visibleEdit={false} />
        ))
      ) : (
        // Display "No reports" message if there are no reports
        <div className="flex flex-col gap-3 items-center">
        <p className="text-center">No reports</p>
        <Image src={'/vectors/no_report.png'} width={90} height={80} alt="no reports"/>
        </div>
      )}
      <ReportModal
        openAssignModal={selectedReport}
        handleCloseModal={handleCloseModal}
        details={myReports}
      />
    </div>
  );
}

export default MyReports;
