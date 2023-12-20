 import StatisticBox from "@/app/[locale]/admin/components/statisticBox";
import { getStaticData } from "@/utilities/getStaticData";
export default async function Statistics() {
    const totalStudents = await getStaticData('user');
    const totalTeachers = await getStaticData('teacher');
    const totalBalance = await getStaticData('teacher/adminBalance');

    return (
        <section className={"flex gap-5 pb-[20px] w-full max-md:w-full max-md:px-5 max-md:flex-col max-md:flex-wrap px-2"}>
            <StatisticBox title={"Total Students"} number={totalStudents.length}/>
            <StatisticBox title={"Total Teachers"} number={totalTeachers.length}/>
            <StatisticBox title={"Total Balance"} number={`${totalBalance.balance[0].amount}$`}/>
        </section>
    );
}
