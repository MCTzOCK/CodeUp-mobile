/**
 * src/pages/orgs/Orgs.tsx
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
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import * as React from "react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest/dist";
import { add, addSharp, reload } from "ionicons/icons";

export default function Orgs() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();

  const [orgs, setOrgs] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [segment, setSegment] = useState<string>("all");

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/account/login", "none", "replace");
    } else if (loggedIn && loaded) {
      reloadOrgs();
    }
  }, [loaded, loggedIn]);

  const reloadOrgs = async () => {
    const res = await REST.Orgs.getOrgs(
      localStorage.getItem("token") as string,
    );
    if (res.status !== 200) {
      alert("Organisationen konnten nicht geladen werden!");
      return;
    }

    setOrgs(res.payload.orgs);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Organisationen</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Organisationen</IonTitle>
            </IonToolbar>
          </IonHeader>

          <div
            style={{
              marginInline: "10px",
            }}
          >
            <IonSegment
              value={segment}
              onIonChange={(ev) => {
                setQuery("");
                setSegment(ev.detail.value as string);
              }}
            >
              <IonSegmentButton value={"all"}>Alle</IonSegmentButton>
              <IonSegmentButton value={"admin"}>Admin</IonSegmentButton>
            </IonSegment>
          </div>
          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadOrgs();
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
          {orgs
            .filter((org) => {
              if (query === "") return true;
              if (org.name.toLowerCase().includes(query)) return true;
              return false;
            })
            .filter((org) => {
              if (segment === "all") return true;
              if (segment === "admin") {
                if (org.owner === userInfo.id) return true;
                return false;
              }
              return true;
            })
            .map((org) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{org.name}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText>{org.members.length + 1} Mitglieder</IonText>
                      <br />
                      <IonText>{org.subscription} Abonnement</IonText>
                      <br />
                      <IonText>
                        Erstellt am {new Date(org.createdAt).toLocaleString()}
                      </IonText>
                      <IonButton
                        routerLink={"/page/orgs/" + org.name}
                        expand={"block"}
                        color={"primary"}
                        style={{
                          marginTop: "20px",
                        }}
                      >
                        Öffnen
                      </IonButton>
                      {org.owner !== userInfo.id && (
                        <>
                          <IonButton
                            expand={"block"}
                            color={"danger"}
                            onClick={async () => {
                              if (!confirm("Wirklich verlassen?")) return;

                              const res = await REST.Orgs.removeOrgMember({
                                token: localStorage.getItem("token") as string,
                                name: org.name,
                                userId: userInfo.id,
                              });

                              if (res.status !== 200) {
                                alert(
                                  "Organisation konnte nicht verlassen werden!",
                                );
                                return;
                              }

                              await reloadOrgs();
                            }}
                          >
                            Verlassen
                          </IonButton>
                        </>
                      )}

                      {org.owner === userInfo.id && (
                        <>
                          <IonButton
                            expand={"block"}
                            color={"primary"}
                            onClick={async () => {
                              const name = prompt("Neuer Name", org.name);

                              if (!name) return;

                              const res = await REST.Orgs.renameOrg({
                                token: localStorage.getItem("token") as string,
                                newName: name,
                                oldName: org.name,
                              });

                              if (res.status !== 200) {
                                alert(
                                  "Organisation konnte nicht umbenannt werden: " +
                                    res.payload.error,
                                );
                                return;
                              }

                              await reloadOrgs();
                            }}
                          >
                            Umbenennen
                          </IonButton>
                          <IonButton
                            expand={"block"}
                            color={"danger"}
                            onClick={async () => {
                              if (
                                !confirm(
                                  "Wirklich löschen? Diese Aktion kann nicht mehr rückgängig gemacht werden!",
                                )
                              )
                                return;

                              const res = await REST.Orgs.deleteOrg({
                                token: localStorage.getItem("token") as string,
                                name: org.name,
                              });

                              if (res.status !== 200) {
                                alert(
                                  "Organisation konnte nicht gelöscht werden!",
                                );
                                return;
                              }

                              await reloadOrgs();
                            }}
                          >
                            Löschen
                          </IonButton>
                        </>
                      )}
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton>
              <IonIcon
                ios={add}
                md={addSharp}
                onClick={async () => {
                  const name = prompt("Name der Organisation");

                  if (!name) return;

                  const res = await REST.Orgs.createOrg({
                    name: name,
                    token: localStorage.getItem("token") as string,
                  });

                  if (res.status !== 200) {
                    alert("Organisation konnte nicht erstellt werden!");
                    return;
                  }

                  await reloadOrgs();
                }}
              />
            </IonFabButton>
          </IonFab>
        </IonContent>
      </IonPage>
    </>
  );
}
