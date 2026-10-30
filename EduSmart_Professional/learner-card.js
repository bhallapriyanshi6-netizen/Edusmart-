// EduSmart Learner Card
(() => {
  function getData(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data === null ? fallback : JSON.parse(data);
    } catch {
      return fallback;
    }
  }

  function updateLearnerCard() {
    const student = getData("edusmartStudent", {});
    const results = getData("edusmartResults", []);
    const tasks = getData("edusmartTasks", []);

    const name = student.name?.trim() || "Student";
    const firstName = name.split(/\s+/)[0];

    document.getElementById("learnerAvatar").textContent =
      name.charAt(0).toUpperCase();

    document.getElementById("learnerName").textContent =
      `Welcome, ${firstName}!`;

    const courseDetails = [student.course, student.year]
      .filter(Boolean)
      .join(" · ");

    document.getElementById("learnerCourse").textContent =
      courseDetails || "Add your course details in Student Info.";

    document.getElementById("learnerGoal").textContent =
      student.goal || "Set your learning goal in Student Info.";

    // Quiz statistics
    const quizCount = results.length;

    const average = quizCount
      ? Math.round(
          results.reduce((sum, result) =>
            sum + Number(result.score || 0), 0
          ) / quizCount
        )
      : null;

    document.getElementById("learnerQuizzes").textContent =
      quizCount;

    document.getElementById("learnerAverage").textContent =
      average === null ? "—" : `${average}%`;

    // Performance progress is based on average quiz score.
    const progress = average ?? 0;

    document.getElementById("learnerProgressText").textContent =
      `${progress}%`;

    document.getElementById("learnerProgressBar").style.width =
      `${progress}%`;

    const message = !quizCount
      ? "Complete your first quiz to start tracking your performance."
      : progress >= 80
        ? "Excellent work! Keep building on your progress."
        : progress >= 50
          ? "Good progress! Keep practising to improve."
          : "Keep learning. Review your topics and try another quiz.";

    document.getElementById("learnerProgressMessage").textContent =
      message;
  }

  updateLearnerCard();

  // Refresh if profile or results change in another browser tab.
  window.addEventListener("storage", updateLearnerCard);
})();