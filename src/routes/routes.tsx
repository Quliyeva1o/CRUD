import { Route, Routes } from "react-router-dom";
import Layout from "../layout/index";
import Home from "../pages/home";
import Detail from "../pages/detail";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="blogs/:id" element={<Detail />} />
    </Route>
  </Routes>
);

export default AppRoutes;
