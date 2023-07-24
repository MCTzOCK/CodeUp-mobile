/**
 * src/pages/todo/[id]/ToDoTaskViewer.tsx
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
  IonCheckbox,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonList,
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useLoggedIn } from "../../../hooks/useLoggedIn";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest";
import {
  add,
  addSharp,
  create,
  createSharp,
  trash,
  trashSharp,
} from "ionicons/icons";

export default function ToDoTaskViewer() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const { id } = useParams<{ id: string }>();
  const [list, setList] = useState<any>();
  const router = useIonRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  React.useEffect(() => {
    if (!loggedIn && loaded) {
      router.push("/page/account/login");
    } else if (loaded && loggedIn) {
      reloadList();
    }
  }, [loggedIn, loaded, id]);

  const reloadList = () => {
    REST.ToDo.getList({
      listId: id,
      token: localStorage.getItem("token") as string,
    }).then(async (res) => {
      if (res.status !== 200) {
        setError(true);
        alert(res.payload.error);
        setLoading(false);
      } else {
        setLoading(false);
        setList(res.payload.list);
      }
    });
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              {loading ? "Laden..." : error ? "Fehler" : list.name}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {loading ? "Laden..." : error ? "Fehler" : list.name}
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          {list && (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Zu erledigen</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList
                    style={{
                      "border-radius": "12px",
                    }}
                  >
                    {list.tasks
                      .filter((t: any) => !t.finished)
                      .map((t: any) => {
                        return (
                          <>
                            <IonItemSliding>
                              <IonItem>
                                <IonCheckbox
                                  labelPlacement={"end"}
                                  justify={"start"}
                                  onIonChange={async (e) => {
                                    await REST.ToDo.updateItem({
                                      token: localStorage.getItem(
                                        "token",
                                      ) as string,
                                      listId: id,
                                      taskUUID: t.uuid,
                                      update: {
                                        finished: true,
                                      },
                                    });

                                    reloadList();
                                  }}
                                  checked={false}
                                >
                                  {t.name}
                                </IonCheckbox>
                              </IonItem>

                              <IonItemOptions>
                                <IonItemOption
                                  color={"danger"}
                                  onClick={async () => {
                                    if (confirm("Wirklich löschen?")) {
                                      await REST.ToDo.deleteTask({
                                        token: localStorage.getItem(
                                          "token",
                                        ) as string,
                                        listId: id,
                                        taskUUID: t.uuid,
                                      });
                                      reloadList();
                                    }
                                  }}
                                >
                                  <IonIcon ios={trash} md={trashSharp} />
                                  Löschen
                                </IonItemOption>
                              </IonItemOptions>
                            </IonItemSliding>
                          </>
                        );
                      })}
                  </IonList>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>Erledigt</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonList
                    style={{
                      "border-radius": "12px",
                    }}
                  >
                    {list.tasks
                      .filter((t: any) => t.finished)
                      .map((t: any) => {
                        return (
                          <>
                            <IonItemSliding>
                              <IonItem>
                                <IonCheckbox
                                  labelPlacement={"end"}
                                  justify={"start"}
                                  checked={true}
                                  style={{
                                    "text-decoration": "line-through",
                                  }}
                                  onIonChange={async (e) => {
                                    await REST.ToDo.updateItem({
                                      token: localStorage.getItem(
                                        "token",
                                      ) as string,
                                      listId: id,
                                      taskUUID: t.uuid,
                                      update: {
                                        finished: false,
                                      },
                                    });

                                    reloadList();
                                  }}
                                >
                                  {t.name}
                                </IonCheckbox>
                              </IonItem>
                              <IonItemOptions>
                                <IonItemOption
                                  color={"danger"}
                                  onClick={async () => {
                                    if (confirm("Wirklich löschen?")) {
                                      await REST.ToDo.deleteTask({
                                        token: localStorage.getItem(
                                          "token",
                                        ) as string,
                                        listId: id,
                                        taskUUID: t.uuid,
                                      });
                                      reloadList();
                                    }
                                  }}
                                >
                                  <IonIcon ios={trash} md={trashSharp} />
                                  Löschen
                                </IonItemOption>
                              </IonItemOptions>
                            </IonItemSliding>
                          </>
                        );
                      })}
                  </IonList>
                </IonCardContent>
              </IonCard>

              <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton
                  onClick={async () => {
                    const task = prompt("Name der Aufgabe") as string;

                    const res = await REST.ToDo.createTask({
                      token: localStorage.getItem("token") as string,
                      listId: id,
                      task,
                    });

                    if (res.status !== 200) {
                      alert("Fehler beim Erstellen der Aufgabe");
                    } else {
                      reloadList();
                    }
                  }}
                >
                  <IonIcon ios={add} md={addSharp} />
                </IonFabButton>
              </IonFab>
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
