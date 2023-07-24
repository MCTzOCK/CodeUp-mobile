/**
 * src/pages/contact/Contact.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.23
 *
 */
import { useLoggedIn } from "../../hooks/useLoggedIn";
import { useEffect } from "react";
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
  IonItem,
  IonMenuButton,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import * as React from "react";
import REST from "@codeupspace/rest/dist";

export default function Contact() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();

  useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/account/login", "none", "replace");
      }
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
            <IonTitle>Kontakt</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Kontakt</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonCard>
            <IonCardContent>
              <IonSelect
                label={"Kategorie"}
                labelPlacement={"floating"}
                value={"other"}
                id={"contact-i-category"}
              >
                <IonSelectOption value="other">Sonstiges</IonSelectOption>
                <IonSelectOption value="fehler">Fehler melden</IonSelectOption>
                <IonSelectOption value="feature">
                  Funktion beantragen
                </IonSelectOption>
                <IonSelectOption value="creator">
                  Creator Bewerbung
                </IonSelectOption>
              </IonSelect>
              <IonInput
                placeholder={"Titel"}
                label={"Titel"}
                labelPlacement={"floating"}
                id={"contact-i-title"}
              />
              <IonTextarea
                label={"Inhalt"}
                labelPlacement={"floating"}
                id={"contact-i-content"}
                autoGrow
              />
              <IonButton
                expand={"block"}
                style={{
                  "margin-top": "20px",
                }}
                onClick={async () => {
                  const category = (
                    document.getElementById(
                      "contact-i-category",
                    ) as HTMLIonSelectElement
                  ).value;
                  const title = (
                    document.getElementById(
                      "contact-i-title",
                    ) as HTMLIonInputElement
                  ).value;
                  const content = (
                    document.getElementById(
                      "contact-i-content",
                    ) as HTMLIonTextareaElement
                  ).value;

                  if (
                    !category ||
                    !title ||
                    !content ||
                    title === "" ||
                    content === ""
                  ) {
                    alert("Bitte fülle alle Felder aus!");
                    return;
                  }

                  const res = await REST.Util.makeRequest({
                    token: localStorage.getItem("token") as string,
                    path: "/api/contact",
                    method: "POST",
                    body: {
                      message: content,
                      category,
                      title,
                    },
                  });

                  if (res.status !== 200) {
                    alert(
                      "Es ist ein Fehler aufgetreten: " + res.payload.error,
                    );
                    return;
                  }

                  alert("Deine Nachricht wurde erfolgreich versendet!");
                }}
              >
                Absenden
              </IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    </>
  );
}
