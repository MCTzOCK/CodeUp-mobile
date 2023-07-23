/**
 * src/pages/ideas/ProjectIdeas.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.2023
 *
 */

import * as React from "react";
import { useEffect } from "react";
import REST from "@codeupspace/rest";
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
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export default function ProjectIdeas() {
  const [ideas, setIdeas] = React.useState<any[]>([]);
  const [query, setQuery] = React.useState<string>("");

  useEffect(() => {
    REST.Ideas.getProjectIdeas().then((r) => {
      setIdeas(r.payload.ideas);
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
            <IonTitle>Projektideen</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Projektideen</IonTitle>
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
          {ideas
            .filter((i) => {
              if (query.length === 0) return true;
              if (i.title.toLowerCase().includes(query)) return true;
              if (i.description.toLowerCase().includes(query)) return true;
              return false;
            })
            .map((i) => {
              return (
                <>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>{i.title}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>{i.description}</IonCardContent>
                  </IonCard>
                </>
              );
            })}
        </IonContent>
      </IonPage>
    </>
  );
}
