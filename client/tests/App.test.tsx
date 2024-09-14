/**
 * @jest-environment jsdom
 */

import React from 'react';
import {render} from '@testing-library/react';
import App from '../src/App';
import "@testing-library/jest-dom/extend-expect";
import {HashRouter, Route, Routes} from "react-router-dom";

export function renderApp() {
  return render(
    <HashRouter>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </HashRouter>
  );
}

export function setLogin() {
  localStorage.setItem("login", "1");
}

export function unsetLogin() {
  localStorage.removeItem("login");
}

beforeEach(unsetLogin);

test('renders login page when not login', () => {
  const {container} = renderApp();
  const divElements = container.getElementsByClassName("Login");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/login");
});

test('renders home page when login', () => {
  setLogin();
  const {container} = renderApp();
  const divElements = container.getElementsByClassName("Home");
  expect(divElements.length).toBe(1);
  expect(divElements.item(0)).toBeInTheDocument();
  const path = window.location.hash;
  expect(path).toBe("#/main/home");
});
