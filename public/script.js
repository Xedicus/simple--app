document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  const nameInput = document.getElementById("nameInput");
  const dataList = document.getElementById("dataList");

  // Récupérer les données au chargement de la page
  fetch("http://localhost:3000/api/data")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item.name;
        dataList.appendChild(li);
      });
    });

  // Envoyer des données au backend
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: nameInput.value }),
    }).then((response) => {
      if (response.ok) {
        const li = document.createElement("li");
        li.textContent = nameInput.value;
        dataList.appendChild(li);
        nameInput.value = "";
      }
    });
  });
});
