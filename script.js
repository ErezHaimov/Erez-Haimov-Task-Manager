// ===== Application State =====
// Managed variables for tracking tasks, active filters, language, and sort order.
let tasks = [];
let currentFilter = "all";
let currentLang = "en";
let sortAscending = true;

// ===== Translations Dictionary =====
const translations = {
	// Contains all UI strings for English.
	en: {
		pageTitle: "Task Manager | Erez Haimov",
		title: "Task Manager",
		taskLabel: "Task Details",
		dateLabel: "Due Date",
		addBtn: "Add Task",
		all: "All",
		completed: "Completed",
		active: "Active",
		sort: "<span>Sort by Due Date</span> <span class='sort-arrow'>↑</span>",
		undo: "Undo",
		done: "Done",
		delete: "Delete",
		contactTitle: "Contact/Follow Me",
		copyright: "© 2026 Erez Haimov | All Rights Reserved",
		DismissAlert: "Dismiss",
		DismissSuccess: "Got it",
		TaskAdded: "Task added successfully!",
		TaskDeleted: "Task deleted successfully!",
		TaskToggled: "Task status updated successfully!",
		inputAlert: "Please fill all fields",
		errLoad: "Failed to load tasks from browser storage.",
		errSave: "Error saving data. Storage might be full.",
		errFetch: "Could not fetch tasks from the external server.",
		errToggle: "Task not found. Refresh and try again.",
		noConn: "No internet connection.",
	},
	// Contains all UI strings for Hebrew.
	he: {
		pageTitle: "מנהל משימות | ארז חיימוב",
		title: "מנהל משימות",
		taskLabel: "פרטי המשימה",
		dateLabel: "תאריך יעד",
		addBtn: "הוסף משימה",
		all: "הכל",
		completed: "הושלמו",
		active: "פעילות",
		sort: "<span>מיין לפי תאריך יעד</span> <span class='sort-arrow'>↑</span>",
		undo: "בטל",
		done: "בוצע",
		delete: "מחק",
		contactTitle: "צרו קשר / עקבו אחריי",
		copyright: "© 2026 ארז חיימוב | כל הזכויות שמורות",
		DismissAlert: "סגור",
		DismissSuccess: "הבנתי",
		TaskAdded: "המשימה נוספה בהצלחה!",
		TaskDeleted: "המשימה נמחקה בהצלחה!",
		TaskToggled: "סטטוס המשימה עודכן בהצלחה!",
		inputAlert: "נא למלא את כל השדות",
		errLoad: "שגיאה בטעינת המשימות מהדפדפן.",
		errSave: "שגיאה בשמירת הנתונים. ייתכן שהזיכרון מלא.",
		errFetch: "לא הצלחנו למשוך משימות מהשרת.",
		errToggle: "המשימה לא נמצאה. נסה לרענן.",
		noConn: "אין חיבור לאינטרנט.",
	},
};

// ===== DOM Elements =====
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
const errorContainer = document.getElementById("error-container");

// ===== UI Language =====

// Updates all UI text strings based on the current language selection.
// Also restores the sort arrow direction and re-renders the task list.
function updateUIStrings() {
	const t = translations[currentLang];
	document.title = t.pageTitle;
	document.getElementById("ui-title").textContent = t.title;
	document.getElementById("ui-task-label").textContent = t.taskLabel;
	document.getElementById("ui-date-label").textContent = t.dateLabel;
	addTaskBtn.textContent = t.addBtn;
	document.getElementById("filter-all").textContent = t.all;
	document.getElementById("filter-completed").textContent = t.completed;
	document.getElementById("filter-active").textContent = t.active;
	sortDateBtn.innerHTML = t.sort;
	document.getElementById("ui-contact-title").textContent = t.contactTitle;
	document.getElementById("ui-copyright").textContent = t.copyright;

	// Restore correct arrow direction after language change
	sortDateBtn.querySelector(".sort-arrow").textContent = sortAscending
		? "↑"
		: "↓";

	// Switch flag icon based on selected language
	flagIcon.src =
		currentLang === "en"
			? "https://flagcdn.com/w40/il.png"
			: "https://flagcdn.com/w40/us.png";

	renderTasks();
}

// ===== Alert System =====

// Displays a floating Bootstrap alert inside the error container.
// type: "danger" | "warning" | "success"
// duration: auto-dismiss after N seconds (null = stays until dismissed manually)
function showAlert(message, type = "danger", duration = null) {
	if (!errorContainer) return;

	const alertDiv = document.createElement("div");

	// Set base classes - removed Bootstrap fade/show to use custom CSS animations
	alertDiv.className = `alert alert-${type} shadow-lg`;
	alertDiv.role = "alert";

	let iconClass = "bi-exclamation-triangle-fill text-danger";
	let btnText = translations[currentLang].DismissAlert;

	if (type === "warning") {
		iconClass = "bi-exclamation-octagon-fill text-warning";
	} else if (type === "success") {
		iconClass = "bi-check-circle-fill text-success";
		btnText = translations[currentLang].DismissSuccess;
	}

	alertDiv.innerHTML = `
		<i class="bi ${iconClass} fs-4 me-3"></i>
		<div class="flex-grow-1">
			<span style="font-weight: 600; font-size: 0.95rem;">${message}</span>
		</div>
		<button type="button" class="custom-close-btn" onclick="closeAlert(this.parentElement)">
			${btnText}
		</button>
	`;

	errorContainer.appendChild(alertDiv);

	// Auto-dismiss the alert after the specified duration
	if (duration) {
		setTimeout(() => {
			closeAlert(alertDiv);
		}, duration * 1000);
	}
}

// Closes an alert with a slide-out animation before removing it from the DOM.
function closeAlert(element) {
	if (!element || element.classList.contains("alert-exit")) return;

	// Add the CSS class that triggers the slide-out animation
	element.classList.add("alert-exit");

	// Wait for the animation to finish (400ms) before removing from DOM
	setTimeout(() => {
		element.remove();
	}, 400);
}

// ===== Local Storage Management =====

// Retrieves the tasks array from LocalStorage and parses it from JSON.
// Returns an empty array if no data is found or if parsing fails.
function getTasks() {
	try {
		const stored = localStorage.getItem("tasks");
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		showAlert(translations[currentLang].errLoad);
		return [];
	}
}

// Serializes the tasks array to JSON and saves it to LocalStorage.
// Handles QuotaExceededError separately to show a specific message.
function saveTasks(tasksToSave) {
	try {
		localStorage.setItem("tasks", JSON.stringify(tasksToSave));
	} catch (e) {
		const msg =
			e.name === "QuotaExceededError"
				? translations[currentLang].errSave
				: "Save error";
		showAlert(msg);
	}
}

// Saves the current tasks array to LocalStorage and re-renders the task list.
function saveAndRender() {
	saveTasks(tasks);
	renderTasks();
}

// ===== Task Operations =====

// Validates inputs, creates a new task object, and adds it to the list.
function addTask() {
	const text = taskInput.value.trim();
	const date = taskDate.value;

	// Validate that both fields are filled before adding
	if (!text || !date) {
		showAlert(translations[currentLang].inputAlert, "warning", 5);
		return;
	}

	const newTask = {
		id: Date.now(),
		text,
		dueDate: date,
		completed: false,
	};

	tasks.push(newTask);
	saveAndRender();
	showAlert(translations[currentLang].TaskAdded, "success", 3);

	// Clear inputs after adding
	taskInput.value = "";
	taskDate.value = "";
}

// Returns a filtered copy of the tasks array based on completion status.
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

// Returns a sorted copy of the tasks array by due date (ascending or descending).
function sortTasks(tasksArray, ascending) {
	return [...tasksArray].sort((a, b) => {
		const dateA = new Date(a.dueDate);
		const dateB = new Date(b.dueDate);
		return ascending ? dateA - dateB : dateB - dateA;
	});
}

// Clears and re-renders the task list based on the current filter and sort order.
// Uses createElement + textContent (instead of innerHTML) to prevent XSS attacks.
function renderTasks() {
	taskList.innerHTML = "";
	const t = translations[currentLang];
	const filtered = sortTasks(
		filterTasks(tasks, currentFilter),
		sortAscending,
	);

	filtered.forEach((task) => {
		// Create list item
		const li = document.createElement("li");
		li.className = `task-item ${task.completed ? "completed" : ""}`;

		// Create task text span - using textContent to prevent XSS
		const textSpan = document.createElement("span");
		textSpan.className = "task-text";
		textSpan.textContent = task.text;

		// Create task date span - using textContent to prevent XSS
		const dateSpan = document.createElement("span");
		dateSpan.className = "task-date";
		dateSpan.textContent = new Date(
			task.dueDate + "T00:00:00",
		).toLocaleDateString();

		// Create buttons container
		const buttonsDiv = document.createElement("div");
		buttonsDiv.className = "task-buttons";

		// Create done button
		const doneBtn = document.createElement("button");
		doneBtn.className = "done-btn";
		doneBtn.dataset.id = task.id;
		doneBtn.textContent = task.completed ? t.undo : t.done;

		// Create delete button
		const deleteBtn = document.createElement("button");
		deleteBtn.className = "delete-btn";
		deleteBtn.dataset.id = task.id;
		deleteBtn.textContent = t.delete;

		// Assemble the task item and append to the list
		buttonsDiv.appendChild(doneBtn);
		buttonsDiv.appendChild(deleteBtn);
		li.appendChild(textSpan);
		li.appendChild(dateSpan);
		li.appendChild(buttonsDiv);
		taskList.appendChild(li);
	});
}
// ===== Task Management Helpers =====

// Toggles the completed status of a task by ID and saves the update.
function toggleTask(id) {
	const task = tasks.find((t) => t.id === id);
	if (task) {
		task.completed = !task.completed;
		saveAndRender();
		showAlert(translations[currentLang].TaskToggled, "success", 3);
	} else {
		showAlert(translations[currentLang].errToggle);
	}
}

// Removes a task from the array by ID and saves the update.
function deleteTask(id) {
	tasks = tasks.filter((t) => t.id !== id);
	saveAndRender();
	showAlert(translations[currentLang].TaskDeleted, "success", 3);
}

// Fetches 5 sample tasks from JSONPlaceholder API to populate the list on first load.
// Only runs when LocalStorage is empty. Maps API fields to the app's task structure.
async function fetchInitialTasks() {
	if (!navigator.onLine) {
		showAlert(translations[currentLang].noConn, "info");
		return;
	}

	try {
		const res = await fetch(
			"https://jsonplaceholder.typicode.com/todos?_limit=5",
		);
		if (!res.ok) throw new Error();
		const data = await res.json();

		tasks = data.map((item) => ({
			id: item.id + Date.now(), // Ensure unique ID even from API
			text: item.title,
			dueDate: new Date().toISOString().split("T")[0],
			completed: item.completed,
		}));

		saveAndRender();
	} catch (e) {
		showAlert(translations[currentLang].errFetch);
	}
}

// ===== Event Listeners =====

// Language Toggle - switches between Languages and persists the choice.
langToggle.addEventListener("click", () => {
	currentLang = currentLang === "en" ? "he" : "en";
	localStorage.setItem("lang", currentLang);
	updateUIStrings();
});

// Theme Toggle Trigger (Dark/Light Mode)
themeToggle.addEventListener("click", () => {
	const isDark = document.body.getAttribute("data-theme") === "dark";
	const newTheme = isDark ? "light" : "dark";

	document.body.setAttribute("data-theme", newTheme);
	themeToggle.textContent = isDark ? "🌙" : "☀️";
	localStorage.setItem("theme", newTheme);
});

// Add Task Trigger
addTaskBtn.addEventListener("click", addTask);

// Global Task List Listener
taskList.addEventListener("click", (event) => {
	// Find the closest button to the click target (handles clicks on icons inside buttons)
	const btn = event.target.closest("button");
	if (!btn) return;

	// Retrieve the task ID from the custom data attribute
	const id = Number(btn.dataset.id);

	// Execute logic based on the button class
	if (btn.classList.contains("done-btn")) {
		toggleTask(id);
	} else if (btn.classList.contains("delete-btn")) {
		deleteTask(id);
	}
});

// Enter Key - allows submitting a new task by pressing Enter in the text input.
taskInput.addEventListener("keydown", (e) => {
	if (e.key === "Enter") addTask();
});

// Sort Button - toggles sort direction, updates the arrow icon, and persists the choice.
sortDateBtn.addEventListener("click", () => {
	sortAscending = !sortAscending;
	localStorage.setItem("sortAscending", sortAscending);
	sortDateBtn.querySelector(".sort-arrow").textContent = sortAscending
		? "↑"
		: "↓";
	saveAndRender();
});

// Filter Buttons - updates the active filter and re-renders the task list.
filterBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		filterBtns.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
		currentFilter = btn.dataset.filter;
		renderTasks();
	});
});

// Scroll Listener - throttled with requestAnimationFrame for better performance.
// Shows or hides the "back to top" button based on scroll position.
let ticking = false;
window.addEventListener("scroll", () => {
	if (!ticking) {
		requestAnimationFrame(() => {
			toTopBtn.classList.toggle("show", window.scrollY > 300);
			ticking = false;
		});
		ticking = true;
	}
});

// Back to Top Button - smoothly scrolls to the top of the page on click.
toTopBtn.addEventListener("click", (e) => {
	e.preventDefault();
	window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Initialize App =====

// Loads saved data from LocalStorage, applies theme and language preferences,
// fetches initial tasks from the API if needed, and renders the UI.
async function init() {
	// Load tasks from LocalStorage
	tasks = getTasks();

	// Apply saved theme (defaults to light)
	const savedTheme = localStorage.getItem("theme") || "light";
	document.body.setAttribute("data-theme", savedTheme);
	themeToggle.textContent = savedTheme === "dark" ? "☀️" : "🌙";

	// Apply saved language (defaults to English)
	currentLang = localStorage.getItem("lang") || "en";

	// Apply saved sort direction (defaults to ascending)
	const savedSort = localStorage.getItem("sortAscending");
	if (savedSort !== null) sortAscending = savedSort === "true";

	// Restore sort arrow direction on load
	sortDateBtn.querySelector(".sort-arrow").textContent = sortAscending
		? "↑"
		: "↓";

	// Fetch sample tasks from API only if LocalStorage is empty
	if (tasks.length === 0) {
		await fetchInitialTasks();
	}

	// Update all UI strings and render the task list
	updateUIStrings();
}

// DOMContentLoaded fires faster than window.onload (does not wait for images/fonts)
document.addEventListener("DOMContentLoaded", init);
