// import * as napi from "../dist/index.js";

// console.log("🚀 NAPI TypeScript Example - Development Mode");
// console.log("===========================================\n");

// // Example 1: Basic Functions
// console.log("📝 Example 1: Basic Functions");
// console.log("-----------------------------");

// const sum = napi.add(5, 10);
// console.log("add(5, 10) =", sum);

// const greeting = napi.create_greeting("Alice", "Welcome");
// console.log('create_greeting("Alice", "Welcome") =', greeting);

// const greetingNoPrefix = napi.create_greeting("Bob", null);
// console.log('create_greeting("Bob", null) =', greetingNoPrefix);

// const numbers = [1.0, 2.0, 3.0, 4.0, 5.0];
// const doubled = napi.processNumbers(numbers);
// console.log("processNumbers([1,2,3,4,5]) =", doubled);

// // Example 2: Enums and Structs
// console.log("\n📝 Example 2: Enums and Structs");
// console.log("--------------------------------");

// const msg1 = new napi.Message("Hello from TypeScript", napi.MessageType.Info);
// console.log("Message content:", msg1.content);
// console.log("Message type:", msg1.type);
// console.log("Type string:", msg1.getTypeString());
// console.log("Formatted:", msg1.getFormatted());

// const msg2 = new napi.Message("This is a warning", napi.MessageType.Warning);
// console.log("Warning message:", msg2.getFormatted());

// // Example 3: Async Functions
// console.log("\n📝 Example 3: Async Functions");
// console.log("------------------------------");

// await (async () => {
//   console.log("Starting async operations...");

//   const delayedResult = await napi.delayedMessage(200);
//   console.log("delayedMessage(200ms) =", delayedResult);

//   const sequence = await napi.generateSequence(10, 5);
//   console.log("generateSequence(10, 5) =", sequence);

//   console.log("Async operations completed! ✅");
// })();

// // Example 4: Error Handling
// console.log("\n📝 Example 4: Error Handling");
// console.log("-----------------------------");

// try {
//   const validDivision = napi.divideNumbers(10, 2);
//   console.log("divideNumbers(10, 2) =", validDivision);
// } catch (error) {
//   console.log("Unexpected error:", error);
// }

// try {
//   const invalidDivision = napi.divideNumbers(10, 0);
//   console.log("This shouldn't print:", invalidDivision);
// } catch (error) {
//   console.log("Expected error caught:", error);
// }

// console.log("\n✅ All examples completed!");
