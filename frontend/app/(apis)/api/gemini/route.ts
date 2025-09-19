import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  const { gstNumber, customerName } = await req.json()

  if (!gstNumber || !customerName) {
    return NextResponse.json(
      { error: "gstNumber and customerName are required" },
      { status: 400 }
    )
  }

  try {
    // Enhanced prompt to leverage Gemini's knowledge
    const prompt = `
You are a business intelligence assistant. Given the company name "${customerName}" and GST number "${gstNumber}", provide a comprehensive company profile. Use your knowledge to infer details where possible.

Important instructions:
1. NEVER use placeholder values like "Not available" - make educated inferences based on the company name and industry
2. For GST number ${gstNumber}, validate the format and include any available registration details
3. For company name "${customerName}", research and provide accurate details
4. Return strictly valid JSON without any formatting or explanatory text

Required JSON structure:
{
  "GSTNumber": "${gstNumber}",
  "CustomerName": "${customerName}",
  "LeadProfile": "One-line business summary",
  "CompanyOverview": {
    "OfficialName": "Actual registered name",
    "BusinessDescription": "Detailed business activities"
  },
  "WebsiteAndLogo": {
    "OfficialWebsiteURL": "Inferred website URL if possible",
    "CompanyLogoURL": "Possible logo URL pattern"
  },
  "ContactInformation": {
    "Email": "Inferred email pattern (e.g., info@company.com)",
    "Phone": "Possible phone number",
    "RegisteredAddress": "Inferred location based on GST number"
  },
  "KeyPersonnel": {
    "Directors": ["Possible director names if inferrable"]
  },
  "SocialMediaHandles": {
    "LinkedIn": "Possible LinkedIn URL",
    "Twitter": "Possible Twitter URL",
    "Other": "Other social media URLs"
  }
}

Base your inferences on:
- GST number structure (first 2 digits = state code, next 10 = PAN)
- Company name patterns and industry
- Common Indian business practices
- Typical digital presence patterns
`

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    let text = result.response.text().trim()

    // Clean the response
    text = text.replace(/```json|```/g, "").trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch (err) {
      console.error("JSON parse error:", err, "Raw text:", text)
      return NextResponse.json(
        { error: "Could not parse Gemini response", raw: text },
        { status: 500 }
      )
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Gemini fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch details", details: error },
      { status: 500 }
    )
  }
}