import { StyledProps, PseudoProps } from "@travelated-kuma-ui/system";
import { ThemeSystem } from "./theme";

export const css = (_strings: TemplateStringsArray): string => {
  throw Error('Using the "css" in runtime is not supported.');
};
