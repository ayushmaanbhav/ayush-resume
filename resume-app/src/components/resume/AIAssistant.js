import React, { useState } from 'react';

const AIAssistant = ({ resumeData }) => {
    const [jobTitle, setJobTitle] = useState('');
    const [result, setResult] = useState('Enter a job title to see the magic happen...');
    const [loading, setLoading] = useState(false);

    const callGeminiAPI = async (prompt, retries = 3, delay = 1000) => {
        const apiKey = ""; // Add your API key here
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        const payload = { contents: [{ parts: [{ text: prompt }] }] };
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (result.candidates && result.candidates?.content?.parts) {
                    return result.candidates.content.parts.text;
                } else {
                    throw new Error('Unexpected response structure from Gemini API');
                }
            } catch (error) {
                if (i === retries - 1) throw error;
                await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
            }
        }
    };

    const generateSnippet = async () => {
        if (!jobTitle) {
            setResult('Please enter a job title.');
            return;
        }
        setLoading(true);
        try {
            const { summary, experience, skills } = resumeData;
            const resumeContent = `Summary: ${summary.personalSummary}\n\nExperience: ${experience.map(e => e.achievements.join('. ')).join('\n\n')}\n\nSkills: ${skills.join(', ')}`;
            const prompt = `Based on the following resume, write a concise and compelling cover letter paragraph (2-3 sentences) for the job title of "${jobTitle}". Highlight the most relevant skills and achievements from the resume. Resume content: ${resumeContent}`;
            const text = await callGeminiAPI(prompt);
            setResult(text);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setResult('Sorry, an error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="ai-tool" className="page-section">
            <div className="container">
                <h2>✨ AI-Powered Cover Letter Assistant</h2>
                <div id="ai-tool-section">
                    <p style={{ marginBottom: '1rem' }}>Enter a job title below, and I'll generate a tailored cover letter snippet based on my resume.</p>
                    <input
                        type="text"
                        id="job-title-input"
                        className="ai-tool-input"
                        placeholder="e.g., Senior AI Engineer, Product Manager..."
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                    />
                    <button id="generate-btn" className="ai-tool-button" onClick={generateSnippet} disabled={loading}>
                        {loading ? (
                            <>
                                Generating... <div className="loader"></div>
                            </>
                        ) : (
                            'Generate Snippet'
                        )}
                    </button>
                    <div id="ai-result-container">{result}</div>
                </div>
            </div>
        </section>
    );
};

export default AIAssistant;
