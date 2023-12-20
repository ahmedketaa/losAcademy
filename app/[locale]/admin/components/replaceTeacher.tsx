"use client"

import { Label, Select } from "flowbite-react"
import { useEffect, useRef, useState } from "react"
import LoadingButton from "./loadingButton"
import Cookies from "universal-cookie"
import { Toast } from "primereact/toast"
import { useRouter } from "next/navigation"
import { getAllStudents } from "@/utilities/getAllStudents"

export default function replaceTeacher() {
    const [isProcessing, setIsProcessing] = useState(false)
    const cookies = new Cookies()
    const [oldTeacher, setOldTeacher] = useState<any>('')
    const [newTeacher, setNewTeacher] = useState<any>('')
    const [student, setStudent] = useState<any>('')
    const [allTeacher, setAllTeacher] = useState([])
    // const [allStudent, setAllStudent] = useState([])
    const allStudents = getAllStudents(cookies.get('token'))
    const router = useRouter()
    const toast = useRef<Toast>(null);
    
    const showSuccess = (msg: string) => {
        toast.current?.show({severity:'success', summary: 'Success', detail: msg, life: 5000});
    }

    const showError = (msg: string) => {
        toast.current?.show({severity:'error', summary: 'Error', detail: msg, life: 5000});
    }
    const getTeachers = () => {
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/teacher`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
        }).then(response => response.json()).then(data => {
            console.log(data)
            setAllTeacher(data.data);
        }).catch(err => console.log(err))
    }

    // const getStudents = () => {
    //     fetch(`${process.env.NEXT_PUBLIC_APIURL}/user`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${cookies.get("token")}`
    //         },
    //     }).then(response => response.json()).then(data => {
    //         console.log(data)
    //         setAllStudent(data.data);
    //     }).catch(err => console.log(err))
    // }
    const replaceTeacherAction = () => {
        if(!oldTeacher || !student || !newTeacher) {
            return showError("Please choose teacher and student")
        }

        setIsProcessing(true)
        fetch(`${process.env.NEXT_PUBLIC_APIURL}/session/replaceTeacher`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${cookies.get("token")}`
            },
            body: JSON.stringify({
                oldTeacherId: oldTeacher,
                newTeacherId: newTeacher,
                    userId: student,
            })
        }).then(response => response.json()).then(data => {
            console.log(data)
            if(data.status === 'success') {
                showSuccess(data.message)
                const timer = setTimeout(() => {
                    router.refresh()
                    clearTimeout(timer)
                }, 4000)
            } else {
                showError(data.message)
            }
            setIsProcessing(false)
        }).catch(err => {
            console.log(err)
            showError(err)
            setIsProcessing(false)
        })
    }

    useEffect(() => {
        getTeachers()
    }, [])

  return (
    <div className="w-full my-5">
        <h3 className={"adminBoxTitle responsiveText"}>Replace Teacher</h3>
        <Toast ref={toast} />
        <div className={"adminBox mt-4 flex flex-col w-[390px] mx-auto"}>
           <div className="block mb-2">
            <Label>
                choose Old Teacher:
            </Label>
           </div>
            <Select className="w-full" onChange={(e) => setOldTeacher(e.target.value)}>
                <option value="">Select Old Teacher</option>
               {allTeacher.map((teacher: any) => (
                   <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
               ))}
            </Select>
           <div className="block mb-2">
            <Label>
                choose New Teacher:
            </Label>
           </div>
            <Select className="w-full" onChange={(e) => setNewTeacher(e.target.value)}>
                <option value="">Select New Teacher</option>
               {allTeacher.map((teacher: any) => (
                   <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
               ))}
            </Select>
           <div className="block mb-2">
            <Label>
                choose Student:
            </Label>
            </div>
            <Select className="w-full mb-3" onChange={(e) => setStudent(e.target.value)} >
                <option value="1">Select Student</option>
                {allStudents && allStudents.map((student: any) => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                ))}
            </Select>
            <LoadingButton 
                title="Replace"
                isProcessing={isProcessing}
                customStyle="text-white bg-secondary-color hover:bg-secondary-hover rounded-full py-1 px-5 mt-3transition-colors"
                action={replaceTeacherAction}
            />
        </div>
    </div>
  )
}
