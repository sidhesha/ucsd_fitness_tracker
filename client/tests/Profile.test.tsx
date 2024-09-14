/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {renderApp, setLogin, unsetLogin} from "./App.test";
import {mockFetch} from "./mock";

function renderProfile() {
  window.location.hash = "#/main/profile";
  return renderApp();
}

beforeEach(unsetLogin);

beforeAll(mockFetch);

test('go to login page when not login', () => {
  renderProfile();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders profile page when login', () => {
  setLogin();
  const {container} = renderProfile();
  const divElements = container.getElementsByClassName("Profile");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/profile");
});
