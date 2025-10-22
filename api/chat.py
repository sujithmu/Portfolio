import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel('gemini-pro')
except Exception as e:
    print(f"ERROR: Failed to configure Gemini. Is GEMINI_API_KEY set? Error: {e}")
    model = None

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
        return jsonify({"error": "The AI assistant is not configured correctly (API key might be missing)."}), 500

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
        if 'prompt_feedback' in locals() and response.prompt_feedback.block_reason:
             return jsonify({"error": "My safety filters blocked this request. Please try a different question."}), 400
        return jsonify({"error": "There was an issue communicating with the Google AI service."}), 500