import Loading from "react-loading";
import "../styles/AppLoading.css";

function AppLoading() {
  return (
    <div className="app-loading">
      <Loading type="spinningBubbles" color="#fff" />
    </div>
  );
}

export default AppLoading;
