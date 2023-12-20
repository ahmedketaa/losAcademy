import "../globals.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import Footer from "@/app/[locale]/components/layout/Footer";
import CustomNavbar from "@/app/[locale]/components/layout/Navbar";
import NextTopLoader from "nextjs-toploader";

// the main font
const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-work-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: "normal",
  preload: true,
});
// metadata for pages
export const metadata: Metadata = {
  title: "LOS Academy",
  description: "Learning Forgeins Kids Arabic And Islamic Courses",
  icons: {
    icon: "/favicon.ico",
  },
 
  // openGraph: {
  //   title: 'LOS Academy',
  //   description: 'Learning Forgeins Kids Arabic And Islamic Courses',
  //   url: 'https://los-academy.com/',
  //   siteName: 'LOS Academy',
  //   images: "/logo.png",
  //   locale: 'en-US',
  //   type: 'website',
  // },
  // twitter: {
  //   card: 'summary_large_image',
  //   title: 'LOS Academy',
  //   description: 'Learning Forgeins Kids Arabic And Islamic Courses',
  //   creator: '@los_academy',
  //   images: "/logo.png",
  // },
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // get translated files for locale
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html
      className={workSans.className}
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <header>
            <CustomNavbar />
          </header>
          <NextTopLoader
            color="#2299DD"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          />
          {children}
          {/* <Suspense fallback={<>Loading..</>}>
            <NavigationEvents />
          </Suspense> */}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
