"use client";
import { useTranslations } from "next-intl";
import FooterMain from "../FooterMain";
import FooterFollow from "../FooterFollow";
import { usePathname } from "next/navigation";

export default function Footer() {
  const router = usePathname();
  const isAdminDashboard = router.startsWith("/admin");
  const isAdminLogin = router.startsWith("/los_auth");
  const isStudentProfile = router.startsWith("/student");
  const isTeacherProfile = router.startsWith("/teacher");
  const t = useTranslations("Footer");
  if (
    !(isAdminDashboard || isAdminLogin || isStudentProfile || isTeacherProfile)
  ) {
    return (
      <footer className="flex flex-col items-center justify-center pt-12 gap-9">
        <section className="w-full border-b-[1px] pb-4 border-secondary-color">
          <FooterMain />{" "}
        </section>
        <section className="w-full">
          <FooterFollow />{" "}
        </section>
        <section className="w-full text-center p-4 border-t-[1px] border-secondary-color">
          {" "}
          <p className="font-semibold text-sm text-black-one-color">
            {t("footer-title")}
          </p>{" "}
        </section>
      </footer>
    );
  }
}
