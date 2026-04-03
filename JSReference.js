// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
try {
	const keyword = args.shortcutParameter || "EMPTY_ARRAY";

	const apiKey = Keychain.get("anthropicKey");
	const req = new Request("https://api.anthropic.com/v1/messages");

	const sysinstructions = `You are a JavaScript reference provider. You will recieve inputs and give a concise but complete explanation of the JavaScript keyword or principal implied. Plain text results only. Use tabs for code formatting. Scan your response for keywords that are not compatible with scriptable and obscure them by surrounding with quotes and respond with [keyword] is not compatible with the Scriptable enviromnent. Where [keyword] is allowed, it is [normal response]... When met with a query that is not a JavaScript keyword, built-in method, or programming concept reply with "[query]" is not a JavaScript keyword, built-in method, or programming concept with no other explanation`

	let response = null;
	let count = 0;

	while (!response?.content?.[0] && count < 3) {
		req.method = "POST";
		req.headers = {
			"x-api-key": apiKey,
			"anthropic-version": "2023-06-01",
			"content-type": "application/json"
		};
		req.body = JSON.stringify({
			model: "claude-sonnet-4-6",
			max_tokens: 1024,
			system: sysinstructions,
			messages: [{ role: "user", content: keyword }]
		});
		
		response = await req.loadJSON();
		count++;
		
	}
	


	if (!response?.content?.[0]) {
		Script.setShortcutOutput("API ERROR: " + JSON.stringify(response));
		return;
	}

	Script.setShortcutOutput(response.content[0].text);

} catch (e) {
	Script.setShortcutOutput("ERROR: " + e.message);
}