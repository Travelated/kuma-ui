import {
  applyPlaceholders,
  applySpacingScalingFactor,
  createPlaceholders,
  applyT,
} from "./placeholders";
import { describe, expect, it } from "vitest";
import { UserTheme } from "./theme";

describe("Theme utility functions", () => {
  describe("applyPlaceholders", () => {
    it("replaces valid placeholders", () => {
      const input = "Color is t('c.primary') and breakpoint is t('b.mobile')";
      const placeholders = {
        "c.primary": "#FF0000",
        "b.mobile": "480px",
      };
      expect(applyPlaceholders(input, placeholders)).toBe(
        "Color is #FF0000 and breakpoint is 480px"
      );
    });

    it("ignores invalid placeholders", () => {
      const input = "Color is t('c.primary') and something is t('invalid.key')";
      const placeholders = {
        "c.primary": "#FF0000",
      };
      expect(applyPlaceholders(input, placeholders)).toBe(
        "Color is #FF0000 and something is t('invalid.key')"
      );
    });
  });

  describe("applySpacingScalingFactor", () => {
    it("replaces integers with scaled px value", () => {
      const input = "Margin is s(2)";
      expect(applySpacingScalingFactor(input, 8)).toBe("Margin is 16px");
    });

    it("replaces decimals with scaled px value", () => {
      const input = "Padding is s(2.5)";
      expect(applySpacingScalingFactor(input, 8)).toBe("Padding is 20px");
    });

    it("ignores non-number values", () => {
      const input = "Something is s(notANumber)";
      expect(applySpacingScalingFactor(input, 8)).toBe(
        "Something is s(notANumber)"
      );
    });
  });

  describe("createPlaceholders", () => {
    it("creates placeholders for valid theme values", () => {
      const theme: Partial<UserTheme> = {
        colors: {
          primary: "#FF0000",
        },
        breakpoints: {
          mobile: "480px",
        },
      };

      expect(createPlaceholders(theme)).toEqual({
        "colors.primary": "#FF0000",
        "c.primary": "#FF0000",
        "breakpoints.mobile": "480px",
        "b.mobile": "480px",
      });
    });

    it("ignores invalid or non-existent theme values", () => {
      const theme: Partial<UserTheme> = {
        colors: {
          primary: "#FF0000",
        },
      };

      expect(createPlaceholders(theme)).toEqual({
        "colors.primary": "#FF0000",
        "c.primary": "#FF0000",
      });
    });
  });

  describe("applyPlaceholders edge cases", () => {
    it("handles empty strings", () => {
      const placeholders = { "c.primary": "#FF0000" };
      expect(applyPlaceholders("", placeholders)).toBe("");
    });

    it("handles strings without placeholders", () => {
      const placeholders = { "c.primary": "#FF0000" };
      expect(applyPlaceholders("No placeholders here", placeholders)).toBe(
        "No placeholders here"
      );
    });

    it("replaces multiple occurrences of the same placeholder", () => {
      const placeholders = { "c.primary": "#FF0000" };
      expect(
        applyPlaceholders(
          "Color t('c.primary') and again t('c.primary')",
          placeholders
        )
      ).toBe("Color #FF0000 and again #FF0000");
    });

    it("handles a mixture of valid and invalid placeholders", () => {
      const placeholders = { "c.primary": "#FF0000" };
      expect(
        applyPlaceholders(
          "Colors: t('c.primary'), t('c.secondary')",
          placeholders
        )
      ).toBe("Colors: #FF0000, t('c.secondary')");
    });
  });

  describe("applySpacingScalingFactor edge cases", () => {
    it("handles negative numbers", () => {
      expect(applySpacingScalingFactor("Margin is s(-2)", 8)).toBe(
        "Margin is -16px"
      );
    });

    it("handles zero", () => {
      expect(applySpacingScalingFactor("Padding is s(0)", 8)).toBe(
        "Padding is 0px"
      );
    });

    it("handles very large numbers", () => {
      expect(applySpacingScalingFactor("Width is s(1000)", 8)).toBe(
        "Width is 8000px"
      );
    });

    it("handles multiple spacing factors", () => {
      expect(
        applySpacingScalingFactor("Margin is s(2) and padding is s(2.5)", 8)
      ).toBe("Margin is 16px and padding is 20px");
    });

    it("handles whitespace around numbers", () => {
      expect(applySpacingScalingFactor("Margin is s( 2 )", 8)).toBe(
        "Margin is 16px"
      );
      expect(applySpacingScalingFactor("Padding is s( 2.5 )", 8)).toBe(
        "Padding is 20px"
      );
    });
  });

  describe("createPlaceholders edge cases", () => {
    it("handles empty theme", () => {
      const theme: Partial<UserTheme> = {};
      expect(createPlaceholders(theme)).toEqual({});
    });

    it("handles tokens without synonyms", () => {
      const theme: Partial<UserTheme> = {
        fontSizes: {
          small: "12px",
        },
      };
      expect(createPlaceholders(theme)).toEqual({ "fontSizes.small": "12px" });
    });

    it("handles whitespace around placeholders", () => {
      const placeholders = { "c.primary": "#FF0000" };
      expect(applyPlaceholders("Color t(  'c.primary'  )", placeholders)).toBe(
        "Color #FF0000"
      );
      expect(applyPlaceholders('Color t(  "c.primary"  )', placeholders)).toBe(
        "Color #FF0000"
      );
    });

    it("handles both single and double quotation marks", () => {
      const placeholders = { "c.primary": "#FF0000", "b.mobile": "480px" };
      expect(applyPlaceholders('Color is t("c.primary")', placeholders)).toBe(
        "Color is #FF0000"
      );
      expect(
        applyPlaceholders("Breakpoint is t('b.mobile')", placeholders)
      ).toBe("Breakpoint is 480px");
    });
  });

  describe("applyT function", () => {
    const theme: UserTheme = {
      colors: {
        primary: "#FF0000",
        secondary: "#00FF00",
      },
      breakpoints: {
        mobile: "480px",
      },
    };

    const placeholders = createPlaceholders(theme);

    it("should replace placeholders correctly", () => {
      const input =
        "Background is t('c.primary') and breakpoint is t('b.mobile')";
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("Background is #FF0000 and breakpoint is 480px");
    });

    it("should handle spacing scaling factor for positive numbers", () => {
      const input = "Margin is s(2)";
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("Margin is 16px");
    });

    it("should handle spacing scaling factor for negative numbers", () => {
      const input = "Margin is s(-2)";
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("Margin is -16px");
    });

    it("should handle decimals in spacing scaling", () => {
      const input = "Padding is s(1.5)";
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("Padding is 12px");
    });

    it("should handle whitespaces and both single and double quotation marks", () => {
      const input = 'Color is t("c.primary") and space is s( 1 )';
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("Color is #FF0000 and space is 8px");
    });

    it("should leave unchanged values when there's no matching placeholder", () => {
      const input = "This is a t('non.existent') placeholder";
      const result = applyT(input, placeholders, 8);
      expect(result).toBe("This is a t('non.existent') placeholder");
    });
  });
});
