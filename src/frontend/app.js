// API endpoint
const apiEndpoint = `https://contenaire210silvacorreia.ashywater-99911d60.westus2.azurecontainerapps.io/api/tasks`;

$(document).ready(function () {
  console.log("API Endpoint :", apiEndpoint);
  loadTasks();

  // Ajouter une nouvelle tâche
  $("#todo-form").on("submit", async function (e) {
    e.preventDefault();

    const description = $("#todo-input").val().trim();
    const category = $("#todo-category").val();
    if (description === "") return;

    const task = { description: description, category: category };

    try {
      await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      $("#todo-input").val(""); // Réinitialiser le champ
      loadTasks();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche :", error);
    }
  });

  // Marquer une tâche comme terminée (ou non)
  $("#todo-list").on("click", ".task-toggle", async function () {
    const $taskElement = $(this).closest("li");
    const taskId = $taskElement.data("id");
    const isCompleted = $taskElement.hasClass("completed");

    // Récupère la description (sans la catégorie)
    const description = $taskElement.contents().filter(function () {
      return this.nodeType === 3; // Node texte
    }).text().trim();

    // Récupère la catégorie
    const category = $taskElement.find(".task-category").data("category");

    if (!description) {
      console.error("Erreur : la description de la tâche est vide !");
      return;
    }

    const updatedTask = { id: taskId, description: description, category: category, completed: !isCompleted };

    try {
      await fetch(apiEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });
      loadTasks();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche :", error);
    }
  });

  // Supprimer une tâche
  $("#todo-list").on("click", ".delete-btn", async function (e) {
    e.stopPropagation();
    const taskId = $(this).parent().data("id");

    try {
      await fetch(`${apiEndpoint}?id=${taskId}`, { method: "DELETE" });
      loadTasks();
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche :", error);
    }
  });

  // Charger les tâches depuis l'API
  async function loadTasks() {
    try {
      const response = await fetch(apiEndpoint);
      const tasks = await response.json();

      // Trier les tâches : non complétées d'abord
      tasks.sort((a, b) => a.completed - b.completed);

      $("#todo-list").empty();

      tasks.forEach((task) => {
        const categorySpan = $("<span>")
          .addClass("task-category")
          .addClass(task.category) // general / work / personal
          .data("category", task.category)
          .text(task.category.charAt(0).toUpperCase() + task.category.slice(1));

        const listItem = $("<li>")
          .data("id", task.id)
          .addClass(task.completed ? "completed" : "")
          .append(
            $("<input>").attr("type", "checkbox").addClass("task-toggle").prop("checked", task.completed)
          )
          .append(categorySpan)
          .append(document.createTextNode(task.description))
          .append(
            $("<button>").text("Delete").addClass("delete-btn")
          );

        $("#todo-list").append(listItem);
      });

      // Mettre à jour le compteur
      $("#task-counter").text(`Total: ${tasks.length} | Completed: ${tasks.filter(t => t.completed).length}`);

    } catch (error) {
      console.error("Erreur lors du chargement des tâches :", error);
    }
  }
});
