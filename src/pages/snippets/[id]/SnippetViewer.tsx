/**
 * src/pages/snippets/[id]/SnippetViewer.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 25.07.23
 *
 */
import { useLoggedIn } from "../../../hooks/useLoggedIn";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest";
import { useParams } from "react-router";
import * as React from "react";
import { Editor } from "@monaco-editor/react";

export default function SnippetViewer() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();
  const [snippet, setSnippet] = useState<any>();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (loaded) {
      if (!loggedIn) {
        router.push("/account/login", "none", "replace");
        return;
      }

      if (id) {
        reloadSnippet();
      }
    }
  }, [loaded, loggedIn, id]);

  useEffect(() => {
    if (snippet) {
      REST.Snippets.updateSnippet({
        token: localStorage.getItem("token") as string,
        id: id,
        title: snippet.title,
        code: snippet.code,
        language: snippet.language,
      });
    }
  }, [snippet]);

  const reloadSnippet = async () => {
    if (!id) return;

    const res = await REST.Snippets.getSnippet({
      token: localStorage.getItem("token") as string,
      id: id,
    });

    if (res.status !== 200) {
      alert("Fehler beim Laden der Snippets: " + res.payload.error);
      return;
    }

    setSnippet(res.payload.snippet);
  };

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{snippet ? snippet.title : "Laden..."}</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {snippet ? snippet.title : "Laden..."}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          {snippet ? (
            <>
              <Editor
                height={"100vh"}
                language={snippet?.language || "javascript"}
                theme={"vs-dark"}
                value={snippet?.code}
                options={{
                  fontSize: 20,
                }}
                onChange={(value) => {
                  if (snippet) {
                    setSnippet({
                      ...snippet,
                      code: value as string,
                    });
                  }
                }}
              />
            </>
          ) : null}
        </IonContent>
      </IonPage>
    </>
  );
}
