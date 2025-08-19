import os
import logging
from flask import Flask, render_template, request, jsonify, session
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
    """Home page with difficulty selection and game grid"""
    return render_template('home.html')

@app.route('/set-difficulty/<difficulty>')
def set_difficulty(difficulty):
    """Set game difficulty level"""
    if difficulty in ['easy', 'medium', 'hard']:
        session['difficulty'] = difficulty
    return render_template('games.html', difficulty=session.get('difficulty', 'medium'))

@app.route('/games')
def games():
    """Games selection page"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('games.html', difficulty=difficulty)

# Original 5 Games (Cosmic-themed versions)
@app.route('/reverse-google')
def reverse_google():
    """Original Reverse Google game with cosmic theme"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('reverse_google.html', difficulty=difficulty)

@app.route('/turing-test')
def turing_test():
    """Original Turing Test game with cosmic theme"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('turing_test.html', difficulty=difficulty)

@app.route('/gesture-memory')
def gesture_memory():
    """Original Gesture Memory game with cosmic theme"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('gesture_memory.html', difficulty=difficulty)

@app.route('/reverse-drawing')
def reverse_drawing():
    """Original Reverse Drawing game with cosmic theme"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('reverse_drawing.html', difficulty=difficulty)

@app.route('/black-box')
def black_box():
    """Original Black Box game with cosmic theme"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('black_box.html', difficulty=difficulty)

# Upgraded Cosmic Games
@app.route('/quantum-decrypt')
def quantum_decrypt():
    """Quantum word decryption game (upgraded reverse-google)"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('quantum_decrypt.html', difficulty=difficulty)

@app.route('/neural-turing')
def neural_turing():
    """Neural Turing Test AI detection game"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('neural_turing.html', difficulty=difficulty)

@app.route('/cosmic-memory')
def cosmic_memory():
    """Cosmic Memory constellation sequence game"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('cosmic_memory.html', difficulty=difficulty)

@app.route('/void-draw')
def void_draw():
    """Void Drawing in space with gravity effects"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('void_draw.html', difficulty=difficulty)

@app.route('/matrix-crack')
def matrix_crack():
    """Matrix Code Cracking pattern game"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('matrix_crack.html', difficulty=difficulty)

# New Unique Games
@app.route('/spell-weave')
def spell_weave():
    """Spell Weaver - combine magical elements in correct order"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('spell_weave.html', difficulty=difficulty)

@app.route('/time-paradox')
def time_paradox():
    """Time Paradox - solve temporal logic puzzles"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('time_paradox.html', difficulty=difficulty)

@app.route('/binary-oracle')
def binary_oracle():
    """Binary Oracle - decode alien binary messages"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('binary_oracle.html', difficulty=difficulty)

@app.route('/quantum-maze')
def quantum_maze():
    """Quantum Maze - navigate through shifting dimensions"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('quantum_maze.html', difficulty=difficulty)

@app.route('/cosmic-riddle')
def cosmic_riddle():
    """Cosmic Riddle - answer universe's most perplexing questions"""
    difficulty = session.get('difficulty', 'medium')
    return render_template('cosmic_riddle.html', difficulty=difficulty)

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
