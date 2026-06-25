export const getWeather = async (
  lat: number,
  lon: number
) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
  );

  return await res.json();
};