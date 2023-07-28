/**
 * src/pages/blog/BlogViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 24.07.23
 *
 */
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest/dist";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import * as React from "react";
import Markdown from "markdown-to-jsx";
import { share, shareOutline, shareSharp } from "ionicons/icons";
import { Share } from "@capacitor/share";

export default function BlogViewer() {
  const { id } = useParams<{ id: string }>();

  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    REST.Blog.getBlog(id).then((res) => {
      if (res.status !== 200) {
        alert("Fehler beim Laden des Blogs: " + res.payload.error);
        return;
      }

      setBlog(res.payload.blog);
    });
  }, [id]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
              <IonBackButton />
            </IonButtons>
            <IonTitle>{blog ? blog.title : "Blog"}</IonTitle>
            <IonButtons slot={"end"}>
              <IonButton
                onClick={async () => {
                  await Share.share({
                    title: blog.title + " - CodeUp Blog",
                    url: "https://codeup.space/blog/" + id,
                    dialogTitle: "Teilen",
                  });
                }}
              >
                <IonIcon ios={shareOutline} md={shareSharp}></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">{blog ? blog.title : "Blog"}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <Markdown>{blog ? blog.content : "# Laden..."}</Markdown>
        </IonContent>
      </IonPage>
    </>
  );
}
