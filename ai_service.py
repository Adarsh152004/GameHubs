import os
import json
import random
import logging
from openai import OpenAI

# the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
# do not change this unless explicitly requested by the user
OPENAI_MODEL = os.environ.get("OPENAI_MODEL", "gpt-4o")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

# Initialize OpenAI client if API key is available
openai_client = None
if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
        logging.info("OpenAI client initialized successfully")
    except Exception as e:
        logging.error(f"Failed to initialize OpenAI client: {e}")

def generate_ai_text(prompt, difficulty=1):
    """
    Generate AI text with fallback mechanisms
    
    Args:
        prompt: The prompt for text generation
        difficulty: Difficulty level (1-6) for Turing Test rounds
    
    Returns:
        Generated text string
    """
    
    # Try OpenAI API first
    if openai_client:
        try:
            # Adjust prompt based on difficulty for Turing Test
            system_prompt = "You are a helpful assistant. Respond naturally and conversationally."
            
            if difficulty > 3:
                system_prompt += " Try to sound more human-like by using casual language, avoiding overly formal responses, and varying your sentence structure."
            
            if difficulty > 4:
                system_prompt += " Use mild slang occasionally and don't always be perfectly grammatical."
            
            response = openai_client.chat.completions.create(
                model=OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.7 + (difficulty * 0.1)  # Increase randomness with difficulty
            )
            
            content = response.choices[0].message.content
            return content.strip() if content else "I understand what you're asking about."
            
        except Exception as e:
            logging.error(f"OpenAI API error: {e}")
    
    # Fallback to pseudo-generator
    return generate_pseudo_text(prompt, difficulty)

def generate_pseudo_text(prompt, difficulty=1):
    """
    Fallback pseudo text generator for when OpenAI is unavailable
    """
    
    # Simple template-based responses for common Turing Test prompts
    responses = {
        "funny": [
            "Haha, that's pretty hilarious! Made me chuckle.",
            "Oh wow, that's actually really funny. Good one!",
            "That got a genuine laugh out of me, thanks for sharing.",
            "LOL that's amazing. Where did you hear that?",
            "That's comedy gold right there. Love it!"
        ],
        "weather": [
            "It's been pretty nice lately, actually enjoying it.",
            "Can't complain about the weather today, perfect for being outside.",
            "Weather's been decent, though I wish it was a bit warmer.",
            "Pretty typical for this time of year, nothing too crazy.",
            "Love this kind of weather - not too hot, not too cold."
        ],
        "food": [
            "I'm always down for some good food, what's your favorite?",
            "Food is definitely one of life's great pleasures.",
            "Can't go wrong with a good meal, especially with friends.",
            "I love trying new restaurants and cuisines.",
            "Good food just makes everything better, doesn't it?"
        ],
        "default": [
            "That's an interesting point, I hadn't thought of it that way.",
            "Yeah, I can definitely see what you mean there.",
            "That makes a lot of sense when you put it like that.",
            "Interesting perspective, thanks for sharing that with me.",
            "I appreciate you bringing that up, good point."
        ]
    }
    
    # Determine response category based on prompt keywords
    prompt_lower = prompt.lower()
    category = "default"
    
    if any(word in prompt_lower for word in ["funny", "joke", "laugh", "humor"]):
        category = "funny"
    elif any(word in prompt_lower for word in ["weather", "rain", "sunny", "cold", "hot"]):
        category = "weather"
    elif any(word in prompt_lower for word in ["food", "eat", "restaurant", "meal", "cooking"]):
        category = "food"
    
    # Select random response from category
    response = random.choice(responses[category])
    
    # Modify response based on difficulty to make it more obviously AI-like for lower difficulties
    if difficulty <= 2:
        response = response.replace("I'm", "I am").replace("can't", "cannot").replace("don't", "do not")
        response = "As an AI, I would say that " + response.lower()
    elif difficulty == 3:
        response = "I think " + response
    
    return response
