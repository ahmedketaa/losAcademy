"use client"

import { useTranslations } from "next-intl";
import FeadBackCard from "./FeadBackCard"

function FeedBack() {

  const t = useTranslations("feedbackSection");
  const t2 = useTranslations("feedbackSection.studentsFeedbacks");

  return (
    <section className="py-12 px-8" id="feedback">
        <h2 className="text-center font-semibold text-3xl mb-9">{t("feedbackTitle")}</h2>
        <div className="flex flex-row justify-center items-start gap-5 flex-wrap">
            <FeadBackCard username={t2('0.name')} country={t2('0.country')} comment={(t2('0.comment'))} />
            <FeadBackCard username={t2('1.name')} country={t2('1.country')} comment={(t2('1.comment'))} />
            <FeadBackCard username={t2('2.name')} country={t2('2.country')} comment={(t2('2.comment'))} />
            <FeadBackCard username={t2('3.name')} country={t2('3.country')} comment={(t2('3.comment'))} />
        </div>
    </section>
  )
}

export default FeedBack