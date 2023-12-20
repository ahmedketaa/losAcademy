"use client"

import {Table} from 'flowbite-react';
import {LiaPhoneSolid} from "react-icons/lia";
import {GoMail} from "react-icons/go";
import {BsTrash} from "react-icons/bs";
import { BiSolidEditAlt } from 'react-icons/bi';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';



export default function FetchStudentData({studentData, updateComponent} : {studentData: any; updateComponent: () => void}) {
    const student = studentData

  return (

    <Table.Row key={student.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {student.id.slice(-4)}
            </Table.Cell>
            <Table.Cell>
                {student.name}
            </Table.Cell>
            <Table.Cell>
                {student.gender}
            </Table.Cell> 
            <Table.Cell>
                {student.age}
            </Table.Cell>
            <Table.Cell>
                {student.availableFreeSession}
            </Table.Cell>
            <Table.Cell>
            {student.remainSessions}
            </Table.Cell>
        </Table.Row>
  )
}
