# CausalFunnel Quiz Application

## Overview
This is a responsive Quiz Application built with React and Tailwind CSS. It fetches 15 questions from the Open Trivia Database and includes a 30-minute timer, question navigation, and a detailed results report.

## Features
- **Dynamic Quiz:** Fetches random questions from an external API.
- **Timer:** Auto-submits after 30 minutes.
- **Navigation:** Jump to any question; track visited/attempted status.
- **Responsive Design:** Works on Mobile and Desktop.
- **Bonus:** Smooth fade-in animations and "Clear Selection" functionality.

## Setup Instructions
1. Clone the repository: `git clone [YOUR_REPO_LINK]`
2. Navigate to the directory: `cd frontend`
3. Install dependencies: `npm install`
4. Run the app: `npm start`

## Challenges & Assumptions
- **Assumption:** Since no backend was required, user state is managed in-memory using React State.
- **Challenge:** Handling HTML entities from the API (e.g., `&quot;`) required using `dangerouslySetInnerHTML`.