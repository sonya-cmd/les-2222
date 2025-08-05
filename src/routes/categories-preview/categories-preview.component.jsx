import { useSelector } from "react-redux";
import { Fragment, useEffect } from "react";

import {
  selectCategoriesMap,
  selectIsCategoriesLoading,
} from "../../store/categories/category.selector";

import CategoryPreview from "../../components/category-preview/category-preview.component";
import Spinner from "../../components/spinner/spinner.component";

const CategoriesPreview = () => {
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectIsCategoriesLoading);

  useEffect(() => {
    console.log("✅ categoriesMap:", categoriesMap);
    console.log("⌛ isLoading:", isLoading);
  }, [categoriesMap, isLoading]);

  if (!categoriesMap || Object.keys(categoriesMap).length === 0) {
    return <div>Загрузка... (категорий нет)</div>;
  }

  return (
    <Fragment>
      {isLoading ? (
        <Spinner />
      ) : (
        Object.keys(categoriesMap).map((title) => {
          const products = categoriesMap[title];
          return (
            <CategoryPreview key={title} title={title} products={products} />
          );
        })
      )}
    </Fragment>
  );
};

export default CategoriesPreview;