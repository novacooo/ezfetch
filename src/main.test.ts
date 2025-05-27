import { assertEquals, assertExists } from "@std/assert";
import ezfetch, { HttpMethod } from "./main.ts";
import { assertObjectMatch } from "@std/assert/object-match";

Deno.test("ezfetch.create should initialize instance with correct url", () => {
  // Arrange & Act
  const instance = ezfetch.create("https://example.com");

  // Assert
  assertExists(instance);
});

Deno.test("ezfetch.setMethod should set HTTP method and return new instance", () => {
  // Arrange
  const instance = ezfetch.create("https://example.com");

  // Act
  const instanceWithMethod = instance.setMethod(HttpMethod.POST);

  // Assert
  assertExists(instanceWithMethod);
  // Verify immutability - should return new instance
  assertEquals(instance !== instanceWithMethod, true);
});

Deno.test("ezfetch.get should set HTTP method and extend url", () => {
  // Arrange
  const baseUrl = "https://example.com";
  const instance = ezfetch.create(baseUrl);

  // Act
  const baseUrlResponse = instance.get().send();
  const endpointResponse = instance.get("/endpoint").send();

  // Assert
  assertEquals(baseUrlResponse.method, HttpMethod.GET);
  assertEquals(endpointResponse.method, HttpMethod.GET);
  assertEquals(baseUrlResponse.url, baseUrl);
  assertEquals(endpointResponse.url, `${baseUrl}/endpoint`);
});

Deno.test("ezfetch.send should return expected response", () => {
  // Arrange
  const instance = ezfetch.create("https://example.com").setMethod(
    HttpMethod.GET,
  );

  // Act
  const response = instance.send();

  // Assert
  assertEquals(response.ok, true);
});

Deno.test("ezfetch should support all HTTP methods", () => {
  // Arrange
  const baseInstance = ezfetch.create("https://example.com");

  // Act - test each HTTP method
  const getInstance = baseInstance.setMethod(HttpMethod.GET);
  const postInstance = baseInstance.setMethod(HttpMethod.POST);
  const putInstance = baseInstance.setMethod(HttpMethod.PUT);
  const patchInstance = baseInstance.setMethod(HttpMethod.PATCH);
  const deleteInstance = baseInstance.setMethod(HttpMethod.DELETE);

  // Assert - all instances should be created
  assertExists(getInstance);
  assertExists(postInstance);
  assertExists(putInstance);
  assertExists(patchInstance);
  assertExists(deleteInstance);

  // Assert - all instances should be able to send requests
  assertEquals(getInstance.send().ok, true);
  assertEquals(postInstance.send().ok, true);
  assertEquals(putInstance.send().ok, true);
  assertEquals(patchInstance.send().ok, true);
  assertEquals(deleteInstance.send().ok, true);
});

type PlaceholderData = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

Deno.test("ezfetch.json should return expected response", async () => {
  const expectedData: PlaceholderData = {
    userId: 1,
    id: 1,
    title: "delectus aut autem",
    completed: false,
  };

  const response = await ezfetch.create(
    "https://jsonplaceholder.typicode.com/todos/1",
  )
    .get()
    .json<PlaceholderData>();

  assertObjectMatch(expectedData, response);
});
