"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "primereact/sidebar";
import { useState } from "react";
import { BiLogOut } from "react-icons/bi";
import { FiAlignLeft } from "react-icons/fi";
export default function ResponsiveAdminSideBar({
  logOut: logOut,
}: {
  logOut: () => void;
}) {
  const [visible, setVisible] = useState<boolean>(false);
  const pathName = usePathname();

  return (
    <div>
      <button
        onClick={() => setVisible(true)}
        className="text-secondary-color hover:text-blue-900 transition-colors fixed top-[100px] left-0 text-[30px] cursor-pointer hidden max-md:block"
      >
        <FiAlignLeft />
      </button>
      <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <ul className={"flex flex-col gap-3"}>
          <Link
            href="/admin"
            className={`sideBarLink  ${pathName === "/admin" ? " active" : ""}`}
          >
            <p>Dashboard</p>
          </Link>
          <Link
            href="/admin/teachers"
            className={`sideBarLink  ${
              pathName === "/admin/teachers" ? " active" : ""
            }`}
          >
            <p>Teachers</p>
          </Link>

          <Link
            href="/admin/students"
            className={`sideBarLink  ${
              pathName === "/admin/students" ? " active" : ""
            }`}
          >
            <p>Students</p>
          </Link>
          <Link
            href="/admin/material"
            className={`sideBarLink  ${
              pathName === "/admin/material" ? " active" : ""
            }`}
          >
            <p>Material</p>
          </Link>
          <Link
            href="/admin/transactions"
            className={`sideBarLink  ${
              pathName === "/admin/transactions" ? " active" : ""
            }`}
          >
            <p>Transactions</p>
          </Link>
          <Link
            href="/admin/sessions"
            className={`sideBarLink  ${
              pathName === "/admin/sessions" ? " active" : ""
            }`}
          >
            <p>Sessions</p>
          </Link>
          <Link
            href="/admin/ongoing"
            className={`sideBarLink  ${
              pathName === "/admin/ongoing" ? " active" : ""
            }`}
          >
            <p>Ongoing Sessions</p>
          </Link>
          <Link
            href="/admin/plans"
            className={`sideBarLink  ${
              pathName === "/admin/plans" ? " active" : ""
            }`}
          >
            <p>Plans</p>
          </Link>

          <Link
            href="/admin/courses"
            className={`sideBarLink  ${
              pathName === "/admin/courses" ? " active" : ""
            }`}
          >
            <p>Courses</p>
          </Link>
          <Link
            href="/admin/monthly-report"
            className={`sideBarLink  ${
              pathName === "/admin/monthly-report" ? " active" : ""
            }`}
          >
            <p>Monthly Reports</p>
          </Link>
          <button
            onClick={logOut}
            className="text-red-500 flex items-center justify-center gap-1 cursor-pointer"
          >
            <p>LogOut</p>
            <BiLogOut />
          </button>
        </ul>
      </Sidebar>
    </div>
  );
}
