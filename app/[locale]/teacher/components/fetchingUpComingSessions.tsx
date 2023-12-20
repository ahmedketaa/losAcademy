import { getUpComingSession } from "@/utilities/getUpComingSession";
import { cookies } from "next/headers";
import OnGoingBox from "./onGoingBox";
import { getOnGoingSession } from "@/utilities/getOnGoingSession";

export default async function FetchingUpComingSessions() {
  const token = cookies().get("token")?.value.toString();
  const upComingSession = await getUpComingSession(token);
  const onGoingSession = await getOnGoingSession(token);

  return (
    <section className="w-full">
      <div
        className={
          "flex-col justify-start items-center gap-[16px] h-[240px] text-center adminBox overflow-auto"
        }
      >
        <h3 className={"adminBoxTitle"}>
          Are you here and ready for the session ?
        </h3>
        <OnGoingBox
          session={onGoingSession.length > 0 ? onGoingSession : upComingSession}
        />
      </div>
    </section>
  );
}
