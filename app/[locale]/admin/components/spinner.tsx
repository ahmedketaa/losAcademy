"use client"
import { Skeleton } from 'primereact/skeleton';
export default function OurSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-3 w-full px-5">
            <Skeleton width="100%" height="100px"></Skeleton>
            <Skeleton width="100%" className="mb-2"></Skeleton>
            <Skeleton width="100%" className="mb-2"></Skeleton>
            <Skeleton width="100%" className="mb-2"></Skeleton>
        </div>
    )
}