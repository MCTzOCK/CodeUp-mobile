import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Courses from "./pages/courses/Courses";
import CourseViewer from "./pages/courses/[id]/CourseViewer";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import SectionViewer from "./pages/courses/[id]/[id]/SectionViewer";
import Login from "./pages/account/Login";
import Register from "./pages/account/Register";
import ToDoListViewer from "./pages/todo/ToDoListViewer";

setupIonicReact();

// @ts-ignore
window.PREFIX_PATH = "https://codeup.space";

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <Route path="/" exact={true}>
              <Home />
            </Route>
            <Route path="/page/courses" exact={true}>
              <Courses />
            </Route>
            <Route path="/page/courses/:id" exact={true}>
              <CourseViewer />
            </Route>
            <Route path="/page/courses/:id/:sid" exact={true}>
              <SectionViewer />
            </Route>
            <Route path="/page/account/login" exact={true}>
              <Login />
            </Route>
            <Route path="/page/account/register" exact={true}>
              <Register />
            </Route>
            <Route path="/page/todo" exact={true}>
              <ToDoListViewer />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
