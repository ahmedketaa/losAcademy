"use client";

import { Dropdown, Tooltip } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiCalendar } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { SiSessionize } from "react-icons/si";
import {
  LiaCreditCardSolid,
  LiaEditSolid,
  LiaUserEditSolid,
} from "react-icons/lia";
import Cookies from "universal-cookie";
import UserFeedBack from "../../student_profile/components/userFeedBack";
import StudentPlanModal from "../../student_profile/components/StudentPlanModal";
import Subscribtion from "../../student_profile/components/Subscribtion";
import EditProfile from "../../student_profile/components/edit_profile";
import SessionsModal from "../../student_profile/components/sessionsModal";
import { FaUser } from "react-icons/fa";

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  id: number;
  gender: string;
  age?: number; // make age optional if it may not be present in the API response
}
export default function UserDropDown({
  userName,
  logOut,
}: {
  userName: string;
  logOut: () => void;
}) {
  const [userFeedbackModal, setUserFeedbackModal] = useState<boolean>(false);
  const [openSubscribtionModal, setOpenSubscribtionModal] =
    useState<boolean>(false);
  const [openSeesionModal, setOpenSeesionModal] = useState<boolean>(false);
  const [openPlansModal, setOpenPlansModal] = useState<boolean>(false);
  const [myInfo, setMyInfo] = useState<UserInfo | undefined>();
  const [openEditeProfileModal, setOpenEditeProfileModal] =
    useState<boolean>(false);
  const cookies = new Cookies();

  return (
    <div className="flex flex-row max-md:items-end md:items-center justify-center gap-2">
      <Link
        href={"/student_profile"}
        className={
          "bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-2.5 px-12 rounded-full rtl:lg:p-[12px] rtl:w-[130px] hidden md:flex text-center"
        }
      >
        {userName}'s Profile
      </Link>
      <div className="mt-2 md:hidden">
        <Link href={"/student_profile"}>
          <Tooltip content={`${userName}'s Profile`} style="light">
            <FaUser
              className={
                "text-secondary-color hover:text-secondary-hover transition-colors text-2xl"
              }
              style={{ filter: "drop-shadow(1px 1px 2px #000000)" }}
            />
          </Tooltip>
        </Link>
      </div>
      <Dropdown label={""} inline>
        <Dropdown.Item
          onClick={() => setOpenEditeProfileModal(true)}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <LiaUserEditSolid className="text-[26px] font-semibold" />
          <span>Edit Profile</span>
        </Dropdown.Item>

        <Dropdown.Item
          onClick={() => setOpenSeesionModal(true)}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <SiSessionize className="text-[26px] font-semibold" />
          <span className="py-2">Sessions</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setOpenPlansModal(true)}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <CiCalendar className="text-[26px] font-semibold" />
          <span className="py-2">Plans</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setOpenSubscribtionModal(true)}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <LiaCreditCardSolid className="text-[26px] font-semibold" />
          <span className="py-2">My Subscription</span>
        </Dropdown.Item>
        <Dropdown.Item
          onClick={() => setUserFeedbackModal(true)}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <LiaEditSolid className="text-[26px] font-semibold" />
          <span className="py-2">Add Feedback</span>
        </Dropdown.Item>
        <hr />
        <Dropdown.Item
          onClick={logOut}
          className="gap-3 rtl:flex-row-reverse ltr:flex-row"
        >
          <IoIosLogOut className="text-[26px] text-danger-color font-semibold" />
          <span className="py-2">logout</span>
        </Dropdown.Item>
      </Dropdown>
      <UserFeedBack
        setUserFeedbackModal={setUserFeedbackModal}
        userFeedbackModal={userFeedbackModal}
      />
      <Subscribtion
        setOpenSubscribtionModal={setOpenSubscribtionModal}
        openSubscribtionModal={openSubscribtionModal}
      />
      <SessionsModal
        setOpenSeesionModal={setOpenSeesionModal}
        openSeesionModal={openSeesionModal}
      />
      <EditProfile
        setMyInfo={setMyInfo}
        setOpenEditeProfileModal={setOpenEditeProfileModal}
        openEditeProfileModal={openEditeProfileModal}
      />
      <StudentPlanModal
        openPlansModal={openPlansModal}
        setOpenPlansModal={setOpenPlansModal}
      />
    </div>
  );
}
