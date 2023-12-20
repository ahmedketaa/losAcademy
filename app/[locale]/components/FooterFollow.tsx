"use client"
import {FaSnapchat} from 'react-icons/fa';
import {FaSquareFacebook} from 'react-icons/fa6'
import {PiInstagramLogoFill} from 'react-icons/pi'
import {useTranslations} from "next-intl";
function FooterFollow() {
    const t = useTranslations("Footer")
  return (
    <div className="flex justify-evenly items-center flex-wrap">
      <div/>
      <h4 className="font-semibold text-base text-black-one-color">{t("footer-follow")}</h4>
      <ul className="flex flex-row justify-ceter items-center gap-3">
        <li><FaSnapchat className="text-xl"/></li>
        <li><FaSquareFacebook className="text-xl" /></li>
        <li><PiInstagramLogoFill className="text-xl" /></li>
      </ul>
    </div>
  )
}

export default FooterFollow