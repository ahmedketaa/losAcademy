"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Spinner } from "flowbite-react";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${pathname}?${searchParams}`;
    if (
      url === "/student_profile?" ||
      url === "/login?" ||
      url === "/los_auth?" ||
      url === "/teacher?" ||
      url === "/admin?"
    ) {
      // console.log(url);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [pathname, searchParams]);

  return loading ? (
    <div className="progress-bar">
      <Spinner
        style={{
          width: "3rem",
          height: "3rem",
          zIndex: "1000",
          position: "fixed",
          top: "14%",
          left: "1%",
        }}
      />
    </div>
  ) : null;
}
