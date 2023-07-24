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
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import * as React from "react";
import { useLoggedIn } from "../../hooks/useLoggedIn";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest/dist";
import { reload } from "ionicons/icons";

export default function Orgs() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();

  const [orgs, setOrgs] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

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
            .map((org) => {
              return (
                <>
                  <IonCard routerLink={"/page/orgs/" + org.name}>
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
