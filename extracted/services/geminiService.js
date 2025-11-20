import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini client
// NOTE: In a real app, keys should not be exposed on client-side without proxy, 
// but for this demo architecture it adheres to the request.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || '';
if (!apiKey) {
    console.warn("Gemini API Key is missing. AI features will fail. Please add VITE_GEMINI_API_KEY to extracted/.env");
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Uses Gemini to match a user's natural language query with available courses.
 * Returns a list of Course IDs that match the query.
 */
export const findSmartMatches = async (query, allCourses) => {
    try {
        // Simplify course data for the prompt to save tokens
        const courseSummaries = allCourses.map(c => ({
            id: c.id,
            title: c.title,
            description: c.description,
            tags: c.tags,
            barter: c.is_barter_enabled ? `Wants: ${c.barter_skills_wanted?.join(', ')}` : 'No barter'
        }));

        const model = 'gemini-2.5-flash';
        const prompt = `
      You are a smart search engine for a skill exchange platform called Teach and Trade (TNT).
      
      User Query: "${query}"
      
      Available Courses (JSON):
      ${JSON.stringify(courseSummaries)}
      
      Task: Return a JSON array of strings containing ONLY the 'id' of the courses that best match the user's query.
      If the user is asking for a barter trade (e.g., "I can teach X, I want to learn Y"), match based on the barter requirements.
      Sort them by relevance. If no strong matches, return an empty array.
    `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });

        const jsonText = response.text;
        if (!jsonText) return [];

        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Gemini Smart Match Error:", error);
        return [];
    }
};

/**
 * Generates a course description based on title and keywords.
 */
export const generateAiDescription = async (title, skills) => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
      Write a compelling, professional, yet approachable course description (approx 50-80 words) for a learning platform called Teach and Trade.
      
      Course Title: ${title}
      Key Skills/Topics: ${skills}
      
      The description should highlight the benefits and what the student will achieve.
    `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "Could not generate description.";
    } catch (error) {
        console.error("Gemini Description Gen Error:", error);
        return "Unable to generate description at this time. Please write one manually.";
    }
};

/**
 * Generates a helpful response to a user's question about a course.
 */
export const askCourseAssistant = async (question, contextCourse) => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
      You are an AI assistant on the Teach and Trade platform.
      A potential student has a question about a specific course.
      
      Course Details:
      Title: ${contextCourse.title}
      Trainer: ${contextCourse.trainer_name}
      Description: ${contextCourse.description}
      Location: ${contextCourse.location}
      Price: $${contextCourse.price}
      Barter: ${contextCourse.is_barter_enabled ? 'Available' : 'Not available'}
      
      Student Question: "${question}"
      
      Answer politely, briefly, and encourage them to book if it fits.
    `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "I'm sorry, I couldn't process that question.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "I am currently unavailable.";
    }
};

/**
 * Generates a structured lesson plan for the classroom view.
 */
export const generateLessonPlan = async (topic, duration) => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
      Create a structured, markdown-formatted lesson plan for a teaching session.
      
      Topic: ${topic}
      Duration: ${duration}
      
      Structure:
      1. Objectives
      2. Agenda (with time allocations)
      3. Key Concepts
      4. Activity/Practice
      5. Wrap-up
      
      Keep it concise and actionable for the trainer.
    `;

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });

        return response.text || "Could not generate lesson plan.";
    } catch (error) {
        console.error("Gemini Lesson Plan Error:", error);
        return "Lesson plan generation failed.";
    }
};
