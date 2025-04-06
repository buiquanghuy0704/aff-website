/* eslint-disable react-refresh/only-export-components */
import { useRoutes } from "react-router-dom";
import { PublicRoutes } from "../config/router";
import MainLayout from "../layout/MainLayout";

const MainPage = () => {
  const element = useRoutes(PublicRoutes);
  return element;
};

export default MainLayout(MainPage);
