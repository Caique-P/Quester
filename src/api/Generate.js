import Translator from "./Translator";
const DEFAULT_PARAMS = {
  model: "text-davinci-003",
  temperature: 0.1,
  max_tokens: 2048,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
};

function generatePrompt(ask, userLang) {
  if (window.location.pathname != "/readme") {
    const Ask = ask[0].toUpperCase() + ask.slice(1).toLowerCase();
    return `${Translator("Ask", userLang)}:
${ask}
`;
  } else {
    return `${Translator("readmeAsk", userLang)}:
${ask}
`;
  }
}
function generateSuggestions(ask, userLang) {
  const Ask = ask[0].toUpperCase() + ask.slice(1).toLowerCase();
  return `${Translator("suggestions", userLang)}:
${ask}
`;
}
export default async function onSubmit(
  askInput,
  userLang,
  temperature,
  suggestions
) {
  if (temperature != 0.1) {
    DEFAULT_PARAMS.temperature = temperature;
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + String(
        localStorage.getItem("openai")
      ),
    },
    body: JSON.stringify({
      ...DEFAULT_PARAMS,
      prompt:
        suggestions === undefined
          ? generatePrompt(askInput, userLang)
          : generateSuggestions(askInput, userLang),
    }),
  };
  const response = await fetch(
    "https://api.openai.com/v1/completions",
    requestOptions
  );
  if (response.status != 200 && localStorage.getItem("openai").length > 40) {
     localStorage.setItem("openai", ""); 
     window.location.reload();

    
  }

  const data = await response.json();

  //remove the first line if has a line break
  for (let i = 0; i < 3; i++) {
    if (data.choices[0].text.split("\n")[0] === "") {
      data.choices[0].text = data.choices[0].text.slice(1);
    }
  }
  if (suggestions != undefined) {
    let newData = data.choices[0].text.split("-");

    return newData;
  }

  return data.choices[0].text;
}
