const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");

let words = [];

// ✅ This is an online dictionary link from GitHub (publicly available)
const GITHUB_RAW = "https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt";

// Load the dictionary from GitHub
fetch(GITHUB_RAW)
  .then(response => {
    if (!response.ok) throw new Error("❌ Cannot load dictionary file!");
    return response.text();
  })
  .then(text => {
    words = text.split(/\s+/);
    console.log(`✅ Loaded ${words.length} words from GitHub dictionary`);
  })
  .catch(error => {
    console.error("Error loading words.txt:", error);
    alert("⚠️ Unable to load word list. Please check your internet connection.");
  });

// Handle input and show suggestions
searchBox.addEventListener("input", () => {
  const input = searchBox.value.toLowerCase();
  suggestions.innerHTML = "";

  if (!input || words.length === 0) return;

  const filtered = words
    .filter(word => word.toLowerCase().startsWith(input))
    .slice(0, 10); // show only top 10 suggestions

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
