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
    title: "ToDo",
    url: "/page/todo",
    iosIcon: checkbox,
    mdIcon: checkboxSharp,
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
              <IonItem
                lines="none"
                detail={false}
                onClick={() => {
                  if (confirm("Willst du dich wirklich abmelden?")) {
                    localStorage.removeItem("token");
                  }
                }}
              >
                <IonIcon
                  aria-hidden="true"
                  slot="start"
                  ios={logOut}
                  md={logOutSharp}
                />
                <IonLabel>Abmelden</IonLabel>
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
