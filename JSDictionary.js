// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
try {
	const keyword = args.shortcutParameter || "EMPTY_ARRAY";

	const apiKey = Keychain.get("anthropicKey");
	const req = new Request("https://api.anthropic.com/v1/messages");

	req.method = "POST";
	req.headers = {
		"x-api-key": apiKey,
		"anthropic-version": "2023-06-01",
		"content-type": "application/json"
	};
	req.body = JSON.stringify({
		model: "claude-sonnet-4-6",
		max_tokens: 1024,
		system: 'You are a JavaScript reference dictionary. You will recieve one-word queries, and your replies be simple. If it is not a valid JavaScript keyword, try other capitalizations. If the word is found with a different capitalization, use the corrected word. The response will have no markdown formatting, no backticks, no code fences. You will give either the syntax or context as appropriate using the correctly capitalized word, followed by a blank line, followed by a brief description, followed by a blank line, followed by an instructive example. For a properly formatted request, there will be no follow-up information, follow-up questions, no suggestions or anything else to the reply. If the input is not a valid JavaScript input, respond with "The input [keyword] is not a JavaScript keyword. Did you mean [one or two examples]?" If no word is provided, reply with "No input word provided. Supply a single JavaScript keyword." If more than one keyword is provided, reply with "Multiple input words found. Supply a single Java Script keyword." If there is an error not defined above, reply as appropriate. This is not meant to be an interactive session.',
		messages: [{ role: "user", content: keyword }]
	});
	const response = await req.loadJSON();

	if (!response.content) {
		Script.setShortcutOutput("API ERROR: " + JSON.stringify(response));
		return;
	}

	Script.setShortcutOutput(response.content[0].text);
}

catch (e) {
	Script.setShortcutOutput("ERROR: " + e.message);
}
