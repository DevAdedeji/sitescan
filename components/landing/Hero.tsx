"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner"

export default function Hero() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        try {
            setLoading(true);
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const url = data.get("url") as string;
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url })
            })
            const summary = await response.json();
            console.log(summary)
            if (summary.id) {
                router.push(`/summary/${summary.id}`);
            } else {
                toast.error("Failed to generate summary");
            }
        } catch (e) {
            console.log(e);
            toast.error("Failed to generate summary");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-[90%] mx-auto lg:w-1/2 flex flex-col gap-4 items-center justify-center text-center">
                <h2 className="font-semibold text-3xl sm:text-5xl capitalize">Summarize any website quickly</h2>
                <p className="text-base sm:text-xl text-slate-500">Paste url and get concised, AI powered summary in seconds.</p>
                <form onSubmit={handleSubmit} className="w-full sm:w-2/3 flex flex-col items-center justify-center gap-4">
                    <Input placeholder="https://example.com" type="url" name="url" required />
                    <Button type="submit" disabled={loading} className="w-fit">
                        {
                            loading ? "Summarizing..." : "Summarize"
                        }
                    </Button>
                </form>
            </div>
        </div>
    )
}