# Cosmic Games Terminal

## Overview

A Flask-based web application featuring ten interactive cosmic-themed mini-games with AI integration and difficulty selection. The application provides a dark space/universe/magic/coding aesthetic with terminal-style UI and command-line visual elements. Users can select difficulty levels (Easy/Medium/Hard) at startup that affect all games throughout their session. Features include mystical spell combinations, alien binary decoding, quantum word decryption, and other unique cosmic challenges.

## User Preferences

Preferred communication style: Simple, everyday language.
Theme preference: Dark space/universe/magic with coding/command line aesthetic.
Difficulty system: Global difficulty selection affecting all games.

## System Architecture

### Backend Architecture
- **Framework**: Flask with Python 3.x
- **Structure**: Modular design with separate route handlers for each game endpoint
- **Session Management**: Flask sessions with configurable secret keys
- **AI Integration**: OpenAI GPT-4o integration through dedicated AI service module with fallback mechanisms
- **Middleware**: ProxyFix for proper header handling in production environments

### Frontend Architecture
- **Template Engine**: Jinja2 templating with cosmic-themed base template inheritance
- **Styling**: Custom CSS cosmic theme with dark space/universe/magic aesthetics, terminal-style UI elements
- **JavaScript**: Vanilla JavaScript with class-based game logic and difficulty-aware gameplay
- **Game Structure**: Each game implements a dedicated JavaScript class with difficulty scaling and cosmic visual effects
- **Responsive Design**: Mobile-first approach with cosmic container design and animated elements

### Data Storage
- **Client-side**: localStorage for cosmic win counters and difficulty preferences
- **Session Storage**: Flask sessions for difficulty level and game state management
- **No Database**: Application runs without persistent server-side storage

### Game Implementation Pattern
Each game follows a cosmic-themed pattern:
- Dedicated HTML template extending cosmic base layout
- JavaScript class with difficulty-aware game mechanics
- Cosmic score tracking and quantum victory detection
- Cosmic success modal system with magical effects
- Consistent cosmic UI/UX with terminal-style status displays and animated elements
- Difficulty scaling affecting rounds, time limits, and complexity

### AI Service Architecture
- **Primary**: OpenAI Chat Completions API with GPT-4o model
- **Fallback**: Local pseudo-text generation when API unavailable
- **Difficulty Scaling**: Dynamic prompt modification based on game difficulty levels
- **Error Handling**: Graceful degradation with comprehensive error logging

## External Dependencies

### Third-party Services
- **OpenAI API**: GPT-4o model for AI text generation in Turing Test game
- **CDN Dependencies**: Bootstrap 5 CSS, Font Awesome icons

### Environment Configuration
- `OPENAI_API_KEY`: Required for AI text generation functionality
- `OPENAI_MODEL`: Configurable AI model (defaults to "gpt-4o")
- `SESSION_SECRET`: Flask session security key

### Frontend Libraries
- **Bootstrap 5**: UI component framework and responsive grid
- **Font Awesome**: Icon library for enhanced visual elements
- **Native Browser APIs**: Canvas API for drawing games, localStorage for persistence

### Game-specific Requirements
- **Reverse Google**: Predefined word clue database with alternative answers
- **Turing Test**: Dynamic AI response generation with difficulty progression
- **Gesture Memory**: Emoji sequence generation and validation
- **Reverse Drawing**: HTML5 Canvas for inverted cursor drawing mechanics
- **Black Box**: Mathematical rule engine with pattern recognition algorithms