/* 定期的にNEWS投稿をする */

export const handler = async (event, context) => {
	const targetUrl = process.env.TARGET_URL;

	if (!targetUrl) {
		return {
			statusCode: 500,
			body: JSON.stringify('Error: TARGET_URL environment variable not set.'),
		};
	}

	try {
		const response = await fetch(targetUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				apiKey: process.env.NEWS_API_KEY,
			}),
		});
		const text = await response.text();

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				message: `Fetched ${targetUrl} successfully.`,
				status_code: response.status,
				response_text: text
			}),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify(`Error fetching ${targetUrl}: ${error}`),
		};
	}
};