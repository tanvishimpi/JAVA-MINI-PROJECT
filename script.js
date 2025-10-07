let lastData = null;
let lastWord = "";

// Fetch word data directly from dictionaryapi.dev
async function searchWord() {
  const word = document.getElementById("wordInput").value.trim();
  if (!word) return alert("⚠️ Please enter a word!");

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    const data = await res.json();

    if (!Array.isArray(data)) return alert("❌ Word not found!");

    const entry = data[0];
    const meanings = entry.meanings || [];
    const definitions = [];

    meanings.forEach(m => {
      m.definitions.forEach(d => {
        definitions.push({
          partOfSpeech: m.partOfSpeech,
          definition: d.definition,
          example: d.example || "No example available"
        });
      });
    });

    lastData = { definitions, images: [
      `https://source.unsplash.com/400x300/?${word}`,
      `https://source.unsplash.com/400x300/?${word},book`,
      `https://source.unsplash.com/400x300/?${word},education`
    ]};
    lastWord = word;

    document.getElementById("output").innerHTML = `
      ✅ Word <b>${word}</b> found!<br>
      Choose what to display below 👇
    `;
  } catch (err) {
    alert("🚨 Error fetching word data!");
    console.error(err);
  }
}

// Show Definitions
function showDefinitions() {
  if (!lastData) return alert("Search a word first!");
  const defHTML = lastData.definitions
    .map(d => `<p><b>${d.partOfSpeech}:</b> ${d.definition}</p>`)
    .join("<hr>");
  document.getElementById("output").innerHTML = `<h3>📖 Definitions:</h3>${defHTML}`;
}

// Show Examples
function showExamples() {
  if (!lastData) return alert("Search a word first!");
  const exHTML = lastData.definitions
    .map(d => `<p>💬 ${d.example}</p>`)
    .join("");
  document.getElementById("output").innerHTML = `<h3>💬 Examples:</h3>${exHTML}`;
}

// Play Pronunciation (Text-to-Speech)
function playPronunciation() {
  if (!lastWord) return alert("Search a word first!");
  const utter = new SpeechSynthesisUtterance(lastWord);
  utter.lang = "en-US";
  speechSynthesis.speak(utter);
}

// Show Related Images
function showImages() {
  if (!lastData) return alert("Search a word first!");
  const imgHTML = lastData.images
    .map(src => `<img src="${src}" alt="${lastWord}" 
                 onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">`)
    .join("");
  document.getElementById("output").innerHTML = `<h3>🖼️ Related Images:</h3><div>${imgHTML}</div>`;
}
