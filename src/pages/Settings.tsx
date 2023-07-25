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
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRange,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { Drivers, Storage } from "@ionic/storage";

export default function Settings() {
  const [fontSize, setFontSize] = useState<number>(0);

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
          <IonList
            style={{
              padding: "40px",
            }}
          >
            <IonRange
              style={{
                padding: "10px",
              }}
              label={"Code-Editor Schriftgröße"}
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
          </IonList>
        </IonContent>
      </IonPage>
    </>
  );
}
