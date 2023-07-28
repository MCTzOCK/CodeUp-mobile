/**
 * src/pages/Settings.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.23
 *
 */

import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRange,
  IonRouterLink,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";
import { useLoggedIn } from "../hooks/useLoggedIn";
import * as React from "react";
import REST from "@codeupspace/rest";
import { save, saveSharp } from "ionicons/icons";
import { Browser } from "@capacitor/browser";

export default function Settings() {
  const [fontSize, setFontSize] = useState<number>(0);
  const { loggedIn, userInfo } = useLoggedIn();

  useEffect(() => {
    (async () => {
      const store = new Storage({
        name: "codeupspace_settings",
        driverOrder: [
          Drivers.IndexedDB,
          Drivers.SecureStorage,
          Drivers.LocalStorage,
        ],
      });

      await store.create();

      setFontSize((await store.get("editor.fontSize")) || 15);
    })();
  }, []);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Einstellungen</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Einstellungen</IonTitle>
            </IonToolbar>
          </IonHeader>
          <div
            style={{
              margin: 40,
            }}
          >
            <IonText>Konto</IonText>
            <IonList inset color={"light"}>
              {loggedIn ? (
                <>
                  <IonItem color={"light"} detail={false}>
                    <IonInput
                      placeholder={"Vorname"}
                      label={"Vorname"}
                      labelPlacement={"start"}
                      value={userInfo.firstName}
                      id={"acc-input-u-firstname"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonInput
                      placeholder={"Nachname"}
                      label={"Nachname"}
                      labelPlacement={"start"}
                      value={userInfo.lastName}
                      id={"acc-input-u-lastname"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonInput
                      placeholder={"E-Mail"}
                      label={"E-Mail"}
                      labelPlacement={"start"}
                      value={userInfo.email}
                      id={"acc-input-u-email"}
                    />
                  </IonItem>
                  <IonItem
                    color={"light"}
                    button={true}
                    detail={false}
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
                    <IonLabel color={"primary"}>Speichern</IonLabel>
                  </IonItem>
                  <IonItem
                    color={"light"}
                    onClick={() => {
                      if (!confirm("Möchtest du dich wirklich abmelden?"))
                        return;

                      localStorage.setItem("token", "");
                    }}
                    detail={false}
                  >
                    <IonLabel color={"danger"}>Abmelden</IonLabel>
                  </IonItem>
                </>
              ) : (
                <>
                  <IonItem
                    button={true}
                    routerLink={"/page/account/login"}
                    color={"light"}
                  >
                    <IonLabel color={"primary"}>Anmelden</IonLabel>
                  </IonItem>
                </>
              )}
            </IonList>
          </div>
          <div
            style={{
              margin: 40,
            }}
          >
            <IonText>Code-Editor</IonText>
            <IonList inset color={"light"}>
              <IonItem color={"light"}>
                <IonRange
                  label={"Schriftgröße"}
                  labelPlacement={"start"}
                  aria-label={"Schriftgröße"}
                  ticks={true}
                  snaps={true}
                  min={10}
                  max={25}
                  value={fontSize}
                  onIonChange={async (e) => {
                    const store = new Storage({
                      name: "codeupspace_settings",
                      driverOrder: [
                        Drivers.IndexedDB,
                        Drivers.SecureStorage,
                        Drivers.LocalStorage,
                      ],
                    });

                    await store.create();

                    await store.set("editor.fontSize", e.detail.value);
                    setFontSize(e.detail.value as number);
                  }}
                />
              </IonItem>
            </IonList>
          </div>
          <div
            style={{
              margin: 40,
            }}
          >
            <IonText>Kontakt</IonText>
            <IonList inset color={"light"}>
              {!loggedIn ? (
                <>
                  <IonItem
                    button={true}
                    routerLink={"/page/account/login"}
                    color={"light"}
                  >
                    <IonLabel color={"primary"}>Anmelden</IonLabel>
                  </IonItem>
                </>
              ) : (
                <>
                  <IonItem color={"light"}>
                    <IonSelect
                      label={"Kategorie"}
                      labelPlacement={"start"}
                      value={"other"}
                      id={"contact-i-category"}
                    >
                      <IonSelectOption value="other">Sonstiges</IonSelectOption>
                      <IonSelectOption value="fehler">
                        Fehler melden
                      </IonSelectOption>
                      <IonSelectOption value="feature">
                        Funktion beantragen
                      </IonSelectOption>
                      <IonSelectOption value="creator">
                        Creator Bewerbung
                      </IonSelectOption>
                    </IonSelect>
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonInput
                      placeholder={"Titel"}
                      label={"Titel"}
                      labelPlacement={"start"}
                      id={"contact-i-title"}
                    />
                  </IonItem>
                  <IonItem color={"light"}>
                    <IonTextarea
                      label={"Inhalt"}
                      labelPlacement={"start"}
                      id={"contact-i-content"}
                      autoGrow
                    />
                  </IonItem>
                  <IonItem
                    button
                    detail={false}
                    color={"light"}
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
                    <IonLabel color={"primary"}>Absenden</IonLabel>
                  </IonItem>
                </>
              )}
            </IonList>
          </div>

          <div
            style={{
              margin: 40,
            }}
          >
            <IonText>Rechliches</IonText>
            <IonList inset color={"light"}>
              <IonItem
                color={"light"}
                button
                onClick={async () => {
                  await Browser.open({
                    url: "https://codeup.space/legal/imprint/",
                    presentationStyle: "popover",
                  });
                }}
              >
                Impressum
              </IonItem>
              <IonItem
                color={"light"}
                button
                onClick={async () => {
                  await Browser.open({
                    url: "https://codeup.space/legal/privacy/",
                    presentationStyle: "popover",
                  });
                }}
              >
                Datenschutz
              </IonItem>
              <IonItem
                color={"light"}
                button
                onClick={async () => {
                  await Browser.open({
                    url: "https://codeup.space/codeup/about/",
                    presentationStyle: "popover",
                  });
                }}
              >
                Verwendete Bibliotheken
              </IonItem>
            </IonList>
          </div>
        </IonContent>
      </IonPage>
    </>
  );
}
