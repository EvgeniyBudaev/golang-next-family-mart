import Link from "next/link";
import type { FC } from "react";
import { Container } from "@/app/components/layout/container";
import { HeaderListIcon } from "@/app/components/layout/header/headerListIcon";
import { I18nProps } from "@/app/i18n/props";
import { ERoutes } from "@/app/shared/enums";
import { createPath } from "@/app/shared/utils";
import { Spacer } from "@/app/uikit/components/spacer";
import { Typography } from "@/app/uikit/components/typography";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import "./HeaderContent.scss";

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
              <HeaderListIcon />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
