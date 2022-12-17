const worksList = document.getElementById("works");

fetch("/db/works.json")
  .then((response) => response.json())
  .then((data) => {
    worksData = data.works;
    worksData.forEach((work) => {
      worksList.appendChild(createWorkElement(work));
    });

    addScrollEvents();
  });

function createWorkElement(work) {
  const card = document.createElement("li");
  card.classList.add("card");

  let skills = "";
  for (let i = 0; i < work.skills.length; i++) {
    const skill = work.skills[i];
    skills += `<a class="skill ${skill.toLowerCase()}">${skill}</a>`;
  }

  card.innerHTML = `
    <img class="card__image" src="${work.image}">
    <nav class="card__head">
        <img class="icon" src="${work.icon}">
        <h3 class="name">${work.name}</h3>
    </nav>
    <p class="card__description">${work.description}</p>
    <nav class="card__skills">${skills}</nav>`.trim();
  return card;
}

function addScrollEvents() {
  const cardsContainers = [
    ...document.getElementsByClassName("cards__container"),
  ];

  cardsContainers.forEach((container) => {
    const list = container.getElementsByClassName("list")[0];
    const next = container.getElementsByClassName("arrow--next")[0];
    const previous = container.getElementsByClassName("arrow--previous")[0];
    const count = list.children.length;
    const showable_count = Math.round(
      container.getBoundingClientRect().width / 320
    );
    let index = 0;

    let touchStart = 0;
    list.addEventListener("touchstart", (event) => {
      touchStart = event.changedTouches[0].screenX;
    });
    list.addEventListener("touchend", (event) => {
      const touchChange = touchStart - event.changedTouches[0].screenX;
      if (touchChange > 0 && previous.style.display !== "none") {
        previous.click();
      } else if (touchChange < 0 && next.style.display !== "none") {
        next.click();
      }
    });

    if (0 === count - showable_count) {
      next.style.display = "none";
    }

    next.addEventListener("click", () => {
      index++;
      previous.style.display = "inline";
      if (index >= count - showable_count) {
        next.style.display = "none";
      }
      list.style.transform = `translateX(${index * 332}px)`;
      // 320 + width + 12 padding + 1 shadow
    });
    previous.addEventListener("click", () => {
      index--;
      next.style.display = "inline";
      if (index === 0) {
        previous.style.display = "none";
      }
      list.style.transform = `translateX(${index * 332}px)`;
    });
  });
}
