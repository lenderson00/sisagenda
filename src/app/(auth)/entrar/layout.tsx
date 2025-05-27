import type React from "react";

type Props = {
	children: React.ReactNode;
};

const AuthLayout: React.FC<Props> = ({ children }) => {
	return <div className="relative">{children}</div>;
};

export default AuthLayout;
