
// ===================================
// EDUSMART - MAIN JAVASCRIPT
// ===================================

// DOM Selector
const $ = s => document.querySelector(s);

// Local Storage Functions
const getData = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

const saveData = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    alert("Your browser could not save this information.");
    return false;
  }
};

// Load Saved Data
let tasks = getData("edusmartTasks", []);
let quizResults = getData("edusmartResults", []);

if (!Array.isArray(tasks)) tasks = [];
if (!Array.isArray(quizResults)) quizResults = [];

let student = getData("edusmartStudent", {
  name: "Student",
  email: "",
  course: "",
  year: "",
  studentId: "",
  goal: ""
});

// ===================================
// DATE AND STUDENT HEADER
// ===================================

if ($("#todayDate")) {
  $("#todayDate").textContent = new Date().toLocaleDateString(
    "en-IN",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

if ($("#year")) {
  $("#year").textContent = new Date().getFullYear();
}

function updateStudentHeader() {
  const name = student.name?.trim() || "Student";

  if ($("#headerStudentName")) {
    $("#headerStudentName").textContent = name;
  }

  if ($("#headerAvatar")) {
    $("#headerAvatar").textContent = name.charAt(0).toUpperCase();
  }
}

updateStudentHeader();

// ===================================
// MOBILE NAVIGATION
// ===================================

const menuToggle = $("#menuToggle");
const navLinks = $("#navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===================================
// STUDY PLANNER
// ===================================

const taskForm = $("#taskForm");
const taskInput = $("#taskInput");
const taskList = $("#taskList");

function renderTasks() {
  if (!taskList) return;

  taskList.replaceChildren();

  if (!tasks.length) {
    const empty = document.createElement("p");

    empty.className = "empty-state";
    empty.textContent =
      "Your plan is clear. Add your first study task!";

    taskList.appendChild(empty);
  }

  tasks.forEach(task => {
    const row = document.createElement("div");

    row.className =
      "task-item" + (task.completed ? " completed" : "");

    const check = document.createElement("input");

    check.type = "checkbox";
    check.checked = !!task.completed;
    check.setAttribute("aria-label", "Mark task complete");

    check.addEventListener("change", () => {
      task.completed = check.checked;

      saveData("edusmartTasks", tasks);

      renderTasks();
      updateDashboard();
    });

    const text = document.createElement("span");

    text.className = "task-text";
    text.textContent = task.text;

    const del = document.createElement("button");

    del.type = "button";
    del.className = "delete-task";
    del.textContent = "×";
    del.setAttribute("aria-label", "Delete task");

    del.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);

      saveData("edusmartTasks", tasks);

      renderTasks();
      updateDashboard();
    });

    row.append(check, text, del);
    taskList.appendChild(row);
  });
}

// Add New Task
if (taskForm) {
  taskForm.addEventListener("submit", event => {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (!text) return;

    tasks.push({
      id: Date.now() + Math.random(),
      text,
      completed: false
    });

    saveData("edusmartTasks", tasks);

    taskInput.value = "";

    renderTasks();
    updateDashboard();
  });
}

// ===================================
// DASHBOARD
// ===================================

function updateDashboard() {
  if ($("#subjectCount")) {
    $("#subjectCount").textContent = "4";
  }

  if ($("#quizCount")) {
    $("#quizCount").textContent = quizResults.length;
  }

  if ($("#averageScore")) {
    const average = quizResults.length
      ? Math.round(
          quizResults.reduce(
            (sum, result) =>
              sum + Number(result.score || 0),
            0
          ) / quizResults.length
        )
      : null;

    $("#averageScore").textContent =
      average === null ? "—" : average + "%";
  }

  if ($("#taskCount")) {
    $("#taskCount").textContent =
      `${tasks.filter(task => task.completed).length}/${tasks.length}`;
  }
}

renderTasks();
updateDashboard();

// ===================================
// SAMPLE QUIZ BANK
// ===================================

const bank = {

  "Python Programming": [
    {
      q: "Which keyword defines a function in Python?",
      o: ["function", "def", "define", "func"],
      a: 1,
      e: "The def keyword defines a function."
    },
    {
      q: "Which data type stores an ordered collection?",
      o: ["List", "Integer", "Boolean", "Float"],
      a: 0,
      e: "A list stores an ordered collection of items."
    },
    {
      q: "Which symbol starts a single-line Python comment?",
      o: ["//", "<!--", "#", "**"],
      a: 2,
      e: "The hash symbol (#) begins a single-line comment."
    }
  ],

  "Database Management": [
    {
      q: "Which SQL command retrieves data?",
      o: ["INSERT", "SELECT", "UPDATE", "DELETE"],
      a: 1,
      e: "SELECT retrieves data from tables."
    },
    {
      q: "What does a primary key ensure?",
      o: [
        "Duplicate rows",
        "Unique row identification",
        "Automatic backup",
        "Faster typing"
      ],
      a: 1,
      e: "A primary key uniquely identifies each row."
    },
    {
      q: "Which command removes a table structure?",
      o: ["DELETE", "UPDATE", "DROP", "SELECT"],
      a: 2,
      e: "DROP TABLE removes the table structure."
    }
  ],

  "Web Programming": [
    {
      q: "Which language structures a web page?",
      o: ["HTML", "SQL", "Python", "C"],
      a: 0,
      e: "HTML defines the structure of a web page."
    },
    {
      q: "Which CSS property changes text color?",
      o: ["font-style", "background", "color", "text-size"],
      a: 2,
      e: "The color property sets text color."
    },
    {
      q: "Which method selects an element by ID?",
      o: [
        "document.getElementById()",
        "document.getClass()",
        "window.selectID()",
        "document.getTag()"
      ],
      a: 0,
      e: "getElementById() selects an element using its ID."
    }
  ],

  "Data Analytics": [
    {
      q: "Which Python library is widely used for numerical arrays?",
      o: ["NumPy", "Tkinter", "Turtle", "Random"],
      a: 0,
      e: "NumPy provides multidimensional arrays and numerical functions."
    },
    {
      q: "Which Pandas structure represents tabular data?",
      o: ["Tuple", "DataFrame", "String", "Boolean"],
      a: 1,
      e: "A DataFrame organizes data in rows and columns."
    },
    {
      q: "What does data visualization help reveal?",
      o: [
        "Patterns and trends",
        "Passwords",
        "Keyboard shortcuts",
        "File permissions"
      ],
      a: 0,
      e: "Visualizations help reveal patterns and trends."
    }
  ]
};

// ===================================
// QUIZ SYSTEM
// ===================================

const modal = $("#quizModal");

if (modal) {

  let subject = "";
  let questions = [];
  let index = 0;
  let score = 0;
  let seconds = 30;
  let timer = null;
  let answered = false;
  let finished = false;

  const title = $("#quizTitle");
  const sub = $("#quizSubject");
  const counter = $("#questionCounter");
  const clock = $("#quizTimer");
  const progress = $("#quizProgress");
  const question = $("#questionText");
  const options = $("#answerOptions");
  const feedback = $("#quizFeedback");
  const next = $("#nextQuestion");
  const retry = $("#restartQuiz");

  function stopTimer() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function close() {
    stopTimer();

    modal.hidden = true;
    document.body.style.overflow = "";
  }

  // Display Question
  function render() {
    answered = false;

    const item = questions[index];

    counter.textContent =
      `Question ${index + 1} of ${questions.length}`;

    progress.style.width =
      `${index / questions.length * 100}%`;

    question.textContent = item.q;

    options.replaceChildren();

    feedback.textContent = "";
    feedback.className = "quiz-feedback";

    next.disabled = true;
    next.hidden = false;

    next.textContent =
      index === questions.length - 1
        ? "View results →"
        : "Next question →";

    retry.hidden = true;

    item.o.forEach((label, i) => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = "answer-option";

      button.textContent =
        `${String.fromCharCode(65 + i)}. ${label}`;

      button.addEventListener("click", () => answer(i));

      options.appendChild(button);
    });
  }

  // Start Quiz
  function start(subjectName) {
    if (!bank[subjectName]) return;

    stopTimer();

    subject = subjectName;
    questions = bank[subject];

    index = 0;
    score = 0;
    seconds = 30;

    answered = false;
    finished = false;

    title.textContent = "Practice quiz";
    sub.textContent = subject;

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    render();

    clock.textContent = "30 sec";

    timer = setInterval(() => {
      seconds--;

      clock.textContent = `${seconds} sec`;

      if (seconds <= 0) {
        finish(true);
      }
    }, 1000);
  }

  // Check Answer
  function answer(i) {
    if (answered || finished) return;

    answered = true;

    const item = questions[index];
    const buttons = options.querySelectorAll("button");

    buttons.forEach((button, j) => {
      button.disabled = true;

      if (j === item.a) {
        button.classList.add("correct");
      }
    });

    if (i === item.a) {
      score++;

      feedback.textContent =
        "Correct! " + item.e;

      feedback.className = "quiz-feedback success";

    } else {
      buttons[i].classList.add("incorrect");

      feedback.textContent =
        "Not quite. " + item.e;

      feedback.className = "quiz-feedback error";
    }

    next.disabled = false;
  }

  // Finish Quiz and Save Results
  function finish(timeUp = false) {
    if (finished) return;

    stopTimer();
    finished = true;

    const percent = Math.round(
      score / questions.length * 100
    );

    quizResults.push({
      subject: subject,
      score: percent,
      correct: score,
      total: questions.length,
      date: new Date().toISOString()
    });

    saveData("edusmartResults", quizResults);

    updateDashboard();
    renderAchievements();

    counter.textContent = "Assessment completed";
    progress.style.width = "100%";

    clock.textContent =
      timeUp ? "Time ended" : "Completed";

    question.textContent =
      timeUp
        ? "Your time has ended!"
        : "Well done on completing the quiz!";

    options.replaceChildren();

    const box = document.createElement("div");
    box.className = "rhythm-card";

    const icon = document.createElement("span");
    icon.className = "rhythm-number";
    icon.textContent = percent >= 70 ? "★" : "↗";

    const details = document.createElement("div");

    const heading = document.createElement("b");
    heading.textContent = `Your score: ${percent}%`;

    const paragraph = document.createElement("p");

    paragraph.textContent =
      `${score} out of ${questions.length} correct. ` +
      `${percent >= 70
        ? "Excellent work!"
        : "Review the topic and try again."}`;

    details.append(heading, paragraph);
    box.append(icon, details);

    options.appendChild(box);

    feedback.textContent =
      "Your result has been saved. Open My results to see your history.";

    feedback.className = "quiz-feedback";

    next.hidden = true;
    retry.hidden = false;
  }

  // Quiz Buttons
  document.querySelectorAll(".quiz-button").forEach(button => {
    button.addEventListener("click", () => {
      start(button.dataset.subject);
    });
  });

  next.addEventListener("click", () => {
    if (!answered || finished) return;

    if (index < questions.length - 1) {
      index++;
      render();
    } else {
      finish(false);
    }
  });

  retry.addEventListener("click", () => {
    start(subject);
  });

  const closeButton = $("#closeQuiz");

  if (closeButton) {
    closeButton.addEventListener("click", close);
  }

  modal.addEventListener("click", event => {
    if (event.target === modal) close();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) {
      close();
    }
  });
}

// ===================================
// ACHIEVEMENT AND BADGE SYSTEM
// ===================================

const achievementList = [

  {
    id: "first",
    icon: "🌱",
    name: "First Step",
    description: "Complete your first quiz.",
    condition: results => results.length >= 1
  },

  {
    id: "quizmaster",
    icon: "🏆",
    name: "Quiz Master",
    description: "Complete 5 quizzes.",
    condition: results => results.length >= 5
  },

  {
    id: "perfect",
    icon: "⭐",
    name: "Perfect Score",
    description: "Score 100% in a quiz.",
    condition: results =>
      results.some(result => Number(result.score) === 100)
  },

  {
    id: "consistent",
    icon: "🔥",
    name: "Consistent Learner",
    description: "Complete quizzes on 3 different days.",
    condition: results => {
      const days = new Set(
        results
          .filter(result => result.date)
          .map(result => new Date(result.date).toDateString())
      );

      return days.size >= 3;
    }
  },

  {
    id: "explorer",
    icon: "📚",
    name: "Knowledge Seeker",
    description: "Complete quizzes in all 4 subjects.",
    condition: results => {
      const subjects = new Set(
        results.map(result => result.subject)
      );

      return [
        "Python Programming",
        "Database Management",
        "Web Programming",
        "Data Analytics"
      ].every(subject => subjects.has(subject));
    }
  },

  {
    id: "highachiever",
    icon: "💎",
    name: "High Achiever",
    description: "Maintain an average score of 80% or above.",
    condition: results => {
      if (!results.length) return false;

      const average = results.reduce(
        (sum, result) =>
          sum + Number(result.score || 0),
        0
      ) / results.length;

      return average >= 80;
    }
  }

];

// Display Achievement Badges
function renderAchievements() {
  const grid = $("#achievementGrid");
  const count = $("#badgeCount");

  if (!grid) return;

  const earned = achievementList.filter(badge =>
    badge.condition(quizResults)
  );

  grid.replaceChildren();

  achievementList.forEach(badge => {
    const unlocked = badge.condition(quizResults);

    const card = document.createElement("article");

    card.className =
      "achievement-card" +
      (unlocked ? " unlocked" : " locked");

    const icon = document.createElement("div");

    icon.className = "achievement-icon";
    icon.textContent = unlocked ? badge.icon : "🔒";

    const name = document.createElement("h3");
    name.textContent = badge.name;

    const description = document.createElement("p");
    description.textContent = badge.description;

    const status = document.createElement("span");

    status.className = "achievement-status";

    status.textContent = unlocked
      ? "✓ UNLOCKED"
      : "NOT YET UNLOCKED";

    card.append(icon, name, description, status);

    grid.appendChild(card);
  });

  if (count) {
    count.textContent =
      `${earned.length} / ${achievementList.length} unlocked`;
  }

  saveData(
    "edusmartAchievements",
    earned.map(badge => badge.id)
  );
}

renderAchievements();

// ===================================
// DAILY LEARNING MOTIVATION
// ===================================

const motivationQuotes = [
  "Small steps every day lead to big results.",
  "Your only limit is your willingness to learn.",
  "Success begins with the decision to try.",
  "Every expert was once a beginner.",
  "Do something today that your future self will thank you for.",
  "Consistency is the key to progress.",
  "Learn something new today. Grow a little more tomorrow.",
  "Great things take time. Keep moving forward."
];

const dailyChallenges = [
  "Complete one quiz and revise one topic.",
  "Study for 25 minutes without distractions.",
  "Revise five important concepts.",
  "Practise one programming question.",
  "Review your previous quiz mistakes.",
  "Explore a new topic in one of your subjects.",
  "Complete two pending study tasks."
];

// Show Daily Motivation
function showDailyMotivation(random = false) {
  const quote = $("#dailyQuote");
  const challenge = $("#dailyChallenge");

  if (!quote || !challenge) return;

  const today = new Date();

  const dateKey = [
    today.getFullYear(),
    today.getMonth() + 1,
    today.getDate()
  ].join("-");

  let quoteIndex;
  let challengeIndex;

  if (random) {
    quoteIndex = Math.floor(
      Math.random() * motivationQuotes.length
    );

    challengeIndex = Math.floor(
      Math.random() * dailyChallenges.length
    );

  } else {
    const seed = dateKey.split("-").reduce(
      (sum, value) => sum + Number(value),
      0
    );

    quoteIndex = seed % motivationQuotes.length;
    challengeIndex = seed % dailyChallenges.length;
  }

  quote.textContent =
    `"${motivationQuotes[quoteIndex]}"`;

  challenge.textContent =
    dailyChallenges[challengeIndex];
}

showDailyMotivation();

// New Motivation Button
const motivationButton = $("#newMotivation");

if (motivationButton) {
  motivationButton.addEventListener("click", () => {
    showDailyMotivation(true);
  });
}

// ===================================
// RESET PROGRESS
// ===================================

const reset = $("#resetProgress");

if (reset) {
  reset.addEventListener("click", () => {

    if (!confirm(
      "Clear all saved study tasks and quiz results?"
    )) return;

    tasks = [];
    quizResults = [];

    saveData("edusmartTasks", tasks);
    saveData("edusmartResults", quizResults);
    saveData("edusmartAchievements", []);

    renderTasks();
    updateDashboard();
    renderAchievements();

  });
}

/* ===================================
   1. SMART FLASHCARDS
=================================== */

const flashcards = [
  {
    question: "What is Python?",
    answer: "Python is a high-level, interpreted programming language."
  },
  {
    question: "What is a primary key?",
    answer: "A primary key uniquely identifies each record in a database table."
  },
  {
    question: "What is HTML?",
    answer: "HTML is a markup language used to structure web pages."
  },
  {
    question: "What is CSS?",
    answer: "CSS is used to style and design HTML web pages."
  },
  {
    question: "What is JavaScript?",
    answer: "JavaScript is a programming language used to make web pages interactive."
  },
  {
    question: "What is NumPy?",
    answer: "NumPy is a Python library used for numerical computing and arrays."
  },
  {
    question: "What is a DataFrame?",
    answer: "A DataFrame is a two-dimensional tabular data structure in Pandas."
  },
  {
    question: "What is DBMS?",
    answer: "DBMS is software used to create, manage and access databases."
  }
];

let currentFlashcard = 0;
let flashcardFlipped = false;

function renderFlashcard() {
  const card = $("#flashcard");
  const text = $("#flashcardText");
  const label = $("#flashcardLabel");
  const counter = $("#flashcardCounter");
  const flipButton = $("#flipCard");

  if (!card || !text || !label) return;

  const item = flashcards[currentFlashcard];

  text.textContent = flashcardFlipped
    ? item.answer
    : item.question;

  label.textContent = flashcardFlipped
    ? "ANSWER"
    : "QUESTION";

  if (counter) {
    counter.textContent =
      `${currentFlashcard + 1} / ${flashcards.length}`;
  }

  if (flipButton) {
    flipButton.textContent = flashcardFlipped
      ? "Show Question"
      : "Reveal Answer";
  }

  card.setAttribute(
    "aria-label",
    `${label.textContent}: ${text.textContent}. Click to flip.`
  );
}

function flipFlashcard() {
  flashcardFlipped = !flashcardFlipped;
  renderFlashcard();
}

function changeFlashcard(direction) {
  currentFlashcard =
    (currentFlashcard + direction + flashcards.length) %
    flashcards.length;

  flashcardFlipped = false;
  renderFlashcard();
}

if ($("#flashcard")) {
  $("#flashcard").addEventListener("click", flipFlashcard);
}

if ($("#flipCard")) {
  $("#flipCard").addEventListener("click", flipFlashcard);
}

if ($("#previousCard")) {
  $("#previousCard").addEventListener("click", () => {
    changeFlashcard(-1);
  });
}

if ($("#nextCard")) {
  $("#nextCard").addEventListener("click", () => {
    changeFlashcard(1);
  });
}

renderFlashcard();


/* ===================================
   2. FOCUS TIMER
=================================== */

let timerInterval = null;
let remainingSeconds = 25 * 60;
let currentTimerMode = "focus";

let completedSessions = getData("edusmartFocusSessions", 0);

if (!Number.isFinite(completedSessions) || completedSessions < 0) {
  completedSessions = 0;
}

function updateTimerDisplay() {
  const display = $("#timerDisplay");

  if (!display) return;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  display.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

function updateFocusSessions() {
  if ($("#focusSessions")) {
    $("#focusSessions").textContent = completedSessions;
  }
}

function stopFocusTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function selectTimerMode(mode) {
  stopFocusTimer();

  currentTimerMode = mode;

  remainingSeconds = mode === "focus"
    ? 25 * 60
    : 5 * 60;

  if ($("#timerMode")) {
    $("#timerMode").textContent =
      mode === "focus" ? "FOCUS SESSION" : "BREAK TIME";
  }

  $("#focusMode")?.classList.toggle("active", mode === "focus");
  $("#breakMode")?.classList.toggle("active", mode === "break");

  updateTimerDisplay();
}

function startFocusTimer() {
  if (timerInterval) return;

  if (remainingSeconds <= 0) {
    selectTimerMode(currentTimerMode);
  }

  timerInterval = setInterval(() => {
    remainingSeconds--;

    updateTimerDisplay();

    if (remainingSeconds <= 0) {
      stopFocusTimer();

      if (currentTimerMode === "focus") {
        completedSessions++;

        saveData(
          "edusmartFocusSessions",
          completedSessions
        );

        updateFocusSessions();

        alert("Great work! Your focus session is complete. Take a 5-minute break.");

        selectTimerMode("break");

      } else {
        alert("Your break is complete. You are ready for another focus session!");

        selectTimerMode("focus");
      }
    }
  }, 1000);
}

if ($("#startTimer")) {
  $("#startTimer").addEventListener("click", startFocusTimer);
}

if ($("#pauseTimer")) {
  $("#pauseTimer").addEventListener("click", stopFocusTimer);
}

if ($("#resetTimer")) {
  $("#resetTimer").addEventListener("click", () => {
    stopFocusTimer();
    selectTimerMode(currentTimerMode);
  });
}

if ($("#focusMode")) {
  $("#focusMode").addEventListener("click", () => {
    selectTimerMode("focus");
  });
}

if ($("#breakMode")) {
  $("#breakMode").addEventListener("click", () => {
    selectTimerMode("break");
  });
}

updateTimerDisplay();
updateFocusSessions();


/* ===================================
   3. MOCK EXAMINATION MODE
=================================== */

let examQuestions = [];
let examAnswers = [];
let examIndex = 0;
let examTime = 5 * 60;
let examInterval = null;
let examActive = false;
let examSubjectName = "";

function stopExamTimer() {
  if (examInterval) {
    clearInterval(examInterval);
    examInterval = null;
  }
}

function updateExamClock() {
  const clock = $("#examTimer");

  if (!clock) return;

  const minutes = Math.floor(examTime / 60);
  const seconds = examTime % 60;

  clock.textContent =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;
}

function renderExamQuestion() {
  const question = examQuestions[examIndex];

  if (!question) return;

  $("#examProgress").textContent =
    `Question ${examIndex + 1} of ${examQuestions.length}`;

  $("#examProgressBar").style.width =
    `${((examIndex + 1) / examQuestions.length) * 100}%`;

  $("#examQuestion").textContent = question.q;

  const options = $("#examOptions");
  options.replaceChildren();

  question.o.forEach((option, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "exam-option";

    if (examAnswers[examIndex] === index) {
      button.classList.add("selected");
    }

    button.textContent =
      `${String.fromCharCode(65 + index)}. ${option}`;

    button.addEventListener("click", () => {
      if (!examActive) return;

      examAnswers[examIndex] = index;
      renderExamQuestion();
    });

    options.appendChild(button);
  });

  $("#examPrevious").disabled = examIndex === 0;

  $("#examNext").textContent =
    examIndex === examQuestions.length - 1
      ? "Last Question"
      : "Next →";
}

function startMockExam() {
  const selectedSubject = $("#examSubject")?.value;

  if (!selectedSubject || !bank[selectedSubject]) return;

  stopExamTimer();

  examSubjectName = selectedSubject;
  examQuestions = bank[selectedSubject].map(item => ({
    ...item,
    o: [...item.o]
  }));

  examAnswers = new Array(examQuestions.length).fill(null);

  examIndex = 0;
  examTime = 5 * 60;
  examActive = true;

  $("#examSetup").hidden = true;
  $("#examResult").hidden = true;
  $("#examArea").hidden = false;

  updateExamClock();
  renderExamQuestion();

  examInterval = setInterval(() => {
    examTime--;

    updateExamClock();

    if (examTime <= 0) {
      finishMockExam(true);
    }
  }, 1000);
}

function finishMockExam(timeUp = false) {
  if (!examActive) return;

  examActive = false;
  stopExamTimer();

  const correctAnswers = examQuestions.filter(
    (question, index) => examAnswers[index] === question.a
  ).length;

  const totalQuestions = examQuestions.length;

  const percentage = Math.round(
    (correctAnswers / totalQuestions) * 100
  );

  // Save mock examination result
  quizResults.push({
    subject: examSubjectName,
    score: percentage,
    correct: correctAnswers,
    total: totalQuestions,
    date: new Date().toISOString(),
    type: "Mock Examination"
  });

  saveData("edusmartResults", quizResults);

  updateDashboard();
  renderAchievements();

  $("#examArea").hidden = true;
  $("#examResult").hidden = false;

  $("#examResultTitle").textContent =
    timeUp ? "Time is up!" : "Examination Completed!";

  $("#examScore").textContent =
    `Your Score: ${percentage}%`;

  $("#examResultMessage").textContent =
    `${correctAnswers} out of ${totalQuestions} answers correct. ` +
    (percentage >= 70
      ? "Excellent performance! Keep it up."
      : "Keep practising to improve your score.");

  $("#retakeExam").textContent = "Try Again";
}

if ($("#startExam")) {
  $("#startExam").addEventListener("click", startMockExam);
}

if ($("#examPrevious")) {
  $("#examPrevious").addEventListener("click", () => {
    if (!examActive || examIndex === 0) return;

    examIndex--;
    renderExamQuestion();
  });
}

if ($("#examNext")) {
  $("#examNext").addEventListener("click", () => {
    if (!examActive || examIndex >= examQuestions.length - 1) return;

    examIndex++;
    renderExamQuestion();
  });
}

if ($("#submitExam")) {
  $("#submitExam").addEventListener("click", () => {
    if (!examActive) return;

    const unanswered = examAnswers.filter(
      answer => answer === null
    ).length;

    const message = unanswered
      ? `You have ${unanswered} unanswered question(s). Submit anyway?`
      : "Are you sure you want to submit your examination?";

    if (confirm(message)) {
      finishMockExam(false);
    }
  });
}

if ($("#retakeExam")) {
  $("#retakeExam").addEventListener("click", () => {
    $("#examResult").hidden = true;
    $("#examSetup").hidden = false;
  });
}


/* ===================================
   4. STUDY RESOURCE LIBRARY
=================================== */

const studyResources = [
  {
    title: "Python Official Tutorial",
    subject: "Python Programming",
    description: "Learn Python fundamentals, functions, classes and modules.",
    icon: "🐍",
    link: "https://docs.python.org/3/tutorial/"
  },
  {
    title: "Python Beginner Guide",
    subject: "Python Programming",
    description: "Explore Python concepts and programming examples.",
    icon: "💻",
    link: "https://www.w3schools.com/python/"
  },
  {
    title: "SQL Tutorial",
    subject: "Database Management",
    description: "Study SQL commands, queries and database operations.",
    icon: "🗄️",
    link: "https://www.w3schools.com/sql/"
  },
  {
    title: "PostgreSQL Documentation",
    subject: "Database Management",
    description: "Explore database concepts and SQL documentation.",
    icon: "📚",
    link: "https://www.postgresql.org/docs/"
  },
  {
    title: "HTML Tutorial",
    subject: "Web Programming",
    description: "Learn HTML elements, forms, tables and page structure.",
    icon: "🌐",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML"
  },
  {
    title: "CSS Learning Guide",
    subject: "Web Programming",
    description: "Understand styling, layouts, selectors and responsive design.",
    icon: "🎨",
    link: "https://developer.mozilla.org/en-US/docs/Web/CSS"
  },
  {
    title: "NumPy Documentation",
    subject: "Data Analytics",
    description: "Study arrays, mathematical operations and numerical computing.",
    icon: "📊",
    link: "https://numpy.org/doc/"
  },
  {
    title: "Pandas Documentation",
    subject: "Data Analytics",
    description: "Learn Series, DataFrames and data manipulation.",
    icon: "📈",
    link: "https://pandas.pydata.org/docs/"
  }
];

function renderResources() {
  const grid = $("#resourceGrid");

  if (!grid) return;

  const searchText =
    ($("#resourceSearch")?.value || "").trim().toLowerCase();

  const selectedSubject =
    $("#resourceFilter")?.value || "All";

  const filteredResources = studyResources.filter(resource => {
    const matchesSubject =
      selectedSubject === "All" ||
      resource.subject === selectedSubject;

    const matchesSearch =
      resource.title.toLowerCase().includes(searchText) ||
      resource.description.toLowerCase().includes(searchText) ||
      resource.subject.toLowerCase().includes(searchText);

    return matchesSubject && matchesSearch;
  });

  grid.replaceChildren();

  if (!filteredResources.length) {
    const empty = document.createElement("p");

    empty.className = "resource-empty";
    empty.textContent =
      "No resources found. Try another search or subject.";

    grid.appendChild(empty);
    return;
  }

  filteredResources.forEach(resource => {
    const card = document.createElement("article");

    card.className = "resource-card";

    const icon = document.createElement("div");
    icon.className = "resource-icon";
    icon.textContent = resource.icon;

    const subject = document.createElement("span");
    subject.className = "resource-subject";
    subject.textContent = resource.subject.toUpperCase();

    const title = document.createElement("h3");
    title.textContent = resource.title;

    const description = document.createElement("p");
    description.textContent = resource.description;

    const link = document.createElement("a");

    link.className = "resource-link";
    link.href = resource.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Explore Resource →";

    card.append(
      icon,
      subject,
      title,
      description,
      link
    );

    grid.appendChild(card);
  });
}

if ($("#resourceSearch")) {
  $("#resourceSearch").addEventListener("input", renderResources);
}

if ($("#resourceFilter")) {
  $("#resourceFilter").addEventListener("change", renderResources);
}

renderResources();
