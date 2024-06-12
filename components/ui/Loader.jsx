import React from "react";
import { css } from "@emotion/react";
import FadeLoader from "react-spinners/FadeLoader";

const Loader = ({
  height = 15,
  width = 5,
  radius = 2,
  margin = 2,
  color = "#000000",
  loading = true,
  cssOverride = {},
}) => {
  const overrideStyles = css(cssOverride);

    return (
      <div className="flex justify-center items-center h-screen">
        <FadeLoader
          color={color}
          loading={loading}
          css={overrideStyles}
          height={height}
          width={width}
          radius={radius}
          margin={margin}
        />
      </div>
    );
};

export default Loader;
