"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { RiUserSharedFill } from "react-icons/ri";

export default function LoginButton() {
    const t = useTranslations("CustomNavbar");
    const linkStyle = "bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-2.5 px-12 rounded-full rtl:lg:p-[15px]";
    const linkText = t("login-btn");
    
    return(
        <div className="flex flex-col items-center">
            <Link href={"/login"} className={linkStyle + " hidden md:flex"}>
                {linkText}
            </Link>
            <div className="mt-2 md:hidden">
                <Link href={"/login"}>
                    <RiUserSharedFill className={"text-secondary-color hover:text-secondary-hover transition-colors text-2xl"}/>
                </Link>
            </div>
        </div>
    )
}