const key = ""

let table = base.getTable("Table 1");
let view = table.getView('Needs Info');
let result = await view.selectRecordsAsync({fields: ['Prompt']});
for (let record of result.records) {
    if (record) {
        let prompt = await record.getCellValue('Prompt');
        output.table(record.getCellValue('Prompt'));
        output.text(prompt)
        let results = await chatCompletions(prompt)
        output.text(results)
        await table.updateRecordAsync(record, {[`Social post`]: results,});
    }
}

async function chatCompletions(prompt) {
    let url = "https://api.openai.com/v1/chat/completions";
    let temperature = 0.7, maxLeght = 256, topP = 1, frequencyPenalty = 0, presencePenalty = 0;

    // set up the API call variables
    let request = {
        model: 'gpt-3.5-turbo',
        messages: [{"role": "user", "content": prompt}],
        temperature: temperature,
        top_p: topP,
        max_tokens: maxLeght,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty
    }

    let data = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': 'Bearer ' + key,
    };
    output.text(JSON.stringify(request))
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