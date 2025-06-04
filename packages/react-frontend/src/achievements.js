export const getAchievements = (
  tasks,
  butterTasks,
  progress,
  checkedTasks,
  categories,
) => {
  const achievements = [];

  if (tasks.length >= 10) {
    achievements.push({
      icon: "🥖",
      text: "Bread Collector",
      desc: "Created 10+ tasks",
    });
  }

  if (butterTasks.length >= 5) {
    achievements.push({
      icon: "🧈",
      text: "Butter Master",
      desc: "5+ butter tasks",
    });
  }

  if (progress === 100 && tasks.length > 0) {
    achievements.push({
      icon: "🔥",
      text: "Perfectionist",
      desc: "100% completion",
    });
  }

  if (checkedTasks.length >= 5) {
    achievements.push({
      icon: "⚡",
      text: "Speed Demon",
      desc: "5+ tasks completed today",
    });
  }

  if (tasks.length >= 50) {
    achievements.push({
      icon: "🏆",
      text: "Task Champion",
      desc: "50+ total tasks",
    });
  }

  if (categories.length > 6) {
    achievements.push({
      icon: "📚",
      text: "Organizer",
      desc: "Created custom categories",
    });
  }

  return achievements;
};

export const breadQuotes = [
  "Stay focused and keep toasting.",
  "Small crumbs lead to big loaves.",
  "No task is too crusty to conquer.",
  "Rise to the occasion like good dough.",
  "Every great achievement starts with a single grain.",
  "Knead your goals until they're perfect.",
  "Life is what you bake it.",
  "Don't loaf around - get things done!",
  "You're the yeast that makes things rise.",
  "Success is a recipe worth following.",
  "Proof that hard work pays off.",
  "Butter believe in yourself!",
  "Time to roll up your sleeves and get baking.",
  "Fresh starts are like warm bread - always better.",
  "Slice through challenges one task at a time.",
];
