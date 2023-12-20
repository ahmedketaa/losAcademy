"use client";

import { useTranslations } from "next-intl";
import PlanCard from "./PlanCard";
import OurTab from "./OurTab";

function Plans() {

    const t = useTranslations('plans-section')

    return (
        <section id="prices">
            <h2 className="text-black-color-one text-3xl font-bold text-center mb-4">{t("plan-title")}</h2>
            <OurTab />
        </section>
    )

}

export default Plans