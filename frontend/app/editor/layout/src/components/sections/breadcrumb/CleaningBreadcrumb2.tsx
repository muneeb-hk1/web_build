"use client";

import type { SectionProps } from "../../../types/section";
import CleaningBreadcrumb1 from "./CleaningBreadcrumb1";

export default function CleaningBreadcrumb2(props: SectionProps) {
  return (
    <CleaningBreadcrumb1
      {...props}
      data={{ ...props.data, withBackgroundImage: false }}
    />
  );
}
