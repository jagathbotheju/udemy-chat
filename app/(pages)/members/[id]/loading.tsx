import { Spinner } from "@nextui-org/react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <Spinner label="loading..." color="secondary" labelColor="secondary" />
    </div>
  );
};

export default Loading;
