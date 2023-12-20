"use client"

import Image from "next/image";
import {CustomFlowbiteTheme, Dropdown, Navbar} from "flowbite-react";
import Link from "next/link";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { useTranslations } from "next-intl";
import { LiaCreditCardSolid, LiaEditSolid, LiaUserEditSolid } from "react-icons/lia";
import { CiCalendar } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { RiUserSharedFill } from "react-icons/ri";
import { useRouter } from "next/navigation";


export default function StudentNavBar() {

    const cookies = new Cookies();
    const token = cookies.get('token')
    const [data, setData] = useState<null | any>(null)
    const [handleModal, setHandleModal] = useState(false)
    const router = useRouter() 
    const t = useTranslations("CustomNavbar");
    const linkStyle = "bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-2.5 px-12 rounded-full rtl:lg:p-[15px]";
    const linkText = t("login-btn");
    const [userDate, setUserData] = useState<any>({});
  
    const customNavTheme: CustomFlowbiteTheme["navbar"] = {
      root: {
        inner: {
          base: "flex flex-row justify-around max-lg:justify-between flex-wrap items-center px-2 max-md:px-5 max-sm:px-2 max-md:px-3",
          fluid: {
            off: "",
            on: ""
          }
        },
      },
      collapse: {
          base: "w-full lg:block lg:w-auto rtl:xl:block",
          list: "mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-sm lg:font-medium gap-1 rtl:lg:space-x-3 rtl:gap-0",
          hidden: {
            on: "hidden",
            off: ""
      }
    },
      toggle: {
        base: "inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden rtl:xl:hidden rtl:mr-1",
        icon: "h-6 w-6 shrink-0",
      },
      link: {
        active: {
          on: "text-secondary-color underline text-base rtl:font-semibold",
          off: "text-base text-primary-color hover:text-secondary-color rtl:font-semibold hover:underline transition-colors",
        },
      },
    };
    const handleOpenModal = () => {
        setHandleModal(true)
    }

    const handleCloseModal = () => {
        setHandleModal(false)
    }
    const getCurrentAdminData = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/user/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            setData(data.data)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        getCurrentAdminData();
    }, []);

    const logOut = async () => {

        const token = await cookies.get('token')
        const id = await cookies.get('id')
        
        if(token && id) {
            
            cookies.remove('token', { path: '/', });
            cookies.remove('id', { path: '/', });
            router.replace('/login');
        
        }  else {
            console.error('Error removing cookies');
        } 
    }

    return(
        <Navbar rounded={true} theme={customNavTheme.root} className="fixed w-full top-0 z-10 border-b-2 border-white-color">
        <Navbar.Brand href="/" className="flex flex-row flex-wrap justify-center gap-3 rtl:flex-row-reverse">
          <Image
            src={"/logo.png"}
            alt="logo image"
            width={30}
            height={30}
            priority={true}
            loading={"eager"}
            className={"w-auto h-auto max-md:w-[30px]"}
          />
          <h2
              className={"font-semibold"}
              style={{
                fontSize: "calc(16px + (24 - 16) * ((100vw - 320px) / (1920 - 320))"
              }}
          >LOS Academy</h2>
        </Navbar.Brand>

        <Navbar.Collapse className="rtl:font-sans rtl:text-lg" theme={customNavTheme.collapse}>
          <Navbar.Link
            theme={customNavTheme.link}
            href="/#hero"
            active={true}
            className="rtl:ml-5"
          >
            {t("home-link")}
          </Navbar.Link>
          <Navbar.Link href="/#aboutUs" theme={customNavTheme.link}>
            {t("about-link")}
          </Navbar.Link>
          <Navbar.Link href="/#courses" theme={customNavTheme.link}>
            {t("courses-link")}
          </Navbar.Link>
          <Navbar.Link href="/#prices" theme={customNavTheme.link}>
            {t("prices-link")}
          </Navbar.Link>
          <Navbar.Link href="/#feedback" theme={customNavTheme.link}>
            {t("feedback-link")}
          </Navbar.Link>
          <Navbar.Link href="/#contactus" theme={customNavTheme.link}>
            {t("contact-link")}
          </Navbar.Link>
        </Navbar.Collapse>
        <div className={
          "flex items-center max-md:items-baseline gap-2 rtl:font-sans rtl:text-lg rtl:max-sm:me-0 rtl:max-sm:ms-auto rtl:lg:w-[185px]"
          }>
          <Navbar.Toggle theme={customNavTheme.toggle} />
          {userDate && userDate.name
            ? 
              (<>
                <Dropdown label={
                    <div className="bg-secondary-color hover:bg-secondary-hover rounded-full px-3 py-2 text-white font-semibold transition-colors cursor-pointer">
                        {userDate && userDate.name}
                    </div>} inline>
                    <Dropdown.Item className="gap-3 rtl:flex-row-reverse ltr:flex-row">
                      <LiaUserEditSolid className="text-[26px] font-semibold" /> 
                      <span>Edit Profile</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="gap-3 rtl:flex-row-reverse ltr:flex-row">
                      <LiaEditSolid  className="text-[26px] font-semibold" /> 
                      <span>Add Feedback</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="gap-3 rtl:flex-row-reverse ltr:flex-row">
                    <CiCalendar  className="text-[26px] font-semibold" /> 
                    <span>Sessions</span>
                    </Dropdown.Item>
                    <Dropdown.Item className="gap-3 rtl:flex-row-reverse ltr:flex-row">
                      <LiaCreditCardSolid  className="text-[26px] font-semibold" /> 
                      <span>Subscription</span>
                    </Dropdown.Item>
                    <hr />
                    <Dropdown.Item 
                        onClick={logOut}
                        className="gap-3 rtl:flex-row-reverse ltr:flex-row">
                        <IoIosLogOut className="text-[26px] text-danger-color font-semibold" /> 
                        <span>logout</span>
                    </Dropdown.Item>
                </Dropdown>
              </>) 
            : 
              (
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
          <Dropdown label={<MdLanguage className="w-5 h-5" />} inline>
            <Link locale="en" href={"/"}>
              <Dropdown.Item className="rtl:flex-row-reverse ltr:flex-row">
                en
              </Dropdown.Item>
            </Link>
            <Link locale="ar" href={"/"}>
              <Dropdown.Item className="rtl:flex-row-reverse ltr:flex-row">
                ar
              </Dropdown.Item>
            </Link>
          </Dropdown>
        </div>
      </Navbar>
    )
}