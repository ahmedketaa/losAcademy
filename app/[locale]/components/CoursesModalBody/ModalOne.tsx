"use client";
import { useTranslations } from 'next-intl';
import PrimaryButton from './../PrimaryButton';

function ModalOne() {
    const t = useTranslations("eachModal");
    const t2 = useTranslations("arabicModal");

  return (
    <>
    <div className='flex flex-col w-[550px]'>
        <h2 className="text-black-color-one text-3xl font-bold mb-6">{t2("arabicModal-title")}</h2>
        <p className="text-black-color-two text-md font-normal mb-2">
            {t2("arabicModal-paragraph")}
        </p>
            <span className="text-black-color-two text-md font-normal">
                {t2("arabicModal-span")}
            </span>
            <ol type="1" style={{listStylePosition: "inside", listStyle: "auto"}} className="p-4 text-black-color-two text-md font-normal flex flex-col gap-3">
                <li>
                    {t2("arabicModal-list.0")}
                </li>
                <li>
                    {t2("arabicModal-list.1")}
                </li>
                <li>
                    {t2("arabicModal-list.2")}
                </li>
            </ol>
    </div>
    <div className='flex flex-col gap-5'>
        <h6 className="font-semibold text-black-color-one text-lg">{t('title')}</h6>
        <ul className="flex flex-col gap-2">
        <li className="flex space-x-3 decoration-gray-500 rtl:gap-2">
            <i className="bi bi-check-circle-fill text-secondary-color"></i>
            <span className="text-base font-normal leading-tight text-black-color-two">
                {t('features.0')}
            </span>
        </li>
        <li className="flex space-x-3 decoration-gray-500 rtl:gap-2">
            <i className="bi bi-check-circle-fill text-secondary-color"></i>
            <span className="text-base font-normal leading-tight text-black-color-two">
                {t('features.1')}
            </span>
        </li>
        <li className="flex space-x-3 decoration-gray-500 rtl:gap-2">
            <i className="bi bi-check-circle-fill text-secondary-color"></i>
            <span className="text-base font-normal leading-tight text-black-color-two">
                {t('features.2')}
            </span>
        </li>
        <li className="flex space-x-3 decoration-gray-500 rtl:gap-2">
            <i className="bi bi-check-circle-fill text-secondary-color"></i>
            <span className="text-base font-normal leading-tight text-black-color-two">
                {t('features.3')}
            </span>
        </li>
        <li className="flex space-x-3 decoration-gray-500 rtl:gap-2">
            <i className="bi bi-check-circle-fill text-secondary-color"></i>
            <span className="text-base font-normal leading-tight text-black-color-two">
                {t('features.4')}
            </span>
        </li>
        </ul>
        <PrimaryButton text={t("free-btn")} ourStyle={
            "bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors \
            text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-2.5 px-12 shadow rounded-full w-fit m-auto"
            } />
    </div>
    </>
    )
}

export default ModalOne