function toggleTab(tab) {
  console.log(tab);
  const answer = tab.nextElementSibling;
  const chevron = tab.querySelector(".chevron");
  console.log(answer);
  if (answer){
    answer.classList.toggle("active");
    console.log(answer);
  }
  if (chevron) {
    chevron.classList.toggle("rotate");
  }
}
