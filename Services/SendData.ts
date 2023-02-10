import { error } from "console";
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function sendData(firstId, secondId) {
  await delay(2500);
}
