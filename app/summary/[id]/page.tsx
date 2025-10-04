import { Card, CardHeader } from "@/components/ui/card";
import { Info, Gavel, BrushCleaning, Database, } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const summary = await prisma.websiteSummary.findUnique({
        where: { id },
    });

    if (!summary) {
        return {
            title: "Summary Not Found",
            description: "No summary found for this website.",
        };
    }

    return {
        title: summary.url,
        description: summary.about,
        openGraph: {
            title: summary.url,
            description: summary.about,
        },
    };
}


export default async function SummaryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const summary = await prisma.websiteSummary.findUnique({
        where: { id },
    });

    if (!summary) return (
        <main className="flex items-center justify-center py-8">
            <div className="min-h-[80vh] w-[90%] md:w-[70%] mx-auto flex flex-col gap-4 items-center justify-center">
                <p className="text-2xl font-bold text-center">Summary not found</p>
            </div>
        </main>
    );
    return (
        <main className="flex items-center justify-center py-8">
            <div className="min-h-[80vh] w-[90%] md:w-[70%] mx-auto flex flex-col gap-4 items-center justify-center">
                <h2 className="text-3xl font-semibold text-center">Summary of the website</h2>
                <p className="text-slate-500 text-base sm:text-xl text-center">Here is a quick overview of each sections of the website</p>
                <div className="mt-3 w-full grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader className="flex items-center gap-2 border-b border-slate-200 text-base">
                            <Info />
                            <h3>About the site</h3>
                        </CardHeader>
                        <p className="text-sm px-6">{summary.about}</p>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <Gavel />
                            <h3>Terms of Service</h3>
                        </CardHeader>
                        <p className="text-sm px-6">{summary.terms}</p>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <BrushCleaning />
                            <h3>Privacy Policy</h3>
                        </CardHeader>
                        <p className="text-sm px-6">{summary.policies}</p>
                    </Card>
                    <Card>
                        <CardHeader className="flex items-center gap-2">
                            <Database />
                            <h3>Data Collected</h3>
                        </CardHeader>
                        <p className="text-sm px-6">{summary.data_collected}</p>
                    </Card>
                </div>
            </div>
        </main>
    )
}