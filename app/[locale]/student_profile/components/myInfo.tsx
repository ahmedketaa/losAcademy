import Image from "next/image";
import React, { useEffect, useState } from "react";
import ContentLoader from "react-content-loader";

function MyInfo({ myInfo }: any) {
  const [loading, setloading] = useState<boolean>(true);

  useEffect(() => {
    if (myInfo) {
      setloading(false);
    }
  }, [myInfo]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center max-md:mr-20  md:mr-20">
          <ContentLoader
            speed={2}
            width={300}
            height={170}
            viewBox="0 0 400 170"
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
          >
            <circle cx="248" cy="59" r="49" />
            <circle cx="263" cy="66" r="8" />
            <rect x="175" y="120" rx="0" ry="0" width="156" height="8" />
            <rect x="204" y="137" rx="0" ry="0" width="100" height="8" />
            <rect x="248" y="128" rx="0" ry="0" width="0" height="1" />
            <rect x="247" y="126" rx="0" ry="0" width="1" height="8" />
            <rect x="252" y="166" rx="0" ry="0" width="1" height="0" />
          </ContentLoader>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col  justify-center items-center gap-5 w-fit">
        <div className="rounded-full  bg-[#EBF6FE]  flex justify-center items-end">
          <Image
            className="rounded-full  bg-[#EBF6FE]"
            src={
              myInfo?.gender === "male"
                ? "/vectors/boy.png"
                : "/vectors/girl.png"
            }
            width={60}
            height={60}
            alt="profile photo"
          />
        </div>
        <h2 className="p-0 m-0 font-bold text-lg">
          {myInfo?.name || "My Name"}{" "}
        </h2>
      </div>
    </>
  );
}

export default MyInfo;
