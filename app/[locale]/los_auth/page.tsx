"use client";

import Image from "next/image";
import AdminLoginForm from "../components/AdminLoginForm";
import { useEffect, useState } from "react";

function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <main className="pt-[80px] px-10 max-md:px-1">
      <div className="flex items-center justify-center gap-5 max-md:flex-col-reverse">
        <div
          className={`w-[600px] h-[460px] max-md:w-full max-md:h-full opacity-${
            isLoading ? "5" : "0"
          } transition-opacity duration-500 `}
        >
          <Image
            src={"/vectors/adminLogin.svg"}
            width={600}
            height={600}
            placeholder="blur"
            blurDataURL="/vectors/adminLoginBlur.svg"
            loading="lazy"
            style={{
              width: "auto",
              height: "auto",
            }}
            alt="admin login image"
            className="w-full h-full"
            sizes="(max-width: 768px) 100vw,
                            (max-width: 1200px) 50vw,
                            33vw"
          />
        </div>
        <div className="w-[600px] px-5 max-md:w-full max-md:h-full">
          <AdminLoginForm />
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
