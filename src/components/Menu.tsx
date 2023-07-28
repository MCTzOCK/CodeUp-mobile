import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonText,
} from "@ionic/react";

import { useLocation } from "react-router-dom";
import {
  videocamOutline,
  videocamSharp,
  person,
  personSharp,
  logOut,
  logOutSharp,
  checkmark,
  checkmarkSharp,
  checkbox,
  checkboxSharp,
  bulb,
  bulbSharp,
  star,
  starSharp,
  cog,
  cogSharp,
  people,
  peopleSharp,
  document,
  documentSharp,
  helpCircle,
  helpCircleSharp,
  trendingUp,
  trendingUpSharp,
  code,
  codeSharp,
} from "ionicons/icons";
import "./Menu.css";
import { useLoggedIn } from "../hooks/useLoggedIn";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
  onlyLoggedIn: boolean;
}

const appPages: AppPage[] = [
  {
    title: "Kurse",
    url: "/page/courses",
    iosIcon: videocamOutline,
    mdIcon: videocamSharp,
    onlyLoggedIn: false,
  },
  {
    title: "Ideen",
    url: "/page/ideas",
    iosIcon: bulb,
    mdIcon: bulbSharp,
    onlyLoggedIn: false,
  },
  {
    title: "Discovery",
    url: "/page/discovery",
    iosIcon: star,
    mdIcon: starSharp,
    onlyLoggedIn: false,
  },
  {
    title: "ToDo",
    url: "/page/todo",
    iosIcon: checkbox,
    mdIcon: checkboxSharp,
    onlyLoggedIn: true,
  },
  {
    title: "Flows",
    url: "/page/flows",
    iosIcon: trendingUp,
    mdIcon: trendingUpSharp,
    onlyLoggedIn: true,
  },
  {
    title: "Code Snippets",
    url: "/page/snippets",
    iosIcon: code,
    mdIcon: codeSharp,
    onlyLoggedIn: true,
  },
  {
    title: "Organisationen",
    url: "/page/orgs",
    iosIcon: people,
    mdIcon: peopleSharp,
    onlyLoggedIn: true,
  },
  {
    title: "Blog",
    url: "/page/blog",
    iosIcon: document,
    mdIcon: documentSharp,
    onlyLoggedIn: false,
  },
  {
    title: "Einstellungen",
    url: "/page/settings",
    iosIcon: cog,
    mdIcon: cogSharp,
    onlyLoggedIn: true,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  const { loggedIn, userInfo, loaded } = useLoggedIn();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="page-list">
          <IonListHeader
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
          >
            CodeUp
          </IonListHeader>
          {!loggedIn ? (
            <>
              <IonItem
                routerLink={"/page/account/login"}
                routerDirection={"none"}
                detail={false}
                lines={"none"}
              >
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={person}
                  md={personSharp}
                />
                <IonLabel>Anmelden</IonLabel>
              </IonItem>
            </>
          ) : (
            <>
              <IonItem>
                <IonText>
                  Willkommen, {userInfo.firstName} {userInfo.lastName}!
                </IonText>
              </IonItem>
            </>
          )}
          {appPages.map((appPage, index) => {
            if (appPage.onlyLoggedIn && !loggedIn) return <></>;
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
