import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const renderWithProviders = () =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );

test("renders secure login copy", () => {
  renderWithProviders();
  expect(
    screen.getByRole("heading", { name: /secure international payments portal/i })
  ).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: /sign in/i })).toBeInTheDocument();
});
