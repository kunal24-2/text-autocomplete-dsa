let words = [];

fetch("words.txt")
  .then((res) => res.text())
  .then((data) => {
    words = data.split("\n").map((w) => w.trim()).filter(Boolean);
    console.log("✅ Word list loaded:", words.length, "words");
  });

const input = document.getElementById("searchInput");
const list = document.getElementById("suggestionsList");

input.addEventListener("input", () => {
  const query = input.value.toLowerCase();
  list.innerHTML = "";

  if (query.length === 0) return;

  const suggestions = words
    .filter((word) => word.toLowerCase().startsWith(query))
    .slice(0, 10); 

  if (suggestions.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No suggestions found.";
    list.appendChild(li);
  } else {
    suggestions.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      list.appendChild(li);
    });
  }
});
