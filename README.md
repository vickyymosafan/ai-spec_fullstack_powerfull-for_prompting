# vickymosafan - Autonomous Architect AI v4.2

**vickymosafan** is an advanced AI-powered Engineering Singularity and CTO simulator designed to generate, visualize, and manage enterprise-grade software architectures. It acts as an autonomous entity capable of designing complex systems, generating code specifications, and simulating system load.

## 🚀 Core Capabilities

- **Neural Architecture Generation**: Describe your system (e.g., "Scalable E-commerce with Microservices"), and Vicky generates a complete topology map with nodes (Services, Databases, Gateways, Queues) and communication edges.
- **Interactive Terminal Console**: A command-line inspired chat interface to refine requirements, ask technical questions, and trigger system generations.
- **Visual Topology Map**: Interactive, physics-based graph visualization powered by D3.js. Supports dragging, zooming, and node inspection.
- **Deep Specifications**: Automatically generates detailed markdown documentation for:
  - **PRD**: User Stories & Gherkin Syntax (GIVEN/WHEN/THEN).
  - **Frontend**: Component architecture, State management strategies, and Tech stack specific details.
  - **Backend**: API Patterns, Gateway configurations, and Database Schemas.
  - **Infrastructure**: Cloud strategy and resource allocation.
- **Real-time Simulation Hub**: Visualizes simulated load, latency, and error rates to predict bottlenecks before implementation.
- **Project Roadmap**: Integrated task management system to track implementation progress with due dates and priorities.
- **Vicky Visual Engine**: A powerful theme editor allowing real-time modification of the entire UI's color palette, typography, radius, and spacing using OKLCH color spaces.

## 🛠️ Tech Stack

- **Core**: React 18, TypeScript
- **Styling**: Tailwind CSS, CSS Variables (Real-time injection)
- **Visualization**: D3.js (Force-directed graphs), Recharts (Time-series data)
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown, Remark GFM

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/vickymosafan.git
   cd vickymosafan
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   This application requires a Google Gemini API Key to function. 
   
   *Note: In the current WebContainer environment, the API key is injected via `process.env.API_KEY` automatically.*
   
   For local development, create a `.env` file:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

## 🎮 How to Use

1. **Initialize**: Upon load, navigate to the **Console AI** tab.
2. **Prompt the Singularity**: Enter a prompt describing your desired system.
   - *Example A*: "Build a ride-sharing app backend using Go and gRPC."
   - *Example B*: "Design a React dashboard for financial analytics with real-time sockets."
3. **Analyze the Blueprint**:
   - **Dashboard**: View high-level metrics and security reports.
   - **Topology Map**: Inspect the architecture visually. Click nodes to see deep analysis.
   - **Code Specs**: Copy generated specifications for development.
   - **Roadmap**: Add tasks to the generated roadmap to start execution.
4. **Customize**: Click **System Config** to modify the interface appearance or test responsive viewports.

## 🎨 Theme Engine

Vicky includes a sophisticated theming system located in the **System Config** panel.
- **Presets**: Quickly switch between curated themes.
- **Detailed Control**: Adjust OKLCH values for Primary, Sidebar, Charts, and semantic colors.
- **Typography**: Switch between fonts like Rajdhani, JetBrains Mono, and Inter.
- **Viewport Simulator**: Test the UI layout on Mobile, Tablet, and Desktop resolutions instantly.

## 📄 License

MIT License.
