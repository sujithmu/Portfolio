import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import AzureOpenAI # Import the Azure-specific client

app = Flask(__name__)
CORS(app)

# --- NEW: Configure the Azure OpenAI Client ---
try:
    # Load all required credentials from environment variables
    azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    api_key = os.getenv("AZURE_OPENAI_API_KEY")
    deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")

    if not all([azure_endpoint, api_key, deployment_name]):
        raise ValueError("One or more Azure OpenAI environment variables are not set.")

    # Initialize the client for Azure OpenAI
    client = AzureOpenAI(
        azure_endpoint=azure_endpoint,
        api_key=api_key,
        api_version="2024-02-01"  # A recent, stable API version
    )
except Exception as e:
    print(f"ERROR: Failed to configure Azure OpenAI client. Error: {e}")
    client = None

# Load the personal context from the file
personal_context = "Default context: Sujith is a software engineer. The context file was not found."
try:
    context_path = os.path.join(os.path.dirname(os.path.realpath(__file__)), '..', 'context.txt')
    with open(context_path, 'r', encoding='utf-8') as f:
        personal_context = f.read()
except Exception as e:
    print(f"ERROR: Could not read context.txt. Searched at path: {context_path}. Error: {e}")


@app.route('/api/chat', methods=['POST'])
def chat_handler():
    if not client:
        return jsonify({"error": "The AI assistant is not configured correctly. Check server logs."}), 500

    user_message = request.json.get('message')
    if not user_message:
        return jsonify({"error": "Message is required"}), 400

    try:
        # The API call to Azure OpenAI
        completion = client.chat.completions.create(
            # IMPORTANT: Use the 'model' parameter to specify your deployment name
            model=os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME"), 
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
        print(f"An Azure OpenAI API call error occurred: {e}")
        return jsonify({"error": "There was an issue communicating with the Azure AI service."}), 500