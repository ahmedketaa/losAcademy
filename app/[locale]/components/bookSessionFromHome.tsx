"use client";

import { Button, Modal } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import { Nullable } from "primereact/ts-helpers";
import { Toast } from "primereact/toast";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import BookFreeSession from "../student_profile/components/BookFreeSession";
import BookPaidSession from "../student_profile/components/BookPaidSession";

export default function BookSessionFromHome({openModal, closeModal}: {openModal: boolean, closeModal: () => void}) {
    const [openBookModal, setOpenBookModal] = useState(false);
//   const [freedatetime12h, setFreeDateTime12h] = useState<Nullable<Date>>(null);
    const modalRef = useRef<HTMLDivElement>(null);

  const toast = useRef<Toast>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | any) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (openModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openModal, closeModal]);

  if (!openModal) {
    return null;
  }


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
      <Modal
        ref={modalRef}
        show={openModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"xl"}
        onClose={closeModal}
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
