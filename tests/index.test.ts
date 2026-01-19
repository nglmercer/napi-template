import { expect, test, describe } from "bun:test";
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

describe("NAPI Module Tests", () => {
  // 1. Test Synchronous Functions
  test("math operations: add and divide", () => {
    expect(add(1, 5)).toBe(6);
    expect(divideNumbers(1, 2)).toBe(0.5);
  });

  test("string formatting: createGreeting", () => {
    const greeting = createGreeting("user", "-");
    expect(greeting).toContain("user");
    expect(greeting).toBe("- user, welcome to NAPI!");
  });

  test("array mapping: processNumbers", () => {
    const result = processNumbers([1, 2, 3]);
    expect(result).toEqual([2, 4, 6]);
  });

  // 2. Test Classes
  test("Message class instantiation", () => {
    const msg = new Message("hello", MessageType.Info);
    expect(msg).toBeDefined();
    // Use the methods your console.log suggested exist
    expect(typeof msg.getTypeString).toBe("function");
  });

  // 3. Test Asynchronous Functions
  test("async sequence generation", async () => {
    const sequence = await generateSequence(1, 5);
    expect(sequence).toHaveLength(5);
    expect(sequence).toEqual([1, 2, 3, 4, 5]);
  });

  test("async delayed message", async () => {
    const message = await delayedMessage(100); // Reduced delay for faster tests
    expect(message).toBe("Success after delay");
  });
});
