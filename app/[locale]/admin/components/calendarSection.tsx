"use client";

import {Calendar} from "primereact/calendar";
export default function CalendarSection() {

    return(
        <div className="p-0 m-auto">
                  <Calendar
                    style={{
                      outline: "4px solid var(--secondary-color)",
                      borderRadius: "16px"
                  }}
                  inline
                  selectionMode="multiple"
                />
        </div>
    )
}