import { error } from "console";
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export async function sendData(firstId, secondId) {
  console.log("Id from Column 1 is: " + firstId);
  console.log("Id from Column 2 is: " + secondId);
  await delay(2500);
}
