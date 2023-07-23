/**
 * src/pages/account/Register.tsx
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

export default function Register() {
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
            <IonTitle>Registrieren</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Registrieren</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Registrieren</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInput
                placeholder={"Benutzername"}
                id={"reg-username-input"}
              />
              <IonInput
                placeholder={"E-Mail"}
                id={"reg-email-input"}
                type={"email"}
              />
              <IonInput placeholder={"Vorname"} id={"reg-firstname-input"} />
              <IonInput placeholder={"Nachname"} id={"reg-lastname-input"} />
              <IonInput
                placeholder={"Passwort"}
                type={"password"}
                id={"reg-password-input"}
              />
              <IonInput
                placeholder={"Passwort bestätigen"}
                type={"password"}
                id={"reg-password-confirm-input"}
              />
              <IonButton
                expand={"block"}
                onClick={async () => {
                  const username = (
                    document.getElementById(
                      "reg-username-input",
                    ) as HTMLInputElement
                  ).value;
                  const email = (
                    document.getElementById(
                      "reg-email-input",
                    ) as HTMLInputElement
                  ).value;
                  const firstname = (
                    document.getElementById(
                      "reg-firstname-input",
                    ) as HTMLInputElement
                  ).value;
                  const lastname = (
                    document.getElementById(
                      "reg-lastname-input",
                    ) as HTMLInputElement
                  ).value;
                  const password = (
                    document.getElementById(
                      "reg-password-input",
                    ) as HTMLInputElement
                  ).value;
                  const passwordConfirm = (
                    document.getElementById(
                      "reg-password-confirm-input",
                    ) as HTMLInputElement
                  ).value;

                  if (
                    !username ||
                    !email ||
                    !firstname ||
                    !lastname ||
                    !password ||
                    !passwordConfirm
                  ) {
                    alert("Bitte fülle alle Felder aus!");
                    return;
                  }

                  if (password.length < 8) {
                    alert("Passwort muss mindestens 8 Zeichen lang sein!");
                    return;
                  }

                  if (password !== passwordConfirm) {
                    alert("Passwörter stimmen nicht überein!");
                    return;
                  }

                  const res = await REST.Account.register({
                    username,
                    email,
                    firstName: firstname,
                    lastName: lastname,
                    password,
                  });

                  if (res.status !== 200) {
                    alert("Fehler beim Registrieren: " + res.payload.error);
                    return;
                  }

                  alert(
                    "Registrierung erfolgreich! Prüfe deine E-Mails um den Account zu aktivieren.",
                  );
                }}
              >
                Registrieren
              </IonButton>
              <IonButton
                expand={"block"}
                fill={"clear"}
                routerLink={"/page/account/login"}
              >
                Anmelden
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}
