import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

# Initialize Flask app
app = Flask(__name__)
CORS(app) # Enable Cross-Origin Resource Sharing

# Initialize OpenAI client using the environment variable
# Vercel will provide this from your project settings
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) 

# Construct the path to context.txt relative to the api directory
context_path = os.path.join(os.path.dirname(__file__), '..', 'context.txt')
try:
    with open(context_path, 'r', encoding='utf-8') as f:
        personal_context = f.read()
except FileNotFoundError:
    personal_context = "Sujith is a software engineer. Detailed context is currently unavailable."

# Define the API route. The name of the file (chat.py) makes the endpoint /api/chat
@app.route('/api/chat', methods=['POST'])
def chat_handler():
    user_message = request.json.get('message')

    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # The API call to OpenAI
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a friendly and professional chatbot for Sujith's portfolio. 
                    Your purpose is to answer questions about Sujith based ONLY on the context provided below. 
                    If a question is asked that cannot be answered from the context, politely state that you don't have that specific information.
                    Do not make up answers. Keep your responses concise and helpful.

                    --- CONTEXT ---
                    {personal_context}
                    --- END CONTEXT ---
                    """
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ]
        )
        
        bot_response = completion.choices[0].message.content
        return jsonify({"reply": bot_response})

    except Exception as e:
        print(f"An OpenAI API error occurred: {e}")
        return jsonify({"error": "Sorry, I'm having trouble connecting to my brain right now."}), 500