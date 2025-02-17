import { createPlaceholders, Placeholders } from "./placeholders";

export const defaultBreakpoints = Object.freeze({
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
});

// to avoid cyclic dependency, we declare an exact same type declared in @travelated-kuma-ui/core
type ComponentName =
  | "Box"
  | "Flex"
  | "Spacer"
  | "Text"
  | "Button"
  | "Heading"
  | "Input"
  | "Select"
  | "HStack"
  | "VStack"
  | "Image"
  | "Link"
  | "Grid";

export type Tokens =
  | "colors"
  | "fonts"
  | "fontSizes"
  | "fontWeights"
  | "lineHeights"
  | "letterSpacings"
  | "spacings"
  | "sizes"
  | "radii"
  | "zIndices"
  | "breakpoints";

export type UserTheme = {
  [K in Tokens]?: Record<string, string> | undefined;
} & {
  components?: {
    [_ in ComponentName]?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME
      baseStyle?: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME
      variants?: { [key: string]: any };
      defaultProps?: { variant?: string } & Record<string, unknown>;
    };
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __KUMA_USER_THEME__: UserTheme | undefined;
}

export class Theme {
  private static instance: Theme;
  private _userTheme: UserTheme = {
    ...globalThis.__KUMA_USER_THEME__,
    breakpoints:
      globalThis.__KUMA_USER_THEME__?.breakpoints ?? defaultBreakpoints,
  };
  private _placeholders: Placeholders = {};

  private constructor() {}

  static getInstance() {
    if (!Theme.instance) {
      Theme.instance = new Theme();
    }
    return Theme.instance;
  }

  setUserTheme(userTheme: Partial<UserTheme>) {
    if (Object.keys(userTheme.breakpoints || {}).length === 0) {
      delete userTheme.breakpoints;
    }
    this._userTheme = {
      ...this._userTheme,
      ...userTheme,
    };
    this._placeholders = createPlaceholders(this._userTheme);
  }

  getUserTheme() {
    return this._userTheme;
  }

  getSpacingScalingFactor() {
    return 8;
  }

  getPlaceholders(): Placeholders {
    return this._placeholders;
  }

  getVariants(componentName: ComponentName):
    | {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME
        baseStyle?: any;
        variants?:
          | {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any -- FIXME
              [key: string]: any;
            }
          | undefined;
        defaultProps?: { variant?: string } & Record<string, unknown>;
      }
    | undefined {
    return this._userTheme.components?.[componentName] || {};
  }

  reset() {
    this._userTheme = {
      breakpoints: defaultBreakpoints,
    };
  }
}

export const theme = Theme.getInstance();
