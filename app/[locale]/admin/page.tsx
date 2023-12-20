import Statistics from "@/app/[locale]/admin/components/statistics";
import Attendance from "@/app/[locale]/admin/components/attendance";
import OnGoingBox from "@/app/[locale]/admin/components/onGoingBox";
import TeacherSchedule from "@/app/[locale]/admin/components/teacherSchedule";
import Reports from "@/app/[locale]/admin/components/reports";
import PaidSesstionsTable from "@/app/[locale]/admin/components/paidSesstionsTable";
import FreeSesstionsTable from "./components/freeTrialTable";
import ReplaceTeacher from "./components/replaceTeacher";

export default function AdminPage() {
    return(
        <main className={"ps-[255px] max-md:ps-[20px] pe-[20px] pt-[7rem] flex justify-between gap-5 flex-wrap max-md:justify-between max-md:items-center"}>
            <section className={"max-md:w-full max-md:flex max-md:flex-col max-md:gap-5 max-md:items-center w-[600px]"}>
                <Statistics />
                <div className={"flex items-center gap-5 pb-[20px] w-(calc(100% / 2)) max-md:flex-wrap"}>
                    <Attendance />
                    <OnGoingBox/>
                </div>
                <TeacherSchedule />
                <Reports />
            </section>
            <section className="mx-auto max-md:w-full max-md:px-[20x]">
                <div className="px-2">
                    <FreeSesstionsTable />
                    <PaidSesstionsTable />
                    <ReplaceTeacher />
                </div>
            </section>
        </main>
    )
}
