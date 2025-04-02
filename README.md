# Cyberdesk Starter Assistant UI

A Next.js application that demonstrates how to build an AI assistant with virtual desktop control capabilities using the Cyberdesk API and Anthropic's Claude AI model.

## Features

- Interactive virtual desktop demo with streaming capabilities
- AI assistant chat interface powered by Claude 3.7 Sonnet
- Desktop control via AI (mouse clicks, keyboard input, screenshots)
- Bash command execution in the virtual environment
- Responsive design for both desktop and mobile devices

## Getting Started

To get started with this project, first install the npm dependencies:

```bash
npm install
```

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```
CYBERDESK_API_KEY=your_cyberdesk_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

You'll need to obtain a Cyberdesk API key to use the virtual desktop functionality.

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## How It Works

1. The application provides an interface to launch a virtual desktop
2. Once launched, you can interact with an AI assistant through the chat interface
3. The AI can control the virtual desktop, take screenshots, and execute commands
4. The virtual desktop stream is displayed in real-time

## Project Structure

- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components including the chat interface and desktop viewer
- `/src/utils` - Utility functions for interacting with the Cyberdesk API
- `/src/lib` - Shared libraries and helpers
- `/src/styles` - Global CSS and styling utilities

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for the frontend
- [Cyberdesk](https://cyberdesk.io) - Virtual desktop infrastructure
- [Assistant UI React](https://www.assistant-ui.com/) - UI components for the chat interface
- [AI SDK](https://sdk.vercel.ai/docs/guides/computer-use) - Tools for working with AI models
- [Anthropic Claude](https://www.anthropic.com/) - AI model for the assistant
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework


## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Learn More

To learn more about the technologies used in this project, see the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Cyberdesk API Documentation](https://docs.cyberdesk.io)
