/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {setLogin, unsetLogin} from "./App.test";
import {renderHome} from "./Home.test";
import {act} from "@testing-library/react";
import {mockFetch} from "./mock";
// @ts-ignore
import MockedSocket from "socket.io-mock";

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

function assertMenu(container: HTMLElement) {
  const divElements = container.getElementsByClassName("Menu");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  // @ts-ignore
  const buttons = divElements.item(0).getElementsByTagName("button");
  expect(buttons.length).toBe(4);
  return buttons;
}

function assertPage(container: HTMLElement, className: string, path: string) {
  const targetElements = container.getElementsByClassName(className);
  expect(targetElements.length).toBe(1);
  expect(targetElements.item(0)).toBeInTheDocument();
  const menuElements = container.getElementsByClassName("Menu");
  expect(menuElements.length).toBe(1);
  expect(menuElements.item(0)).toBeInTheDocument();
  const realPath = window.location.hash;
  expect(realPath).toBe(path);
}

test('stay on home when click on home', () => {
  setLogin();
  const {container} = renderHome();
  const buttons = assertMenu(container);
  // @ts-ignore
  act(() => buttons.item(0).click());
  assertPage(container, "Home", "#/main/home");
});

test('go to workout when click on workout', () => {
  setLogin();
  const {container} = renderHome();
  const buttons = assertMenu(container);
  // @ts-ignore
  act(() => buttons.item(1).click());
  assertPage(container, "Workout", "#/main/workout");
});

test('go to chat when click on chat', () => {
  setLogin();
  const {container} = renderHome();
  const buttons = assertMenu(container);
  // @ts-ignore
  act(() => buttons.item(2).click());
  assertPage(container, "Chat", "#/main/chat");
});

test('go to profile when click on profile', () => {
  setLogin();
  const {container} = renderHome();
  const buttons = assertMenu(container);
  // @ts-ignore
  act(() => buttons.item(3).click());
  assertPage(container, "Profile", "#/main/profile");
});
