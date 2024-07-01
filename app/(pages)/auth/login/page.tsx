import LoginForm from "./LoginForm";

interface Props {
  searchParams: {
    callbackUrl?: string;
  };
}

const LoginPage = ({ searchParams }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <LoginForm callbackUrl={searchParams.callbackUrl} />
    </div>
  );
};

export default LoginPage;
