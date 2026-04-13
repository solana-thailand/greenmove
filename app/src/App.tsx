import { Outlet } from "react-router";
import { MainLayout } from "./components/layout";

function App() {
  return (
    <MainLayout activeRoute="/">
      <Outlet />
    </MainLayout>
  );
}

export default App;
