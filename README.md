# Erez Haimov - Task Manager Project

This Task Manager project demonstrates a **production-minded frontend approach** to application development.
Beyond front-end design, it involves **API integration** to fetch and map external data, complex **state management** for CRUD operations, and persistent data storage using **LocalStorage**.
It highlights my ability to build a fully functional application that bridges the gap between raw data and a responsive, user-centric interface.

## Useful navigation

- [Overview](#overview)
    - [The challenge](#the-challenge)
    - [Screenshot](#screenshot)
    - [Links](#links)
- [Getting Started](#getting-started)
- [Features](#features)
- [My process](#my-process)
    - [Technologies](#technologies)
    - [Ongoing Development](#ongoing-development)
    - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### The challenge

- **CRUD & Persistence:** Implement Create, Read, Update, and Delete functionality with LocalStorage to ensure data survives page refreshes.
- **API Integration:** Fetch initial data from external REST APIs and map it into the application's internal data structure.
- **Dynamic UI:** Develop a theme switcher (Dark/Light mode) and a multi-language toggle (English/Hebrew) that persist across sessions.
- **Data Organization:** Implement sorting (by due date) and filtering logic (All/Active/Completed) to manage task lists efficiently.
- **Responsive Grid Design:** Utilize CSS Grid for a structured, column-based layout that remains fluid across mobile and desktop devices.
- **Accessibility:** Ensure the application is keyboard-navigable, uses semantic HTML, and provides sufficient color contrast in both themes.

### Screenshot

![Site Screenshot](pictures/Screenshots/site-screenshot.png)

### Links

- Live Site URL: [https://erezhaimov.github.io/Erez-Haimov-Task-Manager/](https://erezhaimov.github.io/Erez-Haimov-Task-Manager/)

## Getting Started

Clone the repository and open `index.html` in your browser. No build tools or dependencies required.

```bash
git clone https://github.com/ErezHaimov/Erez-Haimov-Task-Manager.git
```

## Features

- Add, complete, and delete tasks
- Filter tasks by All / Active / Completed
- Sort tasks by due date (ascending/descending)
- Dark/Light mode with persistence across sessions
- English/Hebrew language toggle with persistence
- Responsive design for mobile and desktop
- Initial task data fetched from an external API (JSONPlaceholder)
- XSS-safe DOM rendering using `textContent`
- Keyboard support (Enter key to add tasks)

## My process

### Technologies

- **Semantic HTML5** – For clear document structure and improved SEO/Accessibility.
- **Modern CSS (Grid & Flexbox)** – Used for the multi-column task layout and responsive alignment.
- **CSS Variables & Clamp()** – To maintain a dynamic, scalable design system and seamless theme switching.
- **Vanilla JavaScript (ES6+)** – For core application logic, asynchronous API calls (Fetch), and DOM manipulation.
- **LocalStorage API** – For client-side data persistence and preference saving (Theme/Language/Sort Direction).
- **Bootstrap 5** – For base styling utilities and alert components.
- **Bootstrap Icons** – For intuitive UI iconography.

### Ongoing Development

I plan to extend this project with the following improvements:

- Task editing (inline or via modal)
- Drag-and-drop reordering
- Due date color indicators (e.g. overdue tasks highlighted in red)
- Unit tests for core logic functions

### Useful resources

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - Used for fetching initial task data.
- [Bootstrap](https://getbootstrap.com/) - For base styling and utility classes.
- [Bootstrap Icons](https://icons.getbootstrap.com/) - For intuitive UI iconography.
- [FlagCDN](https://flagcdn.com/) - For the language toggle icons.
- [Google Fonts](https://fonts.google.com/) - Specifically the "Inter" font family for modern typography.

## Author

- GitHub - [ErezHaimov](https://github.com/ErezHaimov)
- LinkedIn - [erez-haimov](https://www.linkedin.com/in/erez-haimov/)
