export default function StatisticBox({title, number}: {title: string; number: string}) {
    return(
        <div className={"flex flex-col justify-center items-center gap-[16px] text-center w-[100%] shadow-[0_4px_14px_0_rgba(0,0,0,0.25)] rounded-[24px] p-[40px]"}>
            <h3 className={"text-black-color-one font-semibold text-[16px]"}>{title}</h3>
            <span className={"text-black-color-two font-semibold text-[24px]"}>{number}</span>
        </div>
    )
}