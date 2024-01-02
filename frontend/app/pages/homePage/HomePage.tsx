import type { FC } from "react";
import "./HomePage.scss";
import { ButtonLink } from "@/app/uikit/components/button/buttonLink";
import { createPath } from "@/app/shared/utils";
import { ERoutes } from "@/app/shared/enums";

export const HomePage: FC = () => {
  return (
    <section>
      <h1>Домашняя страница</h1>
      <ButtonLink
        href={createPath({
          route: ERoutes.CatalogDetail,
          params: { aliasCatalog: "mirrors" },
        })}
      >
        Каталог зеркал
      </ButtonLink>
    </section>
  );
};
