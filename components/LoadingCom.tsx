import { Spinner } from "@nextui-org/react";
import React from "react";

interface Props {
  label?: string;
}

const LoadingCom = ({ label }: Props) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center">
      <Spinner
        label={label || "loading..."}
        color="secondary"
        labelColor="secondary"
      />
    </div>
  );
};

export default LoadingCom;
