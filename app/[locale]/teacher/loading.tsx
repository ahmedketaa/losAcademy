import OurSkeleton from "./components/skeletonLoading";

export default function Loading() {

    return (
        <div className="ps-[255px] pt-[7rem] flex justify-between gap-5 flex-wrap max-md:justify-between max-md:items-center">
            <div className="text-center w-full flex justify-center items-center m-auto">
                <OurSkeleton />
            </div>
        </div>
    )
  }