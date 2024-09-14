/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {renderApp, setLogin, unsetLogin} from "./App.test";

export function renderHome() {
  window.location.hash = "#/main/home";
  return renderApp();
}

beforeEach(unsetLogin);

test('go to login page when not login', () => {
  renderHome();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders home page when login', () => {
  setLogin();
  const {container} = renderHome();
  const divElements = container.getElementsByClassName("Home");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/home");
});
