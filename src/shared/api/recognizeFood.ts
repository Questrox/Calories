import { API_TOKEN, MODEL_ID } from "../../../config.local";

/**
 * Отправляет изображение на Hugging Face и возвращает распознанные продукты.
 * Таймаут по умолчанию — 5 секунд.
 */
export async function recognizeFood(imageBase64: string, timeout = 5000) {
  try {
    console.log("Отправляю запрос к Hugging Face...");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`https://router.huggingface.co/hf-inference/models/${MODEL_ID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: `data:image/jpeg;base64,${imageBase64}`,
        // options: { wait_for_model: true }
      }),
      signal: controller.signal,
    });

    clearTimeout(timer);

    console.log("Фото отправлено, HTTP статус:", response.status);

    const text = await response.text();
    console.log("Ответ Hugging Face (raw):", text);

    if (!response.ok) {
      // проверяем, вернулась ли ошибка из-за модели
      if (text.includes("Model not ready")) {
        console.warn("Модель ещё не готова, попробуйте позже.");
        return [];
      }
      throw new Error(`Inference request failed: ${response.statusText}`);
    }

    const result = JSON.parse(text);
    console.log("Распознанное блюдо:", result);
    return result;
  } catch (err: any) {
    if (err.name === "AbortError") {
      console.warn("Запрос к Hugging Face превысил время ожидания");
    } else {
      console.error("Ошибка:", err);
    }
    return [];
  }
}
