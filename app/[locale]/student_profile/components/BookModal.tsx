"use client";

import { Button, Modal } from "flowbite-react";
import { useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Nullable } from "primereact/ts-helpers";
import { Toast } from "primereact/toast";
import BookFreeSession from "./BookFreeSession";
import BookPaidSession from "./BookPaidSession";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import PrimaryButton from "../../components/PrimaryButton";

export default function BookModal({ myInfo }: any) {
  const [openBookModal, setOpenBookModal] = useState(false);
  const [freedatetime12h, setFreeDateTime12h] = useState<Nullable<Date>>(null);

  const toast = useRef<Toast>(null);

  const customeTheme: CustomFlowbiteTheme = {
    tab: {
      tablist: {
        base: "flex  items-center  w-fit  ",
        tabitem: {
          styles: {
            pills: {
              active: {
                on: " bg-white focus:ring-0 text-black w-fit   border-b-2 border-[#6D67E4]	",
                off: "   focus:ring-0  hover:bg-white hover:text-black    hover:border-[#6D67E4] 	 transition-colors",
              },
            },
          },
        },
      },
    },
  };

  return (
    <>
      <button
        className="bg-secondary-color hover:bg-secondary-hover text-md w-[150px] font-semibold transition-colors text-white  h-10  px-8 m-auto my-3 shadow rounded-full  mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"
        onClick={() => setOpenBookModal(true)}
        disabled={myInfo?.sessionPlaced}
      >
        {myInfo?.sessionPlaced ? `Can't Book Untill Your Plan End` : "Book"}
      </button>
      <Modal
        show={openBookModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"xl"}
        onClose={() => setOpenBookModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>

        <Modal.Body>
          <div>
            <h3 className="font-semibold text-lg mb-3">Book Sessions</h3>
            <div className="taps flex justify-center h-1/2">
              <Tabs.Group
                aria-label="Pills"
                theme={customeTheme.tab}
                style="pills"
              >
                <Tabs.Item active title="Paid Session">
                  <BookPaidSession setOpenBookModal={setOpenBookModal} />
                </Tabs.Item>
                <Tabs.Item active title="Free Session">
                  <BookFreeSession setOpenBookModal={setOpenBookModal} />
                </Tabs.Item>
              </Tabs.Group>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
