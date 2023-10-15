import Link from "next/link";
import type { FC } from "react";
import { Container } from "@/app/components/layout/container";
import { HeaderListIcon } from "@/app/components/layout/header/headerListIcon";
import { ERoutes } from "@/app/enums";
import { Spacer, Typography } from "@/app/uikit/components";
import { ETypographyVariant } from "@/app/uikit/components/typography/enum";
import { createPath } from "@/app/utils";
import "./HeaderContent.scss";

export const HeaderContent: FC = () => {
  return (
    <div className="HeaderContent">
      <Container>
        <div className="HeaderContent-Desktop">
          <div className="HeaderContent-Info">
            <div className="HeaderContent-InfoInner">
              <div className="HeaderContent-InfoLeft">
                <Link
                  className="HeaderContent-Title"
                  href={createPath({
                    route: ERoutes.Root,
                  })}
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
