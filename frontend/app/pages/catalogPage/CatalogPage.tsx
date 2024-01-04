"use client";

import { createBrowserHistory } from "history";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail";
import type { TProductList, TProductListItem } from "@/app/api/adminPanel/products/list/types";
import { useTranslation } from "@/app/i18n/client";
import { ProductList } from "@/app/pages/catalogPage/productList";
import { DEFAULT_PAGE_LIMIT } from "@/app/shared/constants/pagination";
import type { TSorting } from "@/app/shared/types/sorting";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogPage.scss";

type TProductRange = {
  startProduct: number;
  endProduct: number;
};

type TProps = {
  catalogDetail: TCatalogDetail;
  productList: TProductList;
};

const PLACEHOLDER_PRODUCT: TProductListItem = {
  id: 0,
  catalogId: 0,
  uuid: "",
  alias: "",
  name: "",
  createdAt: "",
  updatedAt: "",
  isDeleted: false,
  isEnabled: false,
  catalogAlias: "",
  images: [],
};

const history = typeof document !== "undefined" ? createBrowserHistory() : null;

export const CatalogPage: FC<TProps> = (props) => {
  const { t } = useTranslation("index");
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams?.get("page")) || 1);
  const lastLoadedPage = useRef(page);
  const scrollIntoPage = useRef(page === 1 ? undefined : page);

  const [catalog, setCatalog] = useState(props.catalogDetail);
  const [products, setProducts] = useState(props.productList ?? []);
  const [pages, setPages] = useState(
    new Array(page - 1).fill(undefined).concat([props.productList.content]),
  );

  const [isCardsLine, setIsCardsLine] = useState(false);
  const [productRange, setProductRange] = useState<TProductRange>({
    startProduct: 0,
    endProduct: 0,
  });

  const [sorting, setSorting] = useState<TSorting["value"]>(
    searchParams?.get("sort") ?? "updatedAt_asc",
  );

  useEffect(() => {
    setCatalog(props.catalogDetail);
    setProducts(props.productList);
    setPages((productList) => {
      const copy = [...productList];
      copy[props.productList.page - 1] = props.productList.content;
      return copy;
    });
  }, [props.productList]);

  const getFormData = useCallback(() => {
    const formData = new FormData();
    formData.append("sort", sorting);
    formData.append("page", page.toString());
    return formData;
  }, [sorting, page]);

  useEffect(() => {
    if (lastLoadedPage.current !== page) {
      lastLoadedPage.current = page;
      if (pages[page - 1] === undefined) {
        const params = new URLSearchParams(searchParams);
        // params.set(name, value)
        // setSearchParams(new URLSearchParams(getFormData() as any), { preventScrollReset: true });
      } else {
        history?.push({
          ...pathname,
          search: "?" + new URLSearchParams(getFormData() as any).toString(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sorting, page]);

  const handlePageChange = useCallback(
    (page: number) => {
      setPage(page);
    },
    [setPage],
  );

  const getMoreProducts = async () => {
    if (products.content.length < products.totalItems) {
      setPage(pages.length + 1);
    }
  };

  useEffect(() => {
    const { totalItems, page } = products;
    const pageItemsCount = products.content.length;
    setProductRange({
      startProduct: (page - 1) * pageItemsCount + 1,
      endProduct: Math.min(page * pageItemsCount, totalItems),
    });
  }, [products]);

  const onCardsSwitcher = () => {
    setIsCardsLine((prev) => !prev);
  };

  const getRenderedProductsCount = useCallback(() => {
    return pages.map((page) => page?.length ?? DEFAULT_PAGE_LIMIT).reduce((a, b) => a + b, 0);
  }, [pages]);

  return (
    <section className="CatalogPage">
      <div className="CatalogPage-Row">
        <div className="CatalogPage-Title">
          <Typography
            value={products?.content?.[0]?.catalogAlias}
            variant={ETypographyVariant.TextH1Bold}
          />
        </div>
        <Typography
          value={`${productRange.endProduct} ${t("pages.catalog.from")} ${products.totalItems} ${t(
            "pages.catalog.goods",
          )}`}
          variant={ETypographyVariant.TextB3Regular}
        />
      </div>
      <div className="CatalogPage-Inner">
        <div className="CatalogPage-Wrapper">
          {isNil(products?.content) ||
            (isEmpty(products?.content) && <div>Список продуктов пуст</div>)}
          <InfiniteScroll
            dataLength={pages.length}
            next={getMoreProducts}
            hasMore={getRenderedProductsCount() < products.totalItems}
            loader={<h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <ProductList
              isCardsLine={isCardsLine}
              onPageChange={handlePageChange}
              pages={pages.map(
                (page) =>
                  page ?? Array(products.limit ?? DEFAULT_PAGE_LIMIT).fill(PLACEHOLDER_PRODUCT),
              )}
              productList={products.content ?? []}
              scrollIntoPage={scrollIntoPage.current}
            />
          </InfiniteScroll>
        </div>
      </div>
    </section>
  );
};
