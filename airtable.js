// Don't forget to add your API key to the key variable
const KEY = ""

let table = base.getTable("Table 1");
let view = table.getView('Needs Info');
let result = await view.selectRecordsAsync({fields: ['Prompt']});
for (let record of result.records) {
    if (record) {
        let prompt = await record.getCellValue('Prompt');
        let results = await chatCompletions(prompt)
        await table.updateRecordAsync(record, {[`Social post`]: results,});
    }
}

async function chatCompletions(prompt) {
    let url = "https://api.openai.com/v1/chat/completions";
    let temperature = 0.7, maxLength = 256, topP = 1, frequencyPenalty = 0, presencePenalty = 0;

    // set up the API call variables
    let request = {
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": prompt}],
        temperature: temperature,
        top_p: topP,
        max_tokens: maxLength,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty
    }

    let data = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': 'Bearer ' + KEY,
    };
    let response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(request),
            headers: data,
    });

    // convert the response to JSON
    let answer = await response.json();

    //extract just the OpenAI GPT answer
    answer = answer.choices[0].message.content;

    return answer
}
