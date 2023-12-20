'use client';

import {CustomFlowbiteTheme, Sidebar} from 'flowbite-react';
import Link from 'next/link';
import {usePathname, useRouter} from "next/navigation";
import {BiLogOut} from 'react-icons/bi';
import { FiAlignLeft } from "react-icons/fi";
import Cookies from 'universal-cookie';
import ResponsiveSideBar from '../../components/responsiveSideBar';
export default function OurSideBar() {
    const pathName = usePathname();
    const cookies = new Cookies();
    const router = useRouter();
    const customTheme: CustomFlowbiteTheme['sidebar'] = {
        root: {
            inner: "h-full overflow-y-auto overflow-x-hidden rounded py-4 px-3 bg-white",
        },
        item: {
            base: "flex items-center justify-center rounded-[1.5rem] px-[1rem] py-[0.8rem] text-base font-medium text-black-color-one hover:text-white hover:bg-secondary-color",
            active: "bg-secondary-color text-white shadow-2xl",
        },
    }

    const logOut = async () => {
        const token = await cookies.get('token')
        const id = await cookies.get('id')
        
        if(token && id) {
            cookies.remove('token', { path: '/', });
            cookies.remove('id', { path: '/', });
            router.replace('/los_auth');
        }  else {
            console.error('Error removing cookies');
        } 
    }

    return (
        <>
        <Sidebar aria-label="Default sidebar example" theme={customTheme} className={"w-[14rem] pt-[70px] max-md:hidden"}>
            <Sidebar.Items>
                <Sidebar.ItemGroup className={"text-center"}>
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
                    <Sidebar.Item
                        onClick={logOut}
                    >
                        <div className="text-red-500 flex items-center justify-center gap-1 cursor-pointer">
                        <p>
                            LogOut
                        </p>
                            <BiLogOut />
                        </div>
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
        <div>
            <ResponsiveSideBar logOut={logOut}/>
        </div>
    </>
    )
}