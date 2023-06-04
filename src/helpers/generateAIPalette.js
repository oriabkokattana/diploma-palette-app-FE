const aiGeneratorUrl = 'https://api.huemint.com/color';

export const generateAIPalettes = async (
  mode,
  numColors,
  temperature,
  numResults,
  adjacency,
  palette
) => {
  try {
    const body = {
      mode,
      num_colors: parseInt(numColors),
      temperature: parseFloat(temperature),
      num_results: numResults,
      adjacency,
      palette,
    };

    const resp = await fetch(aiGeneratorUrl, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    return data.results;
  } catch (error) {
    throw new Error(error.message);
  }
};
