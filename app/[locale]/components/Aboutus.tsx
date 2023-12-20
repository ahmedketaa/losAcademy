'use client';

import { useTranslations } from "next-intl";
import Image from "next/image";

function AboutUs() {

    const t = useTranslations("AboutUs");

    return (
        <section id="aboutUs" className="px-6 py-12 flex justify-center gap-[125px] max-lg:gap-[50px] items-center flex-wrap">
            <div>
                <Image src={'/vectors/aboutus.svg'} alt="About Image" width={500} height={500} loading={"lazy"} className={"w-auto h-auto"} />
            </div>
            <div className="flex flex-col justify-center items-center w-2/5 max-md:w-4/5 max-sm:w-auto gap-9">
                <div>
                    <h4 className="text-3xl font-semibold text-black-one-color">{t('title-one')}</h4>
                    <p className="text-lg font-semibold text-black-two-color">
                        {t("paragraph-one")}
                    </p>
                </div>
                <div className="bg-white-color py-4 px-12 rounded-[2.5rem] shadow-lg text-start max-md:px-6">
                    <h4 className="text-2xl font-semibold text-black-one-color">{t("title-two")}</h4>
                    <p className="text-base font-medium text-black-two-color">
                        {t("paragraph-two")}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default AboutUs