# Autocalcy - AI-Powered Calculator

A modern calculator web app that understands natural language math questions and animates the calculation process, making it appear as if an invisible hand is operating the calculator.

## Features

### Core Features
- **Dual Input System**: Manual calculator buttons + AI natural language input
- **Animated Calculations**: Watch calculator keys light up and animate when AI solves problems
- **Normal & Scientific Modes**: Switch between basic and advanced calculator functions
- **History Panel**: Save and replay all calculations
- **Smart AI Processing**: Uses Google Gemini AI to understand natural language queries

### Example Queries
- "What's 15% tip on $45"
- "Square root of 144"
- "Convert 50 miles to km"
- "Sine of 30 degrees"
- "25% of 80"

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Gemini AI** - Natural language processing
- **React Context** - State management

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd autocalcy
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
├── components/          # React components
│   ├── Calculator.tsx   # Main calculator UI
│   ├── AIInput.tsx      # AI query input
│   ├── HistoryPanel.tsx # Calculation history
│   ├── Display.tsx      # Calculator display
│   └── Button.tsx       # Calculator button
├── context/             # React Context
│   └── CalculatorContext.tsx
├── lib/                 # Utilities
│   ├── gemini.ts        # Gemini API integration
│   ├── calculator.ts    # Math evaluation
│   └── history.ts       # History management
├── hooks/               # Custom hooks
│   └── useAnimation.ts  # Animation logic
└── types/               # TypeScript types
    └── calculator.ts
```

## Usage

### Manual Mode
Click calculator buttons directly like a normal calculator.

### AI Mode
Type natural language questions in the AI input box:
- "15% tip on $85"
- "Square root of 144"
- "What's 25% of 80"

The AI will:
1. Parse your question
2. Generate a mathematical expression
3. Animate the calculator buttons being pressed
4. Display the result

### History
- View all past calculations
- Replay animations
- Copy results
- Delete entries

## Animation Speed

Control animation speed in Settings:
- **Slow**: 300ms per key (educational)
- **Normal**: 150ms per key (default)
- **Fast**: 50ms per key
- **Instant**: No animation

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

MIT

