import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
# Add this import to check the library version
from importlib.metadata import version

app = Flask(__name__)
CORS(app)

# --- NEW: ADD THIS DEBUGGING BLOCK ---
# This will print the exact version of the library to the Vercel logs.
try:
    lib_version = version('google-generativeai')
    print(f"INFO: Successfully imported google-generativeai version: {lib_version}")
except Exception as e:
    print(f"ERROR: Could not get google-generativeai version. {e}")
# --- END OF DEBUGGING BLOCK ---


# Configure the Gemini API
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not found.")
    
    genai.configure(api_key=api_key)
    
    # Let's stick with gemini-pro as it's the most stable name.
    model = genai.GenerativeModel('gemini-pro')
    
except Exception as e:
    print(f"ERROR: Failed to configure Gemini. Error: {e}")
    model = None

# Load the personal context from the file
personal_context = "Default context: Sujith is a software engineer. The main context file was not found."
try:
    context_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'context.txt')
    with open(context_path, 'r', encoding='utf-8') as f:
        personal_context = f.read()
except Exception as e:
    print(f"ERROR: Could not read context.txt. Searched at path: {context_path}. Error: {e}")


@app.route('/api/chat', methods=['POST'])
def chat_handler():
    if not model:
        return jsonify({"error": "The AI assistant is not configured correctly. Please check the server logs."}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    prompt = f"""
    You are a friendly and professional chatbot for Sujith's personal portfolio website. 
    Your purpose is to answer questions about Sujith based ONLY on the context provided below. 
    If a question is asked that cannot be answered from the context, politely state that you don't have that specific information.
    Do not make up answers. Keep your responses concise and helpful.

    --- CONTEXT ---
    {personal_context}
    --- END CONTEXT ---

    USER'S QUESTION: "{user_message}"
    """

    try:
        response = model.generate_content(prompt)
        bot_response = response.text
        return jsonify({"reply": bot_response})
        
    except Exception as e:
        print(f"An Google AI API call error occurred: {e}")
        return jsonify({"error": "There was an issue communicating with the Google AI service."}), 500