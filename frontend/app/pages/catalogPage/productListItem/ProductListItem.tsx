"use client";

import clsx from "clsx";
import isNil from "lodash/isNil";
import Image from "next/image";
import Link from "next/link";
import { forwardRef } from "react";
import { TProductListItem } from "@/app/api/adminPanel/products/list/types";
import { useTranslation } from "@/app/i18n/client";
import { useProxyUrl } from "@/app/shared/hooks";
import { Icon } from "@/app/uikit/components/icon";
import { ETypographyVariant, Typography } from "@/app/uikit/components/typography";
import "./ProductListItem.scss";

type TProps = {
  isCardsLine: boolean;
  product: TProductListItem;
};

export const ProductListItem = forwardRef<HTMLDivElement, TProps>(function ProductListItem(
  { isCardsLine, product },
  ref,
) {
  const { proxyUrl } = useProxyUrl();
  const { t } = useTranslation("index");
  console.log("product: ", product);

  return (
    <div
      className={clsx("ProductListItem", {
        ProductListItem__line: isCardsLine,
      })}
      ref={ref}
    >
      <div className="ProductListItem-Wrapper">
        <div className="ProductListItem-Content">
          <div
            className={clsx("ProductListItem-ContentContainerImage", {
              no_image: isNil(product?.images?.[0]),
            })}
          >
            <Link className="ProductListItem-ContentLink" href={""}>
              {!isNil(product?.images?.[0]) ? (
                <Image
                  className="ProductListItem-ContentImage"
                  alt={product.name}
                  height={200}
                  priority={true}
                  src={`${proxyUrl}${product?.images?.[0].url}`}
                  width={216}
                  // width={imageResponsiveSizeWidth()}
                  // height={imageResponsiveSizeHeight()}
                />
              ) : (
                <Icon type="NoImage" />
              )}
            </Link>
          </div>
          <div className="ProductListItem-ContentDescription">
            <Link className="ProductListItem-ContentTitle" href={""}>
              <Typography value={product.name} variant={ETypographyVariant.TextB3Regular} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});
