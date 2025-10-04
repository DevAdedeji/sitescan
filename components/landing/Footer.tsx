"use client"
export default function Footer() {
    return (
        <footer className="mx-auto px-6 py-4 text-center border-t border-slate-200">
            <p className="text-xs sm:text-sm text-slate-500">
                © {new Date().getFullYear()} ClearSite. Summaries are AI-generated and should not be considered legal advice.
            </p>
        </footer>
    )
}