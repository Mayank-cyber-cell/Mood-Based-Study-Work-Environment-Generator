
# 🌟 Mood-Based Study/Work Environment 

An innovative web application that tailors your study or work environment based on your current mood. Whether you're feeling stressed, tired, excited, or calm, this app adjusts the ambiance to enhance your productivity and focus.

---

## 🚀 Features

### Core Features
* **Mood Selection**: Choose from four moods — Calm, Stressed, Excited, Tired.
* **Dynamic Environment**:
  * **Background Music**: Mood-matching playlists with visual audio visualizer.
  * **Color Themes**: Adaptive color schemes and animated backgrounds that align with your selected mood.
  * **Motivational Quotes**: Inspirational quotes displayed in a beautiful interface.
  * **Pomodoro Timer**: Built-in focus timer with cycle tracking and visual progress indicators.
* **Responsive Design**: Optimized for both desktop and mobile devices with smooth animations.
* **Advanced Theme Toggle**: Light/Dark mode with system preference support and animated transitions.

### Analytics & Tracking
* **Session Tracking**: Automatically tracks your mood sessions with duration and activity metrics.
* **User Feedback System**: Rate your experience after each session with a 5-star rating and detailed feedback options.
* **Mood Analytics**: View 7-day activity summaries showing session counts, total time, and average ratings per mood.
* **Data Persistence**: All data is securely stored in Supabase with Row Level Security (RLS) enabled.

### User Experience
* **Smooth Transitions**: Beautiful animations and crossfade effects when switching moods.
* **Keyboard Shortcuts**: Quick access with number keys (1-4) for moods and hotkeys for controls.
* **Glass-morphism UI**: Modern design with frosted glass effects and subtle micro-interactions.
* **Real-time Progress**: Live tracking of timer cycles and session duration.

---

## 🎥 Demo

![App Demo](https://github.com/Mayank-cyber-cell/Mood-Based-Study-Work-Environment-Generator/blob/main/assets/demo.gif)

*Experience the app in action!*

---

## 🛠️ Technologies Used

* **Frontend**:
  * React 18 with TypeScript
  * Vite for fast development and building
  * Tailwind CSS for styling
  * Framer Motion for animations
  * shadcn/ui component library
  * Radix UI primitives
* **Backend & Database**:
  * Supabase for database, authentication, and real-time features
  * PostgreSQL with Row Level Security (RLS)
  * Automated database triggers for analytics
* **State Management**:
  * React Hooks for local state
  * Custom hooks for timer, theme, quotes, and sessions
* **APIs**:
  * YouTube embed for music playlists
  * Supabase REST API for data operations

---

## ⚙️ Installation

### Prerequisites

* Node.js (v18 or higher) and npm installed on your machine.
* A Supabase account (free tier available at https://supabase.com)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Mayank-cyber-cell/Mood-Based-Study-Work-Environment-Generator.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Mood-Based-Study-Work-Environment-Generator
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up Supabase:

   The database migrations are already configured. The Supabase connection is pre-configured in the `.env` file with connection details.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Build for production:

   ```bash
   npm run build
   ```

7. Open your browser and go to `http://localhost:5173` to view the app.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📢 Acknowledgements

* [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
* [ZenQuotes API](https://zenquotes.io/)
* [Capsule Render](https://capsule-render.vercel.app/) for the animated header

---

## 🌐 Demo Link

Try the live demo here: [Mood-Based Study/Work Environment Generator](https://mood-based-study-work-environment.netlify.app/)

---


## 📌 Notes

* The database schema includes automatic triggers for analytics aggregation.
* All user data is protected with Row Level Security (RLS) policies.
* The app supports both authenticated and anonymous usage for session tracking.
* For the best experience, use a modern browser with JavaScript enabled.
* Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 🎯 Keyboard Shortcuts

* **1-4**: Quickly select moods (Calm, Stressed, Excited, Tired)
* **Space**: Play/Pause music (when in mood environment)
* **P**: Start/Pause Pomodoro timer
* **Right-click theme toggle**: Access system theme option

---

## 📈 GitHub Stats

![GitHub Stats](https://github-readme-stats.vercel.app/api?username=Mayank-cyber-cell\&show_icons=true\&theme=radical)

---

## 🌟 Contributions

We welcome contributions to enhance this project. Please fork the repository, make your changes, and submit a pull request. For major changes, open an issue first to discuss what you would like to change.

---

## 📬 Contact

For any queries or suggestions, feel free to open an issue on the GitHub repository or reach out via email at [jimayank2105@gmail.com](mailto:jimayank2105@gmail.com).

---

*Let's create a personalized and motivating environment for every study or work session!*
