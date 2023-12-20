"use client";

import { useEffect, useState } from "react";

export default function useCountDown() {
    const [secondsLeft, setCountDown] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(secondsLeft - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [secondsLeft]);
    function start(seconds: number) {
        setCountDown(seconds);
    }
    return { secondsLeft, start };
}