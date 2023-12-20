import { getAllSessions } from "@/utilities/getAllSessions";
import TeacherScheduleData from "./teacherScheduleData";

export default async function StudentAbsent() {
  const allSessiosns = await getAllSessions(
    "teacher/sessions?status=user_absent"
  );
  // console.log(allSessiosns.sessions);
  const sortedSessions = allSessiosns.sessions?.sort((a: any, b: any) => {
    return (
      new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime()
    );
  });

  return (
    <div className={"adminBox w-full flex-col"}>
      <h3 className={"adminBoxTitle"}>Absent Students Sessions</h3>
      <div className="w-full flex-col h-[200px] scrollAction mb-[20px]">
        {sortedSessions && sortedSessions.length > 0 ? (
          sortedSessions.map((session: any, index: number) => {
            return <TeacherScheduleData data={session} key={index} />;
          })
        ) : (
          <p className="p-3 bg-warning-color text-white w-fit rounded-full mt-2 font-bold">
            No Sessions
          </p>
        )}
      </div>
    </div>
  );
}
