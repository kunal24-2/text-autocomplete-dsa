// web/script.js — robust loader + autocomplete
const searchBox = document.getElementById("searchBox");
const suggestions = document.getElementById("suggestions");
const statusBox = (() => {
  // create a small status line in the page if not present
  let el = document.getElementById("loaderStatus");
  if (!el) {
    el = document.createElement("div");
    el.id = "loaderStatus";
    el.style.fontSize = "13px";
    el.style.marginTop = "8px";
    el.style.color = "#222";
    document.querySelector(".container")?.appendChild(el);
  }
  return el;
})();

// CONFIG: put your GitHub RAW URL here (if you have uploaded words.txt).
// Example:
// const GITHUB_RAW = "https://raw.githubusercontent.com/<username>/Text-Autocomplete/main/words.txt";
const GITHUB_RAW = ""; // <<--- paste your raw.githubusercontent URL here if you have one

let words = [];

// helper to set status
function setStatus(msg, isError=false) {
  statusBox.textContent = msg;
  statusBox.style.color = isError ? "#b00020" : "#0b6";
  console.log("STATUS:", msg);
}

// try fetch helper
async function tryFetch(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    const txt = await resp.text();
    return txt;
  } catch (err) {
    console.warn("fetch failed:", url, err);
    return null;
  }
}

// Try multiple locations in sequence:
// 1) relative to web folder: ./words.txt
// 2) parent folder: ../words.txt
// 3) user-supplied GitHub raw URL (if set)
// 4) prompt user to upload file
async function loadWordList() {
  setStatus("Loading word list…");

  // 1. same folder
  let text = await tryFetch("./words.txt");
  if (text) { processWordText(text, "local ./words.txt"); return; }

  // 2. parent folder
  text = await tryFetch("../words.txt");
  if (text) { processWordText(text, "parent ../words.txt"); return; }

  // 3. GitHub raw URL (if configured)
  if (GITHUB_RAW && GITHUB_RAW.trim() !== "") {
    text = await tryFetch(GITHUB_RAW.trim());
    if (text) { processWordText(text, "GitHub raw URL"); return; }
  }

  // 4. try automatic guess of GitHub raw if running from GitHub Pages
  // If page is https://<user>.github.io/<repo>/ then raw URL might be:
  // https://raw.githubusercontent.com/<user>/<repo>/main/words.txt
  try {
    const page = window.location.href;
    const ghMatch = page.match(/^https?:\/\/([^/.]+)\.github\.io\/([^\/]+)\/?/);
    if (ghMatch) {
      const user = ghMatch[1];
      const repo = ghMatch[2];
      const guessed = `https://raw.githubusercontent.com/${user}/${repo}/main/words.txt`;
      text = await tryFetch(guessed);
      if (text) { processWordText(text, "guessed GitHub raw URL: " + guessed); return; }
    }
  } catch(e){ /* ignore */ }

  // not found — show fallback UI
  setStatus("Could not auto-load words.txt. Please upload a dictionary file (words.txt).", true);
  showFileUpload();
}

function processWordText(text, sourceLabel) {
  words = text.split(/\s+/).map(w => w.trim()).filter(Boolean);
  setStatus(`Loaded ${words.length} words from ${sourceLabel}.`);
  console.log(`Loaded ${words.length} words (first 20):`, words.slice(0,20));
}

// show a file input so user can load words manually
function showFileUpload() {
  if (document.getElementById("fileLoader")) return;
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = "fileLoader";
  fileInput.accept = ".txt";
  fileInput.style.marginTop = "8px";
  fileInput.onchange = (ev) => {
    const f = ev.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      processWordText(String(e.target.result), "user upload");
      // remove file input once loaded
      fileInput.remove();
    };
    reader.readAsText(f);
  };
  statusBox.parentNode.appendChild(fileInput);
  setStatus("Please choose words.txt to load (manual upload).", true);
}

// Autocomplete UI behavior
searchBox.addEventListener("input", () => {
  const query = searchBox.value.trim().toLowerCase();
  suggestions.innerHTML = "";
  if (!query || words.length === 0) return;
  const results = [];
  const max = 10;
  // simple fast filter — stops early for performance
  for (let i = 0; i < words.length && results.length < max; ++i) {
    const w = words[i];
    if (!w) continue;
    if (w.toLowerCase().startsWith(query)) results.push(w);
  }
  if (results.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No suggestions found.";
    suggestions.appendChild(li);
  } else {
    results.forEach(r => {
      const li = document.createElement("li");
      li.textContent = r;
      li.onclick = () => { searchBox.value = r; suggestions.innerHTML = ""; };
      suggestions.appendChild(li);
    });
  }
});

// start load
loadWordList();

