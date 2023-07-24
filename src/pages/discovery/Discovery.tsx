/**
 * src/pages/discovery/Discovery.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.23
 *
 */
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest/dist";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import * as React from "react";
import { open, openSharp } from "ionicons/icons";

export default function Discovery() {
  const [projects, setProjects] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    REST.Discovery.getDiscoveryProjects().then((res) => {
      setProjects(res.payload.projects);
    });
  }, []);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Discovery</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Discovery</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonSearchbar
            onIonInput={(ev) => {
              let st = "";
              const target = ev.target as HTMLIonSearchbarElement;
              if (target) st = target.value!.toLowerCase();

              setQuery(st);
            }}
          />
          {projects
            .filter((p) => {
              if (query === "") return true;
              if (p.name.toLowerCase().includes(query)) return true;
              if (p.description.toLowerCase().includes(query)) return true;
              return false;
            })
            .map((p) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{p.name}</IonCardTitle>
                      <IonCardSubtitle>von {p.author}</IonCardSubtitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <IonText>{p.description}</IonText>
                      <IonButton
                        expand={"block"}
                        style={{
                          "margin-top": "10px",
                        }}
                        onClick={() => {
                          window.open("https://" + p.domain, "_blank");
                        }}
                      >
                        <IonIcon slot={"start"} ios={open} md={openSharp} />
                        Ansehen
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
