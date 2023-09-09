import { theme } from "@travelated-kuma-ui/sheet";
import { StyledProps } from "@travelated-kuma-ui/system";

// eslint-disable-next-line @typescript-eslint/ban-types
export type BoxSpecificProps = {};

const boxSpecificProps: (keyof BoxSpecificProps)[] = [];

export const isBoxProps = (propName: unknown): propName is BoxSpecificProps => {
  return boxSpecificProps.some((k) => k === propName);
};

export const boxDefaultProps: StyledProps = {};

export const boxHandler = (props: BoxSpecificProps) => ({});
