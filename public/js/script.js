document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("dataForm");
  const nameInput = document.getElementById("nameInput");
  const dataList = document.getElementById("dataList");

  // Fonction pour ajouter un élément à la liste
  function addItemToList(item) {
    const li = document.createElement("li");
    li.textContent = item.name;

    // Ajouter un bouton de suppression
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.addEventListener("click", () => {
      fetch(`http://localhost:3000/api/data/${item.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            li.remove();
          } else {
            console.error("Erreur lors de la suppression");
          }
        })
        .catch((error) =>
          console.error("Erreur lors de la suppression:", error)
        );
    });

    li.appendChild(deleteButton);
    dataList.appendChild(li);
  }

  // Récupérer les données au chargement de la page
  fetch("http://localhost:3000/api/data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Réponse réseau non OK");
      }
      return response.json();
    })
    .then((data) => {
      data.forEach((item) => addItemToList(item));
    })
    .catch((error) =>
      console.error("Erreur de récupération des données:", error)
    );

  // Envoyer des données au backend
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = nameInput.value.trim();
    if (!name) {
      alert("Le champ de nom ne peut pas être vide.");
      return;
    }

    fetch("http://localhost:3000/api/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Réponse réseau non OK");
        }
        return response.json();
      })
      .then((newItem) => {
        // Ajouter le nouvel élément à la liste
        addItemToList(newItem);
        nameInput.value = "";
      })
      .catch((error) =>
        console.error("Erreur lors de l'ajout des données:", error)
      );
  });
});
