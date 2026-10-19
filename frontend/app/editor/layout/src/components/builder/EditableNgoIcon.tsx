"use client";

import { renderNgoIcon } from "../../lib/ngoIcons";

type EditableNgoIconProps = {
  name?: string;
  className?: string;
};

export default function EditableNgoIcon({
  name,
  className = "h-5 w-5",
}: EditableNgoIconProps) {
  return <>{renderNgoIcon(name, className)}</>;
}
