import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Base64Com from "./tools/Base64";
import JsonCom from "./tools/Json";
import ImageToBase64 from "./tools/ImageToBase64";
import TimestampConversion from "./tools/TimestampConversion";
import TrackAnalyzer from "./tools/TrackAnalyzer";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [],
  },
  {
    path: "tools/base64",
    element: <Base64Com />,
  },
  {
    path: "tools/json",
    element: <JsonCom />,
  },
  {
    path: "tools/imageToBase64",
    element: <ImageToBase64 />,
  },
  {
    path: "tools/timestampConversion",
    element: <TimestampConversion />,
  },
  {
    path: "tools/trackAnalyzer",
    element: <TrackAnalyzer />,
  },
],{
  basename: '/index.html'
});


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
