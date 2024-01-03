"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import { type FC, useEffect, useRef } from "react";
import { TProductListItem } from "@/app/api/adminPanel/products/list/types";
import { ProductListItem } from "@/app/pages/catalogPage/productListItem";
import "./ProductList.scss";

type TProps = {
  isCardsLine: boolean;
  onPageChange?: (page: number) => void;
  pages: TProductListItem[][];
  scrollIntoPage?: number;
};

export const ProductList: FC<TProps> = ({ isCardsLine, pages, onPageChange, scrollIntoPage }) => {
  const listItems = useRef<(HTMLLIElement | null)[][]>([]);
  const page = useRef<number | null>(null);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visiblePage = Number((entry.target as HTMLLIElement).dataset.page);
            if (visiblePage !== page.current) {
              page.current = visiblePage;
              onPageChange?.(visiblePage);
            }
          }
        });
      },
      {
        root: null,
        threshold: 1,
      },
    );
    listItems.current.forEach((page, i) => {
      page.forEach((el) => {
        if (el) {
          intersectionObserver.observe(el);
          el.dataset.page = (i + 1).toString();
        }
      });
    });
    return () => intersectionObserver.disconnect();
  });

  useEffect(() => {
    if (scrollIntoPage) {
      const page = listItems.current[scrollIntoPage - 1];
      const firstProduct = page[0];
      if (firstProduct) {
        firstProduct.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [scrollIntoPage]);

  return (
    <div
      className={clsx("ProductList", {
        ProductList__line: isCardsLine,
      })}
    >
      {!isNil(pages) &&
        // TODO random keys are bad. Very bad.
        pages.flatMap((page, i) =>
          page === undefined
            ? []
            : page.map((product, j) => {
                return (
                  <ProductListItem
                    key={product.uuid}
                    product={product}
                    ref={(el) => ((listItems.current[i] || (listItems.current[i] = []))[j] = el)}
                    isCardsLine={isCardsLine}
                  />
                );
              }),
        )}
    </div>
  );
};
