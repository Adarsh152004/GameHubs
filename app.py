import os
import logging
from flask import Flask, render_template, request, jsonify
from ai_service import generate_ai_text
from werkzeug.middleware.proxy_fix import ProxyFix

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Create Flask app
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

@app.route('/')
def home():
    """Home page with game selection grid"""
    return render_template('home.html')

@app.route('/reverse-google')
def reverse_google():
    """Reverse Google word guessing game"""
    return render_template('reverse_google.html')

@app.route('/turing-test')
def turing_test():
    """Turing Test AI detection game"""
    return render_template('turing_test.html')

@app.route('/gesture-memory')
def gesture_memory():
    """Gesture Memory emoji sequence game"""
    return render_template('gesture_memory.html')

@app.route('/reverse-drawing')
def reverse_drawing():
    """Reverse Drawing inverted cursor game"""
    return render_template('reverse_drawing.html')

@app.route('/black-box')
def black_box():
    """Black Box mathematical pattern game"""
    return render_template('black_box.html')

@app.route('/api/ai/generate', methods=['POST'])
def api_generate_ai():
    """API endpoint for AI text generation"""
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({'error': 'Missing prompt in request'}), 400
        
        prompt = data['prompt']
        difficulty = data.get('difficulty', 1)
        
        response_text = generate_ai_text(prompt, difficulty)
        return jsonify({'text': response_text})
        
    except Exception as e:
        logging.error(f"AI generation error: {e}")
        return jsonify({'error': 'AI generation failed'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
