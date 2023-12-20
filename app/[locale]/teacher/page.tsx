import Attendance from "./components/attendance";
import RescheduleSessions from "./components/getRescheduleRequests";
import FreeSesstionsTable from "./components/freeTrialTable";
import PaidSesstionsTable from "./components/paidSesstionsTable";
import Reports from "./components/reports";
import Statistics from "./components/statistics";
import TeacherSchedule from "./components/teacherSchedule";
import FetchingUpComingSessions from "./components/fetchingUpComingSessions";
import StudentAbsent from "./components/studentAbsent";

export default function TeacherPage() {
    return (
        <main className={"ps-[255px] max-md:ps-[20px] pe-[20px] pt-[7rem] flex justify-between gap-5 flex-wrap max-md:justify-between max-md:items-center"}>
            <section className={"max-md:w-full max-md:flex max-md:flex-col max-md:gap-5 max-md:items-center w-[600px]"}>
                <div className="flex items-center justify-between pb-[20px] gap-5 max-md:flex-wrap">
                    <Attendance />
                    <FetchingUpComingSessions/>
                    
                </div>
                <div className={"flex flex-col items-center gap-5 pb-[20px] max-md:flex-wrap"}>
                    <TeacherSchedule />
                    <StudentAbsent />
                </div>
                <Reports />
            </section>
            <section className="mx-auto">
                <RescheduleSessions />
                <div className="px-2">
                    <FreeSesstionsTable />
                    <PaidSesstionsTable />
                    <Statistics />
                </div>
            </section>
        </main>
    )
}
