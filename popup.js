document.addEventListener("DOMContentLoaded", () => {
  const historyList = document.getElementById("historyList");
  const deleteSelectedBtn = document.getElementById("deleteSelectedBtn");
  const popupWidth = document.getElementById("popupWidth");
  const popupHeight = document.getElementById("popupHeight");
  const resizeBtn = document.getElementById("resizeBtn");
  const content = document.getElementById("content");

  // Retrieve history and display with delete options
  browser.storage.local.get("tempHistory").then((result) => {
    const tempHistory = result.tempHistory || [];
    tempHistory.forEach((entry, index) => {
      const listItem = document.createElement("li");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "checkbox";
      checkbox.addEventListener("change", toggleDeleteButton);

      const link = document.createElement("a");
      link.textContent = entry.title || entry.url;
      link.href = entry.url;
      link.title = entry.url;
      link.target = "_blank";

      link.addEventListener("click", (e) => {
        e.preventDefault();
        browser.windows.create({
          url: entry.url,
          incognito: true,
        });
      });

      const deleteIcon = document.createElement("span");
      deleteIcon.className = "delete-icon";
      deleteIcon.textContent = "X";
      deleteIcon.addEventListener("click", () => deleteLink(index));

      listItem.appendChild(checkbox);
      listItem.appendChild(link);
      listItem.appendChild(deleteIcon);
      historyList.appendChild(listItem);
    });
  });

  function deleteLink(index) {
    browser.storage.local.get("tempHistory").then((result) => {
      const tempHistory = result.tempHistory || [];
      tempHistory.splice(index, 1);
      browser.storage.local.set({ tempHistory });
      location.reload(); // Refresh popup
    });
  }

  function toggleDeleteButton() {
    const anyChecked = Array.from(
      historyList.querySelectorAll(".checkbox")
    ).some((checkbox) => checkbox.checked);
    deleteSelectedBtn.style.display = anyChecked ? "block" : "none";
  }

  deleteSelectedBtn.addEventListener("click", () => {
    browser.storage.local.get("tempHistory").then((result) => {
      const tempHistory = result.tempHistory || [];
      const checkboxes = historyList.querySelectorAll(".checkbox");
      const newHistory = tempHistory.filter(
        (_, index) => !checkboxes[index].checked
      );
      browser.storage.local.set({ tempHistory: newHistory });
      location.reload();
    });
  });

  // Resize content container based on user inputs
  resizeBtn.addEventListener("click", () => {
    const width = parseInt(popupWidth.value) || 300;
    const height = parseInt(popupHeight.value) || 400;
    content.style.width = `${width}px`;
    content.style.height = `${height}px`;
  });
});
