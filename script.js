const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");

let words = [];

// ✅ Correct GitHub raw link for your repository
const GITHUB_RAW = "https://raw.githubusercontent.com/kunal24-2/text-autocomplete-dsa/main/words.txt";

// Load dictionary file
fetch(GITHUB_RAW)
  .then(response => {
    if (!response.ok) throw new Error("❌ Cannot load dictionary file!");
    return response.text();
  })
  .then(text => {
    words = text.split(/\s+/);
    console.log(`✅ Loaded ${words.length} words from GitHub`);
  })
  .catch(error => {
    console.error("Error loading words.txt:", error);
    alert("⚠️ Unable to load word list. Check your GitHub link!");
  });

// Handle autocomplete
searchBox.addEventListener("input", () => {
  const input = searchBox.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!input || words.length === 0) return;

  const filtered = words
    .filter(word => word.toLowerCase().startsWith(input))
    .slice(0, 10);

  if (filtered.length === 0) {
    suggestions.innerHTML = "<li>No suggestions found</li>";
    return;
  }

  filtered.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    li.classList.add("suggestion-item");
    li.addEventListener("click", () => {
      searchBox.value = word;
      suggestions.innerHTML = "";
    });
    suggestions.appendChild(li);
  });
});

