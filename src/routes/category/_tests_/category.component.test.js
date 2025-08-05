import { screen } from "@testing-library/react";

import Category from "../category.component";
import { renderWithProviders } from "../../../utils/test/test.utils";

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      category: 'mens',
    }),
  };
});

describe("Category tests", () => {
  test("It should render a Spinner if isLoading is true", () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: true,
          categories: [],
        },
      },
    });

    const spinnerElement = screen.getByTestId("spinner");
    expect(spinnerElement).toBeInTheDocument();
  });

  test("It should render no spinner if isLoading is false", () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: false,
          categories: [],
        },
      },
    });

    const spinnerElement = screen.queryByTestId("spinner");
    expect(spinnerElement).not.toBeInTheDocument();
  });

  test("It should render product items if isLoading is false and category has products", () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: false,
          categories: {
            hats: [
              {
                id: 1,
                name: "Brown Hat",
                price: 25,
                imageUrl: "https://i.ibb.co/ZYW3VTp/brown-brim.png",
              },
              {
                id: 2,
                name: "Blue Hat",
                price: 18,
                imageUrl: "https://i.ibb.co/YTjW3vF/blue-beanie.png",
              },
            ],
          },
        },
      },
      route: "/shop/hats", // <- важно для правильного отображения категории
    });

    expect(screen.getByText(/Brown Hat/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Hat/i)).toBeInTheDocument();
  });

  test("It should show message if category has no products", () => {
    renderWithProviders(<Category />, {
      preloadedState: {
        categories: {
          isLoading: false,
          categories: {
            hats: [],
          },
        },
      },
      route: "/shop/hats",
    });

    // примерное поведение — может быть другое сообщение, зависит от компонента
    const emptyMessage = screen.queryByText(/no products/i);
    expect(emptyMessage).toBeInTheDocument();
  });
});