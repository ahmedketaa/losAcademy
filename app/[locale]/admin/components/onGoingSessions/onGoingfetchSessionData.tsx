"use client"

import {Table} from 'flowbite-react';
import moment from 'moment-timezone';
import Link from 'next/link';

export default function FetchOnGoingSessionData({sessionData, updateComponent} : {sessionData: any; updateComponent: () => void}) {
    
    const session = sessionData && sessionData;

    const convertDate = (inputTime: moment.MomentInput, inputTimezone: string, outputTimezone: string, ourFormat: string) => {
        const convertedTime = moment(inputTime)
          .tz(inputTimezone)
          .clone()
          .tz(outputTimezone);
        return convertedTime.format(ourFormat);
      };

  return (

    <Table.Row key={session.id} className="bg-white dark:border-gray-700 dark:bg-gray-800 text-center">
            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {session.id}
            </Table.Cell>
            <Table.Cell>
                {session.SessionInfo.teacher.name}
            </Table.Cell>
            <Table.Cell>
                {session.SessionInfo.user.name}
            </Table.Cell>
            <Table.Cell>
                {convertDate(session.sessionDate, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "MMM D,YYYY")}
            </Table.Cell>
            <Table.Cell>
                {convertDate(session.sessionDate, "UTC", Intl.DateTimeFormat().resolvedOptions().timeZone, "h:mm A")}
            </Table.Cell>
            <Table.Cell>
                {session.type}
            </Table.Cell>
            <Table.Cell>
            {
                session.status === 'ongoing' 
                    ? 
                    <p className="bg-secondary-color text-white px-2 py-1 rounded-full font-semibold">Ongoing</p> 
                    :
                    <p className="bg-warning-color text-white px-2 py-1 rounded-full font-semibold">Pending</p> 
            }
            <Link href={session.meetingLink === null ? '#' : session.meetingLink} className="hover:underline">meeting link </Link>
            </Table.Cell>
        </Table.Row>
  )
}
