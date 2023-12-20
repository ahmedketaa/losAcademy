"use client"
import {CustomFlowbiteTheme, Dropdown} from "flowbite-react";
import { useState } from "react";
import AddMatrialModal from "./addMatrialModal";

export default function MatrialComboBox({...props}: any) {
    const [handleModal, setHandleModal] = useState(false)

    const openModal = () => {
        setHandleModal(true)
    }
    const closeModal = () => {
        setHandleModal(false)
    }

    const customTheme: CustomFlowbiteTheme['dropdown'] = {
        inlineWrapper: "bg-white text-black-color-one px-5 py-2 flex items-center rounded-[16px] font-normal"
    }

    return(
        <section className={"px-5"}>
            <div className={"flex flex-row w-full justify-between items-center bg-white-color p-5 rounded-[16px] flex-wrap"}>
                <form>
                    <input className={
                        "border-0 rounded-[16px] w-[420px] max-md:w-full focus:border-[2px] border-secondary-color transition-all"
                    } type={"search"} placeholder={"search"} />
                </form>
            </div>
        </section>
    )
}