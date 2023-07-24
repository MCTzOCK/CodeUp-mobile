/**
 * src/pages/account/ManageAccount.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.23
 *
 */
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import * as React from "react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import { useEffect } from "react";
import { save, saveSharp } from "ionicons/icons";
import REST from "@codeupspace/rest/dist";

export default function ManageAccount() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/account/login", "none", "replace");
    }
  }, [loaded, loggedIn]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Konto</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Konto</IonTitle>
            </IonToolbar>
          </IonHeader>
          {userInfo && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Persönliches</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonInput
                    placeholder={"Vorname"}
                    label={"Vorname"}
                    labelPlacement={"floating"}
                    value={userInfo.firstName}
                    id={"acc-input-u-firstname"}
                  />
                  <IonInput
                    placeholder={"Nachname"}
                    label={"Nachname"}
                    labelPlacement={"floating"}
                    value={userInfo.lastName}
                    id={"acc-input-u-lastname"}
                  />
                  <IonInput
                    placeholder={"E-Mail"}
                    label={"E-Mail"}
                    labelPlacement={"floating"}
                    value={userInfo.email}
                    id={"acc-input-u-email"}
                  />
                  <IonButton
                    expand={"block"}
                    onClick={async () => {
                      const dict: {
                        [key: string]: string;
                      } = {
                        firstName: (
                          document.getElementById(
                            "acc-input-u-firstname",
                          ) as HTMLIonInputElement
                        ).value as string,
                        lastName: (
                          document.getElementById(
                            "acc-input-u-lastname",
                          ) as HTMLIonInputElement
                        ).value as string,
                        email: (
                          document.getElementById(
                            "acc-input-u-email",
                          ) as HTMLIonInputElement
                        ).value as string,
                      };

                      for (const key in dict) {
                        if (dict[key] === "") return;
                        if (dict[key] === (userInfo as any)[key]) {
                          return;
                        }

                        const res = await REST.Account.update({
                          token: localStorage.getItem("token") as string,
                          keyName: key,
                          keyValue: dict[key],
                        });

                        if (res.status === 200) {
                          localStorage.setItem("token", res.payload.newToken);
                        } else {
                          alert("Fehler beim Speichern: " + res.payload.error);
                          return;
                        }
                      }
                    }}
                  >
                    <IonIcon ios={save} md={saveSharp} slot={"start"} />
                    Speichern
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
