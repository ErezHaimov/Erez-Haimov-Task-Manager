// Application State
let tasks = [];
let currentFilter = "all";
let currentLang = "en";
let sortAscending = true;

// Translations Data
const translations = {
	en: {
		pageTitle: "Task Manager | Erez Haimov",
		title: "Task Manager",
		inputPlaceholder: "Task Details",
		addBtn: "Add Task",
		all: "All",
		completed: "Completed",
		active: "Active",
		sort: "Sort by Due Date",
		undo: "Undo",
		done: "Done",
		delete: "Delete",
		alert: "Please fill all fields",
		contactTitle: "Contact/Follow Me",
		copyright: "© 2026 Erez Haimov | All Rights Reserved",
	},
	he: {
		pageTitle: "מנהל משימות | ארז חיימוב",
		title: "מנהל משימות",
		inputPlaceholder: "פרטי המשימה",
		addBtn: "הוסף משימה",
		all: "הכל",
		completed: "הושלמו",
		active: "פעילות",
		sort: "מיין לפי תאריך יעד",
		undo: "בטל",
		done: "בוצע",
		delete: "מחק",
		alert: "נא למלא את כל השדות",
		contactTitle: "צרו קשר / עקבו אחריי",
		copyright: "© 2026 ארז חיימוב | כל הזכויות שמורות",
	},
};

// DOM Elements
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const sortDateBtn = document.getElementById("sortDateBtn");
const langToggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const flagIcon = document.getElementById("flag-icon");
const toTopBtn = document.getElementById("toTopBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

// Updates UI text based on current language
function updateUIStrings() {
	const t = translations[currentLang];
	document.title = t.pageTitle;
	document.getElementById("ui-title").textContent = t.title;
	taskInput.placeholder = t.inputPlaceholder;
	addTaskBtn.textContent = t.addBtn;
	document.getElementById("filter-all").textContent = t.all;
	document.getElementById("filter-completed").textContent = t.completed;
	document.getElementById("filter-active").textContent = t.active;
	sortDateBtn.textContent = t.sort;
	document.getElementById("ui-contact-title").textContent = t.contactTitle;
	document.getElementById("ui-copyright").textContent = t.copyright;

	flagIcon.src =
		currentLang === "en"
			? "https://flagcdn.com/w40/il.png"
			: "https://flagcdn.com/w40/us.png";

	renderTasks();
}

// ===== Local Storage Functions =====

function getTasks() {
	const stored = localStorage.getItem("tasks");
	return stored ? JSON.parse(stored) : [];
}

function saveTasks(tasksToSave) {
	localStorage.setItem("tasks", JSON.stringify(tasksToSave));
}

function saveAndRender() {
	saveTasks(tasks);
	renderTasks();
}

// ===== Core App Logic =====

// addTask(): Handles adding a new task with a unique ID
function addTask() {
	const text = taskInput.value.trim();
	const date = taskDate.value;

	if (!text || !date) {
		alert(translations[currentLang].alert);
		return;
	}

	const newTask = {
		id: Date.now(), // Generate numerical ID
		text: text,
		dueDate: date,
		completed: false,
	};

	tasks.push(newTask);
	saveAndRender();

	taskInput.value = "";
	taskDate.value = "";
}

// filterTasks(): Returns a filtered array based on currentFilter
function filterTasks(tasksArray, filter) {
	switch (filter) {
		case "completed":
			return tasksArray.filter((task) => task.completed);
		case "active":
			return tasksArray.filter((task) => !task.completed);
		case "all":
		default:
			return tasksArray;
	}
}

// sortTasks(): Sorts tasks by due date (Toggle between Asc and Desc)
function sortTasks(tasksArray, ascending) {
	return tasksArray.sort((a, b) => {
		const dateA = new Date(a.dueDate);
		const dateB = new Date(b.dueDate);
		return ascending ? dateA - dateB : dateB - dateA;
	});
}

// renderTasks(): Updates the UI list and attaches listeners dynamically
function renderTasks() {
	taskList.innerHTML = "";
	const t = translations[currentLang];
	const filtered = filterTasks(tasks, currentFilter);

	filtered.forEach((task) => {
		const li = document.createElement("li");
		li.className = `task-item ${task.completed ? "completed" : ""}`;

		li.innerHTML = `
			<span class="task-text">${task.text}</span>
			<span class="task-date">${task.dueDate}</span>
			<div class="task-buttons">
				<button class="done-btn" data-id="${task.id}">
					${task.completed ? t.undo : t.done}
				</button>
				<button class="delete-btn" data-id="${task.id}">
					${t.delete}
				</button>
			</div>
		`;

		// Select buttons within the created LI
		const doneBtn = li.querySelector(".done-btn");
		const deleteBtn = li.querySelector(".delete-btn");

		// Add event listeners using dataset.id
		doneBtn.addEventListener("click", (event) => {
			const taskId = Number(event.currentTarget.dataset.id); // Convert string to number
			toggleTask(taskId);
		});

		deleteBtn.addEventListener("click", (event) => {
			const taskId = Number(event.currentTarget.dataset.id); // Convert string to number
			deleteTask(taskId);
		});

		taskList.appendChild(li);
	});
}

// ===== Task Management Helpers =====

// toggleTask(): Finds task by ID and toggles completion status
function toggleTask(id) {
	// Ensure both IDs are numbers for accurate comparison
	const task = tasks.find((t) => Number(t.id) === Number(id));
	if (task) {
		task.completed = !task.completed;
		saveAndRender();
	}
}

// deleteTask(): Filters out the task with the given ID
function deleteTask(id) {
	// Ensure both IDs are numbers for accurate comparison
	tasks = tasks.filter((t) => Number(t.id) !== Number(id));
	saveAndRender();
}

// fetchInitialTasks(): Fetches 5 tasks from external API if storage is empty
async function fetchInitialTasks() {
	try {
		const res = await fetch(
			"https://jsonplaceholder.typicode.com/todos?_limit=5",
		);

		// Check if response status is OK (200-299)
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await res.json();

		// Map API data to our application's object structure
		tasks = data.map((item) => ({
			id: item.id, // Using the API's unique numerical ID
			text: item.title,
			dueDate: new Date().toISOString().split("T")[0],
			completed: item.completed,
		}));

		saveTasks(tasks);
		renderTasks();
	} catch (e) {
		console.error("API failed", e);
	}
}

// ===== Event Listeners =====

// Handle Add Task
addTaskBtn.addEventListener("click", addTask);

// Handle Language Switch
langToggle.addEventListener("click", () => {
	currentLang = currentLang === "en" ? "he" : "en";

	// Save preference
	localStorage.setItem("lang", currentLang);
	updateUIStrings();
});

// Handle Theme Switch (Dark/Light)
themeToggle.addEventListener("click", () => {
	const isDark = document.body.getAttribute("data-theme") === "dark";
	const newTheme = isDark ? "light" : "dark";

	document.body.setAttribute("data-theme", newTheme);
	themeToggle.textContent = isDark ? "🌙" : "☀️";

	// Save preference
	localStorage.setItem("theme", newTheme);
});

// Handle Sorting
sortDateBtn.addEventListener("click", () => {
	sortAscending = !sortAscending;

	tasks = sortTasks(tasks, sortAscending);
	saveAndRender();
});

// Handle Filtering
filterBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		filterBtns.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
		currentFilter = btn.dataset.filter;
		renderTasks();
	});
});

// Show/Hide "To Top" button on scroll
window.addEventListener("scroll", () => {
	if (window.scrollY > 300) toTopBtn.classList.add("show");
	else toTopBtn.classList.remove("show");
});

// ===== Initialize App =====
window.onload = async () => {
	// 1. Load Tasks
	tasks = getTasks();

	// 2. Load and Apply Theme
	const savedTheme = localStorage.getItem("theme") || "light";
	document.body.setAttribute("data-theme", savedTheme);
	themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

	// 3. Load and Apply Language
	currentLang = localStorage.getItem("lang") || "en";

	// 4. Fetch from API only if LocalStorage is empty
	if (tasks.length === 0) {
		await fetchInitialTasks();
	}

	// 5. Update UI (This will also call renderTasks)
	updateUIStrings();
};
