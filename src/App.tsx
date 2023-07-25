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
import ToDoTaskViewer from "./pages/todo/[id]/ToDoTaskViewer";
import ProjectIdeas from "./pages/ideas/ProjectIdeas";
import Discovery from "./pages/discovery/Discovery";
import ManageAccount from "./pages/account/ManageAccount";
import Orgs from "./pages/orgs/Orgs";
import OrgViewer from "./pages/orgs/OrgViewer";
import BlogList from "./pages/blog/BlogList";
import BlogViewer from "./pages/blog/BlogViewer";
import Contact from "./pages/contact/Contact";
import Flows from "./pages/flows/Flows";
import FlowViewer from "./pages/flows/[id]/FlowViewer";
import CodeSnippets from "./pages/snippets/CodeSnippets";
import SnippetViewer from "./pages/snippets/[id]/SnippetViewer";

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
            <Route path="/page/account/manage" exact={true}>
              <ManageAccount />
            </Route>
            <Route path="/page/todo" exact={true}>
              <ToDoListViewer />
            </Route>
            <Route path="/page/todo/:id" exact={true}>
              <ToDoTaskViewer />
            </Route>
            <Route path="/page/ideas" exact={true}>
              <ProjectIdeas />
            </Route>
            <Route path="/page/discovery" exact={true}>
              <Discovery />
            </Route>
            <Route path="/page/orgs" exact={true}>
              <Orgs />
            </Route>
            <Route path="/page/orgs/:name" exact={true}>
              <OrgViewer />
            </Route>
            <Route path="/page/blog" exact={true}>
              <BlogList />
            </Route>
            <Route path="/page/blog/:id" exact={true}>
              <BlogViewer />
            </Route>
            <Route path="/page/contact" exact={true}>
              <Contact />
            </Route>
            <Route path="/page/flows" exact={true}>
              <Flows />
            </Route>
            <Route path="/page/flows/:id" exact={true}>
              <FlowViewer />
            </Route>
            <Route path="/page/snippets" exact={true}>
              <CodeSnippets />
            </Route>
            <Route path="/page/snippets/:id" exact={true}>
              <SnippetViewer />
            </Route>
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
