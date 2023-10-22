const deleteButtons = document.querySelectorAll(".delete");
console.log(deleteButtons);
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fetch("/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: button.dataset.id }),
    });
    button.closest(".card").remove();
  });
});
