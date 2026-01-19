import {
  Message,
  MessageType,
  createGreeting,
  add,
  processNumbers,
  divideNumbers,
  generateSequence,
  delayedMessage,
} from "../index";
const msg = new Message("text", MessageType.Info);
console.log("msg", msg);
console.log("greeting", createGreeting("user", "-"));
console.log("add", add(1, 5));
console.log("divide", divideNumbers(1, 2));
console.log("Numbers", processNumbers([1, 2, 3]));
async function main() {
  const sequence = await generateSequence(1, 10);
  console.log("sequence", sequence);
  const message = await delayedMessage(1000);
  console.log("message", message);
  return { sequence, message };
}
main();
