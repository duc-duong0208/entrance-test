import React, { memo } from "react";

interface Props {
  title: string;
  handleOnClick: () => void;
}

const ButtonCommon = ({ title, handleOnClick }: Props) => {
  return (
    <button
      className="w-[120px] bg-gray-200 hover:bg-gray-300 border"
      onClick={handleOnClick}
    >
      {title}
    </button>
  );
};

export default memo(ButtonCommon);
