import { screen, fireEvent } from "@testing-library/dom";
import * as reactRedux from "react-redux";

import Navigation from "../navigation.component";
import { renderWithProviders } from "../../../../utils/test/test.utils";
import { signOutStart } from "../../../../store/user/user.action";

test("should render Sign In link and not Sign Out link if there is no currentUser", () => {
  renderWithProviders(<Navigation />, {
    preloadedState: {
      user: {
        currentUser: null,
      },
    },
  });

  expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  expect(screen.queryByText(/sign out/i)).toBeNull();
});

test("should render Sign Out link and not Sign In link if there is a currentUser", () => {
  renderWithProviders(<Navigation />, {
    preloadedState: {
      user: {
        currentUser: {},
      },
    },
  });

  expect(screen.queryByText(/sign in/i)).toBeNull();
  expect(screen.getByText(/sign out/i)).toBeInTheDocument();
});

test("should not render cart dropdown if isCartOpen is false", () => {
  renderWithProviders(<Navigation />, {
    preloadedState: {
      cart: {
        isCartOpen: false,
        cartItems: [],
      },
    },
  });

  expect(screen.queryByText(/your cart is empty/i)).toBeNull();
});

test("should render cart dropdown if isCartOpen is true", () => {
  renderWithProviders(<Navigation />, {
    preloadedState: {
      cart: {
        isCartOpen: true,
        cartItems: [],
      },
    },
  });

  expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
});

test("should dispatch signOutStart action when clicking on the Sign Out link", async () => {
  const mockDispatch = jest.fn();
  jest.spyOn(reactRedux, "useDispatch").mockReturnValue(mockDispatch);

  renderWithProviders(<Navigation />, {
    preloadedState: {
      user: {
        currentUser: {},
      },
    },
  });

  const signOutLinkElement = screen.getByText(/sign out/i);
  await fireEvent.click(signOutLinkElement);

  expect(mockDispatch).toHaveBeenCalledWith(signOutStart());
});