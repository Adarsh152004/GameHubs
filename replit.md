# Mini Games Collection

## Overview

A Flask-based web application featuring five interactive mini-games with AI integration. The application provides a game collection platform where users can play various brain-teasing games including word guessing, AI detection, memory challenges, drawing tasks, and pattern recognition. Each game tracks scores and completion status, with a unified interface for navigation and gameplay.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask with Python 3.x
- **Structure**: Modular design with separate route handlers for each game endpoint
- **Session Management**: Flask sessions with configurable secret keys
- **AI Integration**: OpenAI GPT-4o integration through dedicated AI service module with fallback mechanisms
- **Middleware**: ProxyFix for proper header handling in production environments

### Frontend Architecture
- **Template Engine**: Jinja2 templating with base template inheritance
- **Styling**: Bootstrap 5 CSS framework with custom CSS overrides
- **JavaScript**: Vanilla JavaScript with class-based game logic
- **Game Structure**: Each game implements a dedicated JavaScript class handling game state, logic, and UI updates
- **Responsive Design**: Mobile-first approach using Bootstrap grid system

### Data Storage
- **Client-side**: localStorage for game history and win counters
- **Session Storage**: Flask sessions for temporary game state
- **No Database**: Application runs without persistent server-side storage

### Game Implementation Pattern
Each game follows a consistent pattern:
- Dedicated HTML template extending base layout
- JavaScript class managing game state and logic
- Score tracking and completion detection
- Congratulations modal system for game completion
- Consistent UI/UX with status indicators and controls

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