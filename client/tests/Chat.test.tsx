/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {renderApp, setLogin, unsetLogin} from "./App.test";
import {mockFetch} from "./mock";
// @ts-ignore
import MockedSocket from "socket.io-mock";

function renderChat() {
  window.location.hash = "#/main/chat";
  return renderApp();
}

beforeEach(unsetLogin);

beforeAll(() => {
  mockFetch();
  const mockedSocket = new MockedSocket();
  jest.mock('../src/util/socket', jest.fn(() => mockedSocket));
  // @ts-ignore
  window.setImmediate = window.setTimeout;
});

afterAll(() => {
  jest.unmock('../src/util/socket');
});

test('go to login page when not login', () => {
  renderChat();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders chat page when login', () => {
  setLogin();
  const {container} = renderChat();
  const divElements = container.getElementsByClassName("Chat");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/chat");
});
