import React from "react";
import { k } from "@travelated-kuma-ui/core";

export const ThisIsTheKDiv = () => {
  return (
    <k.div p={4} m={["2px", "4px"]} _hover={{ color: "blue" }}>
      Hello world
    </k.div>
  );
};
