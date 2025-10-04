import Link from "next/link"

export default function Header() {
    return (
        <header className="px-6 py-4 border-b border-slate-200">
            <nav className="mx-auto">
                <Link href={"/"}>
                    <h1 className="text-2xl sm:text-3xl font-bold">SiteScan.</h1>
                </Link>
            </nav>
        </header>
    )
}