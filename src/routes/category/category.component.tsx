import { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import ProductCard from "../../components/product-card/product-card.component";
import Spinner from "../../components/spinner/spinner.component";
import {
  selectCategoriesMap,
  selectIsCategoriesLoading,
} from "../../store/categories/category.selector";

import { CategoryContainer, CategoryTitle } from './category.styles'; // ← вот импорт

type CategoryRouteParams = {
  category: string;
};

type Product = {
  id: number | string;
  name: string;
  price: number;
  imageUrl: string;
};

const Category = () => {
  const { category } = useParams<CategoryRouteParams>();
  const categoriesMap = useSelector(selectCategoriesMap);
  const isLoading = useSelector(selectIsCategoriesLoading);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (category && categoriesMap[category]) {
      setProducts(categoriesMap[category]);
    }
  }, [category, categoriesMap]);

  return (
  <Fragment>
    <CategoryTitle>{category?.toUpperCase()}</CategoryTitle>
    {isLoading ? (
      <Spinner />
    ) : (
      <CategoryContainer>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </CategoryContainer>
    )}
  </Fragment>
);
};

export default Category;