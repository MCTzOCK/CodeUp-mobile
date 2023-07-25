/**
 * src/pages/snippets/CodeSnippets.tsx
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
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
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
import * as React from "react";
import { useEffect, useState } from "react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import REST from "@codeupspace/rest/dist";
import {
  add,
  addSharp,
  open,
  openSharp,
  trash,
  trashSharp,
} from "ionicons/icons";

export default function CodeSnippets() {
  const [query, setQuery] = useState<string>("");
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();
  const [snippets, setSnippets] = useState<any[]>([]);

  useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/account/login", "none", "replace");
        return;
      }

      reloadSnippets();
    }
  }, [loaded, loggedIn]);

  const reloadSnippets = async () => {
    const res = await REST.Snippets.getSnippets(
      localStorage.getItem("token") as string,
    );

    if (res.status !== 200) {
      alert("Fehler beim Laden der Snippets: " + res.payload.error);
      return;
    }

    setSnippets(res.payload.snippets);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Code Snippets</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Code Snippets</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadSnippets();
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
          {snippets
            .filter((s) => {
              if (query === "") return true;
              if (s.title.toLowerCase().includes(query)) return true;
              return false;
            })
            .map((sn) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{sn.title}</IonCardTitle>
                      <IonCardSubtitle>
                        {new Date(sn.createdAt).toLocaleString()}
                        &nbsp;&#8226;&nbsp;
                        {sn.language}
                      </IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonButton
                        expand={"block"}
                        routerLink={"/page/snippets/" + sn._id}
                      >
                        <IonIcon ios={open} md={openSharp} slot={"start"} />
                        Öffnen
                      </IonButton>
                      <IonButton
                        expand={"block"}
                        color={"danger"}
                        onClick={async () => {
                          if (
                            !confirm("Willst du das Snippet wirklich löschen?")
                          )
                            return;

                          const res = await REST.Snippets.deleteSnippet({
                            token: localStorage.getItem("token") as string,
                            id: sn._id,
                          });

                          if (res.status !== 200) {
                            alert(
                              "Fehler beim Löschen des Snippets: " +
                                res.payload.error,
                            );
                            return;
                          }

                          await reloadSnippets();
                        }}
                      >
                        <IonIcon ios={trash} md={trashSharp} slot={"start"} />
                        Löschen
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                </>
              );
            })}
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              onClick={async () => {
                const name = prompt("Wie soll das Snippet heißen?");
                const lang = prompt("Welche Sprache soll das Snippet haben?");

                if (!name || !lang) return;

                const res = await REST.Snippets.createSnippet({
                  code: "Hallo Welt!",
                  language: lang as string,
                  title: name as string,
                  token: localStorage.getItem("token") as string,
                });

                if (res.status !== 200) {
                  alert(
                    "Fehler beim Erstellen des Snippets: " + res.payload.error,
                  );
                  return;
                }

                await reloadSnippets();
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
