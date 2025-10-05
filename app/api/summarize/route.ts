import { NextResponse } from "next/server";
import * as cheerio from "cheerio"
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { startOfToday } from "./helper";
import { cookies } from "next/headers";

interface Summary {
    about: string;
    terms: string;
    policies: string;
    data_collected: string;
}

async function fetchPageText(url: string): Promise<string> {
    try {
        const res = await fetch(url, { cache: "no-store" });
        const html = await res.text();
        const $ = cheerio.load(html);
        const text = $("h1,h2,h3,h4,p,li")
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(Boolean)
            .join(" ");
        return text;
    } catch (err) {
        console.error("Failed to fetch page:", err);
        return "";
    }
}

function extractLinks(html: string, baseUrl: string): string[] {
    const $ = cheerio.load(html);
    const links: string[] = [];

    $("a").each((_, el) => {
        const href = $(el).attr("href") || "";
        const text = $(el).text().toLowerCase();

        if (text.includes("privacy") || text.includes("terms") || text.includes("policy")) {
            const absoluteUrl = href.startsWith("http") ? href : new URL(href, baseUrl).toString();
            links.push(absoluteUrl);
        }
    });

    return links;
}

function parseJsonResponse(text: string): Summary {
    text = text.replace(/```(json)?\s*/g, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(text);
    } catch (err) {
        console.error("Failed to parse JSON:", err);
        return { about: "", terms: "", policies: "", data_collected: "" };
    }
}

async function fetchLighthouseScores(url: string) {
    try {
        let lighthouseScores = { performance: 0, accessibility: 0, bestPractices: 0, seo: 0 };
        const apiKey = process.env.PAGESPEED_API_KEY;
        const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
            url
        )}&category=performance&category=accessibility&category=seo&category=best-practices&key=${apiKey}`;
        const lighthouseResponse = await fetch(apiUrl);
        const data = await lighthouseResponse.json();
        if (data.lighthouseResult?.categories) {
            lighthouseScores = {
                performance: Math.round(data.lighthouseResult.categories.performance.score * 100),
                accessibility: Math.round(data.lighthouseResult.categories.accessibility.score * 100),
                bestPractices: Math.round(data.lighthouseResult.categories["best-practices"].score * 100),
                seo: Math.round(data.lighthouseResult.categories.seo.score * 100),
            };
        }
        console.log(lighthouseScores);
        return lighthouseScores;
    } catch (e) {
        console.error("Failed to fetch Lighthouse scores:", e);
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const url = String(body.url || "").trim();

        if (!url) {
            return NextResponse.json({ error: "Missing url" }, { status: 400 });
        }

        const myCookies = cookies();
        let userId = (await myCookies).get("userId")?.value;

        if (!userId) {
            userId = crypto.randomUUID();
        }

        const todayStart = startOfToday();
        const scanCount = await prisma.websiteSummary.count({
            where: {
                userId,
                createdAt: { gte: todayStart }
            }
        })

        if (scanCount >= 3) {
            return NextResponse.json(
                { error: `Daily limit reached. You can only scan 3 websites per day.` },
                { status: 429 }
            )
        }

        // Fecth page texts
        const res = await fetch(url, { cache: "no-store" });
        const html = await res.text();
        const $ = cheerio.load(html);
        const mainText = $("h1,h2,h3,h4,p,li")
            .map((_, el) => $(el).text().trim())
            .get()
            .filter(Boolean)
            .join(" ");
        const policyLinks = extractLinks(html, url);
        const policyTexts = await Promise.all(policyLinks.map(fetchPageText));

        const fullText = [mainText, ...policyTexts].join("\n\n");

        // Generate structured summary using Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
        Given the following website text:

        ${fullText.split(" ").slice(0, 4000).join(" ")}

        Return a JSON object with this structure ONLY:

        {
          "about": "short summary of what the site is about",
          "terms": "summary of terms & conditions (if any, else empty string)",
          "policies": "summary of privacy or policies (if any, else empty string)",
          "data_collected": "list or description of user data collected (if mentioned, else empty string)"
        }

        Do not add extra commentary, only return valid JSON.
            `,
        });


        const lighthouseScores = await fetchLighthouseScores(url);

        const summaryJson = parseJsonResponse(response.text || "");

        const finalSummary = { url, ...summaryJson, ...lighthouseScores, userId }

        const savedSummary = await prisma.websiteSummary.create({
            data: finalSummary,
        })

        return NextResponse.json(savedSummary);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        if (
            err.code === "QUOTA_EXCEEDED" ||
            err.code === "RATE_LIMIT_EXCEEDED" ||
            err.status === 429
        ) {
            return NextResponse.json(
                { error: "Gemini quota exceeded. Please check your API key or usage." },
                { status: 429 }
            );
        }
        console.error("Gemini error:", err);
        return NextResponse.json(
            { error: "Failed to generate summary" },
            { status: 500 }
        );
    }
}