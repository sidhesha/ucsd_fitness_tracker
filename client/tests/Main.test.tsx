/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {renderApp, setLogin, unsetLogin} from "./App.test";

function renderMain() {
  window.location.hash = "#/main";
  return renderApp();
}

beforeEach(unsetLogin);

test('go to login page when not login', () => {
  renderMain();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders home page when login', () => {
  setLogin();
  const {container} = renderMain();
  const divElements = container.getElementsByClassName("Home");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/home");
});

test('does not render menu when not login', () => {
  const {container} = renderMain();
  const divElements = container.getElementsByClassName("Menu");
  expect(divElements.length).toBe(0);
})

test('renders menu when login', () => {
  setLogin();
  const {container} = renderMain();
  const divElements = container.getElementsByClassName("Menu");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
});
