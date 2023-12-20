"use client";

import { CustomFlowbiteTheme, Sidebar } from "flowbite-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
import Cookies from "universal-cookie";
import ResponsiveAdminSideBar from "./responsiveAdminSideBar";
export default function OurSideBar() {
  const pathName = usePathname();
  const cookies = new Cookies();
  const router = useRouter();

  const customTheme: CustomFlowbiteTheme["sidebar"] = {
    root: {
      inner:
        "h-full overflow-y-auto overflow-x-hidden rounded py-4 px-3 bg-white",
    },
    item: {
      base: "flex items-center justify-center rounded-[1.5rem] px-[1rem] py-[0.8rem] text-base font-medium text-black-color-one hover:text-white hover:bg-secondary-color",
      active: "bg-secondary-color text-white shadow-2xl",
    },
  };

  const logOut = async () => {
    const token = await cookies.get("token");
    const id = await cookies.get("id");

    if (token && id) {
      cookies.remove("token", { path: "/" });
      cookies.remove("id", { path: "/" });
      router.replace("/los_auth");
    } else {
      console.error("Error removing cookies");
    }
  };

  return (
    <>
      <Sidebar
        aria-label="Default sidebar example"
        theme={customTheme}
        className={"w-[14rem] pt-[70px] max-md:hidden"}
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup className={"text-center"}>
            <Link
              href="/admin"
              className={`sideBarLink  ${
                pathName === "/admin" ? " active" : ""
              }`}
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
            <Sidebar.Item onClick={logOut}>
              <div className="text-red-500 flex items-center justify-center gap-1 cursor-pointer">
                <p>LogOut</p>
                <BiLogOut />
              </div>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
      <div>
        <ResponsiveAdminSideBar logOut={logOut} />
      </div>
    </>
  );
}
