# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Add your Gemini API key:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_actual_api_key_here
   ```
   
   To get a Gemini API key:
   - Go to https://makersuite.google.com/app/apikey
   - Create a new API key
   - Copy and paste it into `.env.local`

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to http://localhost:3000

## Project Structure

```
app/
├── components/          # React components
│   ├── Calculator.tsx  # Main calculator UI
│   ├── AIInput.tsx     # AI query input box
│   ├── HistoryPanel.tsx # Calculation history
│   ├── Display.tsx     # Calculator display screen
│   └── Button.tsx      # Calculator button component
├── context/            # React Context for state
│   └── CalculatorContext.tsx
├── lib/                # Utility functions
│   ├── gemini.ts       # Gemini API integration
│   ├── calculator.ts   # Math evaluation logic
│   └── history.ts      # History management
├── hooks/              # Custom React hooks
│   └── useAnimation.ts # Animation logic
├── types/              # TypeScript type definitions
│   └── calculator.ts
├── page.tsx            # Main app page
└── layout.tsx          # Root layout
```

## Features Implemented

✅ Dual Input System (Manual + AI)
✅ Animated Key Presses
✅ Normal & Scientific Calculator Modes
✅ History Panel with LocalStorage
✅ Gemini AI Integration
✅ Animation Speed Control
✅ Safe Math Evaluation

## Usage Examples

### AI Queries
- "15% tip on $85"
- "Square root of 144"
- "What's 25% of 80"
- "Sine of 30 degrees"
- "Convert 50 miles to km"

### Manual Calculator
- Click buttons directly like a normal calculator
- Switch between Normal and Scientific modes
- Use memory functions (M+, M-, MR, MC)

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing React types, run:
```bash
npm install
```

### Gemini API Errors
- Make sure your API key is set in `.env.local`
- Check that the key is valid and has proper permissions
- Ensure the key starts with `NEXT_PUBLIC_` prefix

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

