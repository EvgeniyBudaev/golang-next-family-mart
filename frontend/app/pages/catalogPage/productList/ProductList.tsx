"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import { type FC } from "react";
import { TProductListItem } from "@/app/api/adminPanel/products/list/types";
import { ProductListItem } from "@/app/pages/catalogPage/productListItem";
import "./ProductList.scss";

type TProps = {
  isCardsLine: boolean;
  productList: TProductListItem[];
};

export const ProductList: FC<TProps> = ({ isCardsLine, productList }) => {
  return (
    <div
      className={clsx("ProductList", {
        ProductList__line: isCardsLine,
      })}
    >
      {(productList ?? []).map((product, j) => {
        return (
          <ProductListItem
            key={product.uuid}
            product={product}
            ref={null}
            isCardsLine={isCardsLine}
          />
        );
      })}
    </div>
  );
};
