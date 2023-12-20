import StatisticBox from "@/app/[locale]/admin/components/statisticBox";
import { getCurrentTeacher } from "@/utilities/getMe";
import { cookies } from 'next/headers';

export default async function Statistics() {

    const token = cookies().get('token')?.value;
    const getTeacher = await getCurrentTeacher(token)
    
    return (
        <section className={"flex gap-5 pb-[20px] w-full max-md:w-full max-md:px-5 max-md:flex-col max-md:flex-wrap px-2"}>
            <StatisticBox title={"Total Balance"} number={`${getTeacher.data?.balance}$`}/>
        </section>
    );
}
