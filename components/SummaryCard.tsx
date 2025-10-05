import { Card, CardHeader } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SummaryCardProps {
    title: string
    body: string
    icon: LucideIcon,
}

export async function SummaryCard({ title, body, icon: Icon }: SummaryCardProps) {
    return (
        <Card>
            <CardHeader className="flex items-center gap-2 border-b border-slate-200 text-base">
                <Icon />
                <h3>{title}</h3>
            </CardHeader>
            <p className="text-sm px-6">{body}</p>
        </Card>
    )
}