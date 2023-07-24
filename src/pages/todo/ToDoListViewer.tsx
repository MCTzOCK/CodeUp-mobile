/**
 * src/pages/todo/ToDoListViewer.tsx
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
  IonFab,
  IonFabButton,
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
import { useLoggedIn } from "../../hooks/useLoggedIn";
import { useEffect } from "react";
import REST from "@codeupspace/rest";
import {
  add,
  addSharp,
  create,
  createSharp,
  open,
  openSharp,
  reload,
  trash,
  trashSharp,
} from "ionicons/icons";

export default function ToDoListViewer() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();

  const router = useIonRouter();

  const [lists, setLists] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/page/account/login");
    } else if (loaded && loggedIn) {
      reloadLists();
    }
  }, [loggedIn, loaded]);

  const reloadLists = async () => {
    const res = await REST.ToDo.getMyLists(
      localStorage.getItem("token") as string,
    );
    if (res.status !== 200) {
      alert("Fehler beim Laden der ToDo Listen: " + res.payload.error);
      return;
    }

    setLists(res.payload.lists);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>ToDo Listen</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">ToDo Listen</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadLists();
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
          {lists
            .filter((l) => {
              if (query === "") return true;
              if (l.name.toLowerCase().includes(query)) return true;
              return false;
            })
            .map((list) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{list.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        expand={"block"}
                        routerLink={"/page/todo/" + list._id}
                      >
                        <IonIcon slot={"start"} ios={open} md={openSharp} />
                        Öffnen
                      </IonButton>
                      <IonButton
                        expand={"block"}
                        onClick={async () => {
                          if (
                            confirm(
                              "Willst du die Liste " +
                                list.name +
                                " wirklich löschen?",
                            )
                          ) {
                            const res = await REST.ToDo.deleteList({
                              listId: list._id,
                              token: localStorage.getItem("token") as string,
                            });

                            if (res.status !== 200) {
                              alert(
                                "Fehler beim Löschen der Liste: " +
                                  res.payload.error,
                              );
                              return;
                            }

                            reloadLists();
                          }
                        }}
                        color={"danger"}
                      >
                        <IonIcon slot={"start"} ios={trash} md={trashSharp} />
                        Löschen
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}

          <IonFab slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton
              onClick={async () => {
                const name = prompt("Gib den Namen der neuen Liste ein:");

                if (name === null || name.length === 0) return;

                const res = await REST.ToDo.createList({
                  token: localStorage.getItem("token") as string,
                  name,
                });

                if (res.status !== 200) {
                  alert(
                    "Fehler beim Erstellen der Liste: " + res.payload.error,
                  );
                  return;
                }

                reloadLists();
              }}
            >
              <IonIcon ios={add} md={addSharp} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
  );
}
