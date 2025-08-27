






import os
import openai
from typing import Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize AI models
openai.api_key = os.getenv("OPENAI_API_KEY")

def get_ai_response(prompt: str, model: str = "gpt-4o-mini") -> str:
    """
    Get response from AI model based on the prompt.
    """
    try:
        if model == "gpt-4o-mini":
            return call_openai(prompt, "gpt-4o-mini")
        elif model == "deepseek-r1":
            return call_deepseek(prompt)
        elif model == "gemini-1.5-flash":
            return call_gemini(prompt)
        else:
            return call_openai(prompt, "gpt-4o-mini")
    except Exception as e:
        return f"Error: {str(e)}"

def call_openai(prompt: str, model: str = "gpt-4o-mini") -> str:
    """Call OpenAI API"""
    try:
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that provides accurate information based on the given context."},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        return f"OpenAI API Error: {str(e)}"

def call_deepseek(prompt: str) -> str:
    """Call DeepSeek API"""
    # Implement DeepSeek API integration here
    # This is a placeholder implementation
    return f"DeepSeek response to: {prompt}"

def call_gemini(prompt: str) -> str:
    """Call Gemini API"""
    # Implement Gemini API integration here
    # This is a placeholder implementation
    return f"Gemini response to: {prompt}"

def summarize_text(text: str, model: str = "gpt-4o-mini") -> str:
    """Generate summary of the text"""
    prompt = f"Please summarize the following text:\n\n{text}\n\nSummary:"
    return get_ai_response(prompt, model)

def extract_information(text: str, query: str, model: str = "gpt-4o-mini") -> str:
    """Extract specific information from text"""
    prompt = f"From the following text, extract information related to: '{query}'\n\n{text}\n\nExtracted information:"
    return get_ai_response(prompt, model)

def analyze_text(text: str, analysis_type: str, model: str = "gpt-4o-mini") -> str:
    """Perform text analysis"""
    prompt = f"Analyze the following text for {analysis_type}:\n\n{text}\n\nAnalysis:"
    return get_ai_response(prompt, model)

def rewrite_text(text: str, style: str = "formal", model: str = "gpt-4o-mini") -> str:
    """Rewrite text in different style"""
    prompt = f"Rewrite the following text in {style} style:\n\n{text}\n\nRewritten text:"
    return get_ai_response(prompt, model)






