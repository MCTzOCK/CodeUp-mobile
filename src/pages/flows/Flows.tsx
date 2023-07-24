/**
 * src/pages/flows/Flows.tsx
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
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import * as React from "react";
import REST from "@codeupspace/rest/dist";
import { open, openSharp, trash, trashSharp } from "ionicons/icons";

export default function Flows() {
  const [flows, setFlows] = useState<any[]>([]);
  const router = useIonRouter();
  const { loggedIn, loaded, userInfo } = useLoggedIn();

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/page/account/login", "none", "replace");
        return;
      }
      reloadFlows();
    }
  }, [loggedIn, loaded]);

  const reloadFlows = async () => {
    const res = await REST.ToDo.getV2Projects(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      alert("Fehler beim Laden der Flows: " + res.payload.error);
      return;
    }

    setFlows(res.payload.projects);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Flows</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Flows</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadFlows();
              ev.detail.complete();
            }}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
          <IonSearchbar
            onIonInput={(ev) => {
              let st = "";
              const target = ev.target as HTMLIonSearchbarElement;
              if (target) st = target.value!.toLowerCase();

              setQuery(st);
            }}
          />
          {flows
            .filter((f) => {
              if (query === "") return true;
              return f.name.toLowerCase().includes(query);
            })
            .map((f) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{f.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        expand={"block"}
                        routerLink={"/page/flows/" + f._id}
                      >
                        <IonIcon slot={"start"} ios={open} md={openSharp} />
                        Öffnen
                      </IonButton>
                      <IonButton
                        expand={"block"}
                        color={"danger"}
                        onClick={async () => {
                          if (
                            !confirm("Willst du diesen Flow wirklich löschen?")
                          )
                            return;

                          const res = await REST.ToDo.deleteV2Project({
                            token: localStorage.getItem("token") as string,
                            id: f._id,
                          });

                          if (res.status !== 200) {
                            alert(
                              "Fehler beim Löschen des Flows: " +
                                res.payload.error,
                            );
                            return;
                          }

                          await reloadFlows();
                        }}
                      >
                        <IonIcon slot={"start"} ios={trash} md={trashSharp} />
                        Löschen
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
        </IonContent>
      </IonPage>
    </>
  );
}
