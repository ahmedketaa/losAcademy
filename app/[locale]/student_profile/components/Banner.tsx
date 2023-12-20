import React, { useState } from "react";
import { Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";
import StudentPlanModal from "./StudentPlanModal";
function BannerComponent({
  message,
  animation,
  header,
  fromTeacherRequest,
}: any) {
  const [openPlansModal, setOpenPlansModal] = useState<boolean>(false);
  return (
    <div className="flex  justify-center items-center ">
      <Banner
        className={`ml-5  ${animation} hover:animate-none transition-all duration-300`}
      >
        <div className="flex sm:flex-col lg:flex-row   max-[400px]:flex-col  ml-5 w-[calc(100%-2rem)] mb-5  justify-between rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-600 dark:bg-gray-700 md:flex-row lg:max-w-7xl">
          <div
            className={`mb-3 mr-4 sm:flex-col lg:flex-row max-[400px]:flex-col flex md:gap-3 ${
              fromTeacherRequest ? "md:flex-col" : ""
            } items-start md:mb-0  md:items-center`}
          >
            <div className="mb-2 flex  items-center border-gray-200 dark:border-gray-600 md:mb-0 md:mr-4 md:border-r md:pr-4">
              <img src="logo.png" className="mr-2 h-6" alt="Flowbite Logo" />
              <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white md:pr-6">
                {header}
              </span>
            </div>
            <p className="flex items-center text-sm w-full font-normal text-gray-500 dark:text-gray-400">
              {message}
            </p>
          </div>
          {fromTeacherRequest ? (
            ""
          ) : (
            <div className="flex flex-shrink-0 items-center">
              <button
                onClick={() => setOpenPlansModal(true)}
                className="text-white px-3 sm:px-2 lg:px-3 lg:py-3 lg:text-md max-[400px]:px-2 sm:py-2 max-[400px]:py-2 sm:text-sm max-[400px]:text-sm py-3 rounded-xl bg-[--secondary-color] hover:bg-[#3f3aa6]"
              >
                Subscribe Now
              </button>
              <Banner.CollapseButton
                color="gray"
                className="border-0 bg-transparent text-gray-500 dark:text-gray-400"
              >
                <HiX className="h-4 w-4" />
              </Banner.CollapseButton>
            </div>
          )}
        </div>
        <StudentPlanModal
          openPlansModal={openPlansModal}
          setOpenPlansModal={setOpenPlansModal}
        />
      </Banner>
    </div>
  );
}

export default BannerComponent;
