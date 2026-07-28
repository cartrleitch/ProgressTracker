**Vision**
Progress tracker app for tracking daily, weekly, monthly, and yearly progress on goals. App should encourage completing goals and building good habits as much as possible. Have streaks, fun animations, satisfying sounds, all the stuff.

**Tech stack**
Docker
|
PostgreSQL database
|
ASP.NET Core for backend API
|
Typescript/HTML/CSS
|
React

**Minimum viable product features**
CRUD functionality for goal items,
Each goal has a progress bar that resets each period (whether daily, monthly, weekly, or yearly). Progress bar then has - and + for incrementing by a set amount, or a check box for boolean goals, numerical input for time-based or other goals, etc.
When creating a goal, set its time period, unit (integer, boolean, whatever), description.
One page, dashboard where all goals are seen and can be CRUD from

**2nd tier features**
Goal priorities
Streaks completing daily, weekly, monthly, and yearly goals.
Dashboard organization features
Organize goals by completion period
Authentication and multi-user compatibility

**3rd tier features**
Collect badges for doing stuff.
Challenges and other things.
Mobile app

**Todo**
Scaffold the app, setting up ASP Core project, Docker, GitHub repo, etc.
Setup database for goal items.
Create backend for CRUD on goals items.
Create react components for basic goal items.
Account for goal items of different types.



**Notes**
Make it look good.
Apps like Duolingo are a good inspiration for the type of vibe of satisfying completion.

