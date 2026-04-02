// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
try {
	const word = args.shortcutParameter || "";
	
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
			system: "You are a dictionary. Return only a single dictionary-style entry — word, pronunciation, part of speech, definition, etymology, and one example sentence. No preamble, no alternatives, no reasoning.",
			messages: [{ role: "user", content: "Give me the dictionary entry for " + word + ". Format your response exactly as follows with no variation: first the full dictionary entry, then a line containing only ---, then a line containing only the word plus ^ plus ( plus the part of speech plus ) plus ^ plus the definition plus ^ plus an example. There is no space before or after a ^. The definition starts with a capital letter." }]
		});
		const data = await req.loadJSON();
		return data.content[0].text;
	}

	let response = await getWord();
	Script.setShortcutOutput(response);
} catch (e) {
	Script.setShortcutOutput("ERROR: " + e.message);
}