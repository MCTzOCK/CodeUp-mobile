/**
 * src/pages/blog/BlogList.tsx
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
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import * as React from "react";
import REST from "@codeupspace/rest/dist";

export default function BlogList() {
  const [query, setQuery] = useState<string>("");
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    reloadBlogs();
  }, []);

  const reloadBlogs = async () => {
    const res = await REST.Blog.getBlogsB();

    if (res.status !== 200) {
      alert("Fehler beim Laden der Blogs: " + res.payload.error);
      return;
    }

    setBlogs(res.payload.blogs);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Blog</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Blog</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadBlogs();
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

          {blogs
            .filter((b) => {
              if (query === "") return true;
              return b.title.toLowerCase().includes(query);
            })
            .sort((a, b) => {
              return (
                new Date(b.published_at).getTime() -
                new Date(a.published_at).getTime()
              );
            })
            .map((b) => {
              return (
                <>
                  <IonCard routerLink={"/page/blog/" + b._id}>
                    <IonCardHeader>
                      <IonCardTitle>{b.title}</IonCardTitle>
                      <IonCardSubtitle>
                        {new Date(b.published_at).toLocaleString()}
                      </IonCardSubtitle>
                    </IonCardHeader>
                  </IonCard>
                </>
              );
            })}
        </IonContent>
      </IonPage>
    </>
  );
}
