import Link from "next/link";
import type { FC } from "react";
import { Container } from "@/app/components/layout/container";
import { HeaderListIcon } from "@/app/components/layout/header/headerListIcon";
import { ERoutes } from "@/app/enums";
import { Spacer } from "@/app/uikit/components/spacer";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "@/app/utils";
import "./HeaderContent.scss";
import { I18nProps } from "@/app/i18n/props";

export const HeaderContent: FC<I18nProps> = ({ i18n }) => {
  return (
    <div className="HeaderContent">
      <Container>
        <div className="HeaderContent-Desktop">
          <div className="HeaderContent-Info">
            <div className="HeaderContent-InfoInner">
              <div className="HeaderContent-InfoLeft">
                <Link
                  className="HeaderContent-Title"
                  href={createPath(
                    {
                      route: ERoutes.Root,
                    },
                    // i18n.lng,
                  )}
                >
                  <Typography value="FamilyMart" variant={ETypographyVariant.TextH1Medium} />
                </Link>
              </div>
              <Spacer />
              <HeaderListIcon i18n={i18n} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
