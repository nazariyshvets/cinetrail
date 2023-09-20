import { Outlet } from "react-router-dom";
import Header from "components/Header";

function MainPage() {
  return (
    <div className="main-page">
      <Header />
      <Outlet />
    </div>
  );
}

export default MainPage;
