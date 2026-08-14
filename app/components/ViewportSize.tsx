"use client";

import { useEffect, useState } from "react";

export default function ViewportSize() {
    const [size, setSize] = useState("");

    useEffect(() => {
        const update = () => {
            setSize(`${window.innerWidth} × ${window.innerHeight}`);
        };

        update();
        window.addEventListener("resize", update);

        return () => window.removeEventListener("resize", update);
    }, []);

    if (!size) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 10,
                right: 10,
                zIndex: 99999,
                background: "rgba(0,0,0,0.85)",
                color: "#fff",
                padding: "6px 10px",
                borderRadius: 4,
                fontFamily: "monospace",
                fontSize: 13,
            }}
        >
            {size}
        </div>
    );
}