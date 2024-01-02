"use client";

import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import { useCallback, useEffect, useRef, useState, type FC } from "react";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./CatalogPage.scss";
import { TCatalogDetail } from "@/app/api/adminPanel/catalogs/detail";
import { ProductList } from "@/app/pages/catalogPage/productList";

type TProps = {
  catalog: TCatalogDetail;
};

export const CatalogPage: FC<TProps> = ({ catalog }) => {
  const [isCardsLine, setIsCardsLine] = useState(false);
  console.log("catalog: ", catalog);

  return (
    <section className="CatalogPage">
      <div className="CatalogPage-Row">
        <div className="CatalogPage-Title">
          <Typography value={catalog?.name} variant={ETypographyVariant.TextH1Bold} />
        </div>
        {/*<Typography variant={ETypographyVariant.TextB3Regular}>*/}
        {/*  {productRange.endProduct} {t("pages.catalogs.from")} {products.countOfResult}{" "}*/}
        {/*  {t("pages.catalogs.goods")}*/}
        {/*</Typography>*/}
      </div>
      <div className="CatalogPage-Inner">
        <div className="CatalogPage-Wrapper">
          {isNil(catalog?.products) ||
            (isEmpty(catalog?.products) && <div>Список продуктов пуст</div>)}
          <ProductList isCardsLine={isCardsLine} productList={catalog?.products ?? []} />
        </div>
      </div>
    </section>
  );
};
