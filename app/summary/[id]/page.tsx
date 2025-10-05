import { SummaryCard } from "@/components/SummaryCard";
import { Info, Gavel, BrushCleaning, Database, } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { LighthouseOverview } from "@/components/lighthouse/LighthouseOverview";

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
                {
                    <LighthouseOverview
                        performance={summary.performance || 0}
                        accessibility={summary.accessibility || 0}
                        bestPractices={summary.bestPractices || 0}
                        seo={summary.seo || 0}
                    />
                }
                <div className="mt-3 w-full grid md:grid-cols-2 gap-8">
                    <SummaryCard icon={Info} title="About the site" body={summary.about} />
                    <SummaryCard icon={Gavel} title="Terms of service" body={summary.terms} />
                    <SummaryCard icon={BrushCleaning} title="Privacy Policy" body={summary.policies} />
                    <SummaryCard icon={Database} title="Data Collected" body={summary.data_collected} />
                </div>
            </div>
        </main>
    )
}