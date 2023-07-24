/**
 * src/pages/account/Login.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 23.07.2023
 *
 */

import * as React from "react";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import REST from "@codeupspace/rest";

export default function Login() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();

  React.useEffect(() => {
    if (loggedIn) {
      router.push("/");
    }
  }, [loggedIn]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Anmelden</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Anmelden</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Anmelden</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput placeholder={"Benutzername"} id={"username-input"} />
              <IonInput
                placeholder={"Passwort"}
                type={"password"}
                id={"password-input"}
              />
              <IonButton
                expand={"block"}
                onClick={async () => {
                  const username = (
                    document.getElementById(
                      "username-input",
                    ) as HTMLInputElement
                  ).value;
                  const password = (
                    document.getElementById(
                      "password-input",
                    ) as HTMLInputElement
                  ).value;

                  const res = await REST.Account.loginWithUsername({
                    username,
                    password,
                  });

                  if (res.status !== 200) {
                    alert(
                      "Fehler beim Anmelden: Falscher Benutzername oder Passwort!",
                    );
                    return;
                  }

                  if (!res.payload._2fa) {
                    const token = res.payload.token;
                    localStorage.setItem("token", token);

                    router.push("/", "none", "replace");
                  } else {
                    const code = prompt("Bitte den 2FA Code eingeben:");

                    const res2 = await REST.Account.loginWithUsername({
                      username,
                      password,
                      code: code!,
                    });

                    if (res2.status !== 200) {
                      alert("Fehler beim Anmelden: Falscher Code!");
                      return;
                    }

                    const token = res2.payload.token;

                    localStorage.setItem("token", token);
                  }
                }}
              >
                Anmelden
              </IonButton>
              <IonButton
                expand={"block"}
                fill={"clear"}
                routerLink={"/page/account/register"}
              >
                Registrieren
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}
