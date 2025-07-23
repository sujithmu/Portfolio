import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("ERROR: OPENAI_API_KEY environment variable not found.")
    client = None
else:
    client = OpenAI(api_key=api_key)

personal_context = "Default context: Sujith is a software engineer. The main context file was not found."
try:
    context_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'context.txt')
    with open(context_path, 'r', encoding='utf-8') as f:
        personal_context = f.read()
except Exception as e:
    print(f"ERROR: Could not read context.txt. Searched at path: {context_path}. Error: {e}")


@app.route('/api/chat', methods=['POST'])
def chat_handler():
    if not client:
        return jsonify({"error": "The AI assistant is not configured correctly (API key might be missing)."}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a helpful chatbot for Sujith's portfolio. Answer questions ONLY based on the context below. If the answer isn't in the context, say so politely.

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
        print(f"An OpenAI API call error occurred: {e}")
        return jsonify({"error": "There was an issue communicating with the OpenAI service."}), 500