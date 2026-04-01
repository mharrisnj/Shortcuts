// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
try {
	const apiKey = "your-key";
	const wordList = args.plainTexts[0] || "";
	const letters = "abcdefghijklmnopqrstuvwxy";
	const randomLetter = letters[Math.floor(Math.random() * letters.length)];

	async function getWord() {
		const req = new Request("https://api.anthropic.com/v1/messages");
		const apiKey = Keychain.get("anthropicKey");
		req.method = "POST";
		req.headers = {
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
			"content-type": "application/json"
		};
		req.body = JSON.stringify({
			model: "claude-sonnet-4-6",
			//model: "claude-haiku-4-5-20251001",
			max_tokens: 1024,
			system: "You are a word-of-the-day generator. Select a word at random from the broader English lexicon. Return only a single dictionary-style entry — word, pronunciation, part of speech, definition, etymology, and one example sentence. No preamble, no alternatives, no reasoning. Real, established words only, in common usage for at least 100 years. Not from the Dictionary of Obscure Sorrows or any invented lexicon. You must not use any word from this list: " + wordList,
			messages: [{ role: "user", content: "Give me today's word. It must begin with " + randomLetter + ". Format your response exactly as follows with no variation: first the full dictionary entry, then a line containing only ---, then a line containing only the word plus ^ plus ( plus the part of speech plus ) plus ^ plus the definition plus ^ plus an example. There is no space before or after a ^. The definition starts with a capital letter." }]
		});
		const data = await req.loadJSON();
		return data.content[0].text;
	}

	let response = await getWord();
	let parts = response.split("---");
	let dataLine = parts[1].trim().split("^");
	let word = dataLine[0].trim();

	let attempts = 0;
	while (wordList.toLowerCase().includes(word.toLowerCase()) && attempts < 5) {
		response = await getWord();
		parts = response.split("---");
		dataLine = parts[1].trim().split("^");
		word = dataLine[0].trim();
		attempts++;
	}

	Script.setShortcutOutput(response);

} catch (e) {
	Script.setShortcutOutput("ERROR: " + e.message);
}	