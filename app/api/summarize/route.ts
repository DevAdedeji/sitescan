import { NextResponse } from "next/server";
import * as cheerio from "cheerio"
import { ai } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";

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
        console.error("Failed to fetch page:", url, err);
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

export async function POST(req: Request) {
    try {
        const { url } = await req.json();

        // Fetch main page
        const mainText = await fetchPageText(url);

        // Find Terms/Privacy links and fetch their text
        const res = await fetch(url, { cache: "no-store" });
        const html = await res.text();
        const policyLinks = extractLinks(html, url);

        const policyTexts = await Promise.all(policyLinks.map(fetchPageText));
        const fullText = [mainText, ...policyTexts].join("\n\n");

        // Generate structured summary using Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
        Given the following website text:

        ${fullText}

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

        const summaryJson = parseJsonResponse(response.text || "");

        const finalSummary = { url, ...summaryJson }

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