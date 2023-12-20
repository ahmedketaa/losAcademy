'use client';

import Image from "next/image";
// import { PrimaryButton } from "./PrimaryButton";
import PrimaryButton from "./PrimaryButton";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Cookies from "universal-cookie";
import BookModal from "../student_profile/components/BookModal";
import { useState } from "react";
import BookSessionFromHome from "./bookSessionFromHome";

const Hero = () => {
  const t = useTranslations("Hompage");
  const router = useRouter()
  const cookies = new Cookies()

  const [open, setOpen] = useState(false)

  const openBookModal = () => {
    setOpen(true)
  }
  const closeBookModal = () => {
    setOpen(false)
  }
  const bookNow = () => {
    if(!cookies.get("name")) {
      router.push("/login")
    } else {
      // open book session modal
      openBookModal()
    }
  }

  return (
      <section id="hero" className="flex flex-row justify-center items-center mt-20 py-16 max-md:flex-wrap px-14 max-md:px-3">
        <div className="flex flex-col justify-center items-flex-start gap-3">
              <h1 className='font-bold text-5xl'>
                {t('hero-title')}
              </h1>
            <p className="text-2xl font-normal text-black-two-color">
              {t('hero-paragraph')}
            </p>
            <span className="text-xl font-normal text-gray-one-color">
              {t('hero-span')}
            </span>
          <PrimaryButton onClick={bookNow} text={t('bookNow-btn')} ourStyle="bg-secondary-color hover:bg-secondary-hover text-sm font-semibold transition-colors text-white shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)] py-2.5 px-12 shadow rounded-full w-50 mx-auto mt-5" />
        </div>
        <Image src="/vectors/Header1.svg" alt="header image" width={800} height={400} loading="lazy" blurDataURL="/vectors/HeaderBlur.svg" className="w-[800px] h-auto max-md:w-full"/>
        <BookSessionFromHome openModal={open} closeModal={closeBookModal}/>
      </section>
  )
}

export default Hero