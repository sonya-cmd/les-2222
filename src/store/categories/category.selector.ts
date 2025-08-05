import { createSelector } from 'reselect';

import { RootState } from '../store';
import { CategoriesState } from './category.reducer';
import { CategoryMap } from './category.types';

// Предполагаем, что state имеет поле `categories`, которое соответствует CategoriesState
type State = {
  categories: CategoriesState;
};

// Базовый селектор
const selectCategoryReducer = (state: RootState): CategoriesState => state.categories;

// 👉 Массив категорий
export const selectCategories = createSelector(
  [selectCategoryReducer],
  (categoriesSlice) => categoriesSlice.categories
);

// 👉 Альтернативное имя
export const selectCategoriesMap = createSelector(
  [selectCategories],
  (categories): CategoryMap =>
    categories.reduce((acc, category) => {
      const { title, items } = category;
      acc[title.toLowerCase()] = items;
      return acc;
    }, {} as CategoryMap)
);

// 👉 Флаг загрузки
export const selectIsCategoriesLoading = createSelector(
  [selectCategoryReducer],
  (categoriesSlice) => categoriesSlice.isLoading
);