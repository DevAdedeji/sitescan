import { LighthouseScoreCard } from "./LighthouseScoreCard"

interface lighthouseOverviewProps {
    performance: number
    accessibility: number
    bestPractices: number
    seo: number
}

export const LighthouseOverview = ({ performance, accessibility, bestPractices, seo }: lighthouseOverviewProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm">
                <p className="text-slate-500 font-semibold text-center">Performance</p>
                <LighthouseScoreCard percentage={performance} />
            </div>
            <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm">
                <p className="text-slate-500 font-semibold text-center">Accessibility</p>
                <LighthouseScoreCard percentage={accessibility} />
            </div>
            <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm">
                <p className="text-slate-500 font-semibold text-center">Best Practices</p>
                <LighthouseScoreCard percentage={bestPractices} />
            </div>
            <div className="flex flex-col gap-2 border rounded-xl p-3 shadow-sm">
                <p className="text-slate-500 font-semibold text-center">SEO</p>
                <LighthouseScoreCard percentage={seo} />
            </div>
        </div>
    )
}