from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def get_client():
    # Points to Groq API using the OpenAI Python SDK
    return OpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )

def get_insect_details(insect_name):
    """
    Get detailed information about an insect using Groq (Llama 3.3 70B)
    Returns: formatted string with insect information
    """
    prompt = f"""
Give detailed factual information about the insect "{insect_name}" in this exact format (do not include any other text):

Insect name: {insect_name}

1. Scientific name:
   [Scientific Name here]

2. Family:
   [Family Name here]

3. Physical description:
   [Detailed physical description here]

4. Habitat and food:
   [Where it lives and what it eats]

5. Harmful or beneficial:
   [Harmful/Beneficial and why]

6. Management or control measures:
   [How to manage or control this insect]

Use educational and clear language. Ensure each point is clearly separated.
"""

    try:
        client = get_client()
        
        # Use llama-3.3-70b-versatile for high-quality factual generation
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
            max_tokens=800
        )

        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq API Error: {e}")
        # Fallback information if API fails
        return f"""
Insect name: {insect_name}

1. Scientific name:
   Information not available (API error)

2. Family:
   Information not available

3. Physical description:
   Information not available

4. Habitat and food:
   Information not available

5. Harmful or beneficial:
   Information not available

6. Management or control measures:
   Information not available

Note: Please check your GROQ API key in the backend/.env file (labeled as OPENAI_API_KEY).
"""

# Test function
if __name__ == "__main__":
    print("Groq Insect Info Service (Llama 3.3 70B)")
    api_key = os.getenv('OPENAI_API_KEY')
    print(f"API Key loaded: {api_key is not None}")
    if api_key:
        print("Testing with 'Butterfly'...")
        result = get_insect_details("Butterfly")
        print("\nResponse:")
        print(result)
    else:
        print("ERROR: OPENAI_API_KEY not found in .env")
