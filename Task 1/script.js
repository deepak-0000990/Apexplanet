document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("button");

  if (!button) return;

  button.addEventListener("click", () => {
    alert("Hey, you clicked the button!");
  });
});
