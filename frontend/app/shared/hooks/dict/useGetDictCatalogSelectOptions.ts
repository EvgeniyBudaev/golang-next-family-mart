import { TDictCatalogListItem } from "@/app/api/dict/catalogs";
import { TSelectOption } from "@/app/uikit/components/select/types";

type TProps = {
  dictCatalogList: TDictCatalogListItem[];
};

type TResponse = {
  dictCatalogOptions: TSelectOption[];
};

type THooks = (props: TProps) => TResponse;

export const useGetDictCatalogSelectOptions: THooks = ({ dictCatalogList }) => {
  const dictCatalogOptions = (dictCatalogList ?? []).map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  return { dictCatalogOptions };
};
