"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar } from 'primereact/sidebar';
import { useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { FiAlignLeft } from "react-icons/fi";
export default function ResponsiveSideBar({logOut: logOut}: {logOut: () => void}) {
    const [visible, setVisible] = useState<boolean>(false);
    const pathName = usePathname();
    
  return (
    <div>
        <button 
            onClick={() => setVisible(true)} 
            className="text-secondary-color hover:text-blue-900 transition-colors fixed top-[100px] left-0 text-[30px] cursor-pointer hidden max-md:block"
            ><FiAlignLeft /></button>
        <Sidebar visible={visible} onHide={() => setVisible(false)}>
        <ul className={"flex flex-col gap-3"}>
                    <Link href="/teacher" className={`sideBarLink  ${pathName === "/teacher" ? " active" : ""}`}>
                        <p>
                            Dashboard
                        </p>
                    </Link>
                    <Link href="/teacher/students" className={`sideBarLink  ${pathName === "/teacher/students" ? " active" : ""}`}>
                        <p>
                            Students
                        </p>
                    </Link>
                    <Link href="/teacher/sessions" className={`sideBarLink  ${pathName === "/teacher/sessions" ? " active" : ""}`}>
                        <p>
                            Sessions
                        </p>
                    </Link>
                    <Link href="/teacher/material" className={`sideBarLink  ${pathName === "/teacher/material" ? " active" : ""}`}>
                        <p>
                            Material
                        </p>
                    </Link>

                    <Link href="/teacher/transactions" className={`sideBarLink  ${pathName === "/teacher/transactions" ? " active" : ""}`}>
                        <p>
                            Transactions
                        </p>
                    </Link>
                    <Link href="/teacher/monthly-report" className={`sideBarLink  ${pathName === "/teacher/monthly-report" ? " active" : ""}`}>
                        <p>
                            Monthly Reports
                        </p>
                    </Link>
                    <button
                        onClick={logOut}
                        className="text-red-500 flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <p>
                            LogOut
                        </p>
                            <BiLogOut />
                    </button>
                </ul>
        </Sidebar>
    </div>
  )
}
