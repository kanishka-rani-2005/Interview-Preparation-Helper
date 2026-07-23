const { GoogleGenAI, Type } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");
require("dotenv").config();
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const interviewReportSchema = z.object({
    title: z.string().describe("The job title for which the report is generated"),
    matchScore: z.number().int().min(0).max(100).describe("Match score between 0 and 100"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical interview question . AT least 5-6"),
        intention: z.string().describe("Why the interviewer asks this, skill evaluated, and concept tested"),
        answer: z.string().describe("Comprehensive guide: step-by-step, concepts, best practices, mistakes to avoid")
    })).describe("List of technical questions with intentions and detailed answer guides"),
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral interview question.Atleast 5-6"),
        intention: z.string().describe("Soft skills and traits being evaluated"),
        answer: z.string().describe("How to answer using the STAR framework (Situation, Task, Action, Result)")
    })).describe("List of behavioral questions with STAR framework guides"),
    skillGaps: z.array(z.object({
        skill: z.string().describe("The missing or weak skill"),
        severity: z.enum(["low", "medium", "high"]).describe("Impact on candidate eligibility")
    })).describe("Identified skill gaps"),
    preparationPlan: z.array(z.object({
        day: z.number().int().describe("Day number starting from 1"),
        focus: z.string().describe("Primary learning objective for the day"),
        tasks: z.array(z.string()).describe("3-6 actionable, measurable tasks for the day")
    })).describe("Day-by-day study and practice plan")
});



async function generateInterviewReport({ resumeText, selfDescription, jobDescription }) {
    const prompt = `
You are a Senior Staff Software Engineer and Interviewer at Google.

Analyze the candidate details and generate an interview report in JSON format matching the schema.

Resume:
${resumeText}

Candidate Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash-lite", 
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        matchScore: { type: Type.INTEGER },
                        technicalQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    intention: { type: Type.STRING },
                                    answer: { type: Type.STRING }
                                },
                                required: ["question", "intention", "answer"]
                            }
                        },
                        behavioralQuestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    intention: { type: Type.STRING },
                                    answer: { type: Type.STRING }
                                },
                                required: ["question", "intention", "answer"]
                            }
                        },
                        skillGaps: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    skill: { type: Type.STRING },
                                    severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                                },
                                required: ["skill", "severity"]
                            }
                        },
                        preparationPlan: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    day: { type: Type.INTEGER },
                                    focus: { type: Type.STRING },
                                    tasks: {
                                        type: Type.ARRAY,
                                        items: { type: Type.STRING }
                                    }
                                },
                                required: ["day", "focus", "tasks"]
                            }
                        },
                    },
                    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
                }
            }
        });

        const parsedData = JSON.parse(response.text);
        // console.log(JSON.stringify(parsedData, null, 2));
        return parsedData;

    } catch (error) {
        console.error("Error generating interview report:", error);
        throw error;
    }
}


async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resumeText, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        ResumeText: ${resumeText}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })


    const jsonContent = JSON.parse(response.text)

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer

}

module.exports = { generateInterviewReport, generateResumePdf };