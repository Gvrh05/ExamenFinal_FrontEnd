import { createBrowserRouter } from "react-router-dom";
import Landing from "@/pages/Landing";
import NotFound from "@/pages/NotFound";
import FraudReport from "@/pages/FraudReport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/reportar-estafa",
    element: <FraudReport />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
