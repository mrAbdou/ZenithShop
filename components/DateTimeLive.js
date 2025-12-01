"use client";
import { useEffect, useState } from "react";

export default function DateTimeLive() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [mounted, setMounted] = useState(false); // cline code
    useEffect(() => {
        setMounted(true);//cline code
        const dateTimeInterval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000)
        return () => clearInterval(dateTimeInterval);
    }, [])
    if (!mounted) return <span className="inline-block w-4 h-4 border border-gray-200 border-t-blue-600 rounded-full animate-spin"></span>;
    return (
        <span>{currentDateTime.toLocaleString("en-US")}</span>
    )
}
