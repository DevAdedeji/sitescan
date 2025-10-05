export default function Loading() {
    return (
        <main className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center flex flex-col gap-3">
                <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-slate-500">Loading summary...</p>
            </div>
        </main>
    );
}
