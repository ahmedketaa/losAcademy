"use client";
import Image from "next/image";
import Link from "next/link";
import { BsTelephone } from "react-icons/bs";
import { GoLocation } from "react-icons/go";
import { TbMailOpened } from "react-icons/tb";
import { useTranslations } from "next-intl";

function FooterMain() {
  const t = useTranslations("CustomNavbar");
  return (
    <div className="flex items-start justify-evenly w-full flex-wrap max-sm:flex-col max-sm:items-center max-sm:justify-center max-sm:gap-10">
      {/* Logo part */}
      <div className="flex flex-col justify-center items-center">
        <Image
          src="/logo.png"
          alt="logo"
          width={50}
          height={50}
          loading="lazy"
          className={"w-auto h-auto"}
        />
        <h2 className={"font-semibold text-xl"}>LOS Academy</h2>
      </div>
      {/* Links part */}
      <div className="max-sm:flex max-sm:flex-row max-sm:items-start max-sm:justify-between max-sm:w-full max-sm:px-10 max-[360px]:px-5 flex justify-around w-[calc(100%2)]">
        <div className="flex flex-col items-end">
          <h5 className="font-semibold text-base text-black-one-color mb-2">
            Academy
          </h5>
          <ul className="font-normal text-black-Two-color flex flex-col items-center gap-2">
            <Link href={"/#hero"}>
              <li>{t("home-link")}</li>
            </Link>
            <Link href={"/#aboutUs"}>
              <li>{t("about-link")}</li>
            </Link>
            <Link href={"/#courses"}>
              <li>{t("courses-link")}</li>
            </Link>
            <Link href={"/#contactus"}>
              <li>{t("contact-link")}</li>
            </Link>
          </ul>
        </div>
        {/* Contact part */}
        <div>
          <ul className="font-normal text-black-Two-color flex flex-col items-start gap-5">
            <li className="flex items-start gap-4">
              <GoLocation className="text-xl" /> Location
            </li>
            <li className="flex items-start gap-4">
              <BsTelephone className="text-xl" /> +020 1023456789
            </li>
            <li className="flex items-start gap-4">
              <TbMailOpened className="text-xl" /> Quran@gmail.com
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FooterMain;
