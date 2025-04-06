import { ComponentType } from "react";

const MainLayout = (PageComponent: ComponentType) => {
  const WrappedComponent = () => {
    return (
      <div className="h-screen overflow-hidden">
        <PageComponent />
      </div>
    );
  };
  return WrappedComponent;
};

export default MainLayout;
