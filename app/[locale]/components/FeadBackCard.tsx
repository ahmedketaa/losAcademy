"use client";

import { Card } from 'flowbite-react';
import Image from 'next/image';

function FeadBackCard({username, country, comment}: {username: string; country: string; comment: string}) {

  return (
    <Card className="w-64 max-md:w-1/3 max-sm:w-auto rounded-3xl">
      <div className="flex flex-col items-start pb-2">
        <Image src="/vectors/feedback1.svg" alt="avatar" width={50} height={50} loading="lazy" className={"w-[50px] h-auto"}/>
        <h6 className="mb-1 font-medium text-gray-900 h-[50px]" style={{
            fontSize: "calc(16px + (24 - 16) * ((100vw - 320px) / (1920 - 320))"
        }}>
            {username}
        </h6>
        <span className="text-sm text-gray-500 h-[30px] ">
            {country}
        </span>
      </div>
      <div>
        <p className={"h-[160px] max-sm:h-auto"}>
          {comment}
        </p>
      </div>
    </Card>
  )
}

export default FeadBackCard;