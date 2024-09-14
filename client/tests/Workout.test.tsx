/**
 * @jest-environment jsdom
 */

import "@testing-library/jest-dom/extend-expect";
import {renderApp, setLogin, unsetLogin} from "./App.test";

function renderWorkout() {
  window.location.hash = "#/main/workout";
  return renderApp();
}

beforeEach(unsetLogin);

test('go to login page when not login', () => {
  renderWorkout();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders stats page when login', () => {
  setLogin();
  const {container} = renderWorkout();
  const divElements = container.getElementsByClassName("Workout");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/workout");
});
