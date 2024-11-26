function toggleTab(button) {
  const question = button.closest(".question");
  const answer = question.querySelector(".answer");
  const chevron = button.querySelector(".chevron");
  if (answer) {
    

    answer.classList.toggle("active");
  }
  if (chevron) {
    chevron.classList.toggle("rotate");
  }
}
