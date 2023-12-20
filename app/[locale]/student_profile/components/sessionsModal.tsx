"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { CustomFlowbiteTheme, Tabs } from "flowbite-react";
import RemainSessions from "./RemainSessions";
import HistorySessions from "./historySessions";
import SessionsRequest from "./sessionsRequest";
import RescheduleRequests from "./rescheduleRequests";
import TeacherUbsent from "./teacherUbsent";

export default function SessionsModal({
  setOpenSeesionModal,
  openSeesionModal,
}: any) {
  const customeTheme: CustomFlowbiteTheme = {
    tab: {
      tablist: {
        base: "flex flex-nowrap items-center justify-center  w-fit  ",
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
      {/* <Button onClick={() => setOpenSeesionModal(true)}>
        Toggle Sessions modal
      </Button> */}
      <Modal
        show={openSeesionModal}
        className="block space-y-0 md:flex md:space-y-0 md:space-x-4 "
        size={"4xl"}
        onClose={() => setOpenSeesionModal(false)}
      >
        <Modal.Header className="p-0 m-0 border-0"></Modal.Header>

        <Modal.Body>
          <div>
            <h3 className="font-semibold text-lg mb-3">Sessions</h3>
            <div className="taps">
              <Tabs.Group
                aria-label="Pills"
                theme={customeTheme.tab}
                style="pills"
              >
                <Tabs.Item active title="Pending">
                  <RemainSessions />
                </Tabs.Item>
                <Tabs.Item title="History">
                  <HistorySessions />
                </Tabs.Item>
                <Tabs.Item title="Sessions Requests">
                  <SessionsRequest />
                </Tabs.Item>
                <Tabs.Item title="Rescheduling Requests">
                  <RescheduleRequests />
                </Tabs.Item>
                <Tabs.Item title="Teacher Absent Sessions">
                  <TeacherUbsent />
                </Tabs.Item>
              </Tabs.Group>
            </div>
            <div className="flex justify-center items-center">
              <button
                onClick={() => setOpenSeesionModal(false)}
                className="bg-secondary-color  hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-3 px-10  rounded-full w-50 mx-auto max-md:py-2.5 max-md:px-10 max-md:w-45"
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
