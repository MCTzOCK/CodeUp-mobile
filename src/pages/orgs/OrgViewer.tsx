/**
 * src/pages/orgs/OrgViewer.tsx
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
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonModal,
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
import { useEffect, useRef, useState } from "react";
import REST from "@codeupspace/rest";
import { useParams } from "react-router";

export default function OrgViewer() {
  const { loggedIn, userInfo, loaded } = useLoggedIn();
  const router = useIonRouter();
  const { name } = useParams<{ name: string }>();

  const [org, setOrg] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const [segment, setSegment] = useState<string>("news");

  const [news, setNews] = useState<any[]>();

  const [isOpen, setIsOpen] = useState(false);

  const [currentBlog, setCurrentBlog] = useState<any>();
  const [courses, setCourses] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    if (loaded && !loggedIn) {
      router.push("/account/login", "none", "replace");
    } else if (loggedIn && loaded) {
      REST.Orgs.getOrg({
        token: localStorage.getItem("token") as string,
        name: name,
      }).then(async (res) => {
        if (res.status !== 200) {
          setError(true);
          setLoading(false);
          return;
        }

        setOrg(res.payload.org);
        setLoading(false);
      });
    }
  }, [loaded, loggedIn]);

  useEffect(() => {
    reloadSegment();
  }, [segment]);

  const reloadSegment = async () => {
    if (segment === "news") {
      const res = await REST.Orgs.getBlogs({
        token: localStorage.getItem("token") as string,
        org: name,
      });

      if (res.status !== 200) {
        setError(true);
        setLoading(false);
        alert("Fehler: " + res.payload.error);
        return;
      }

      setNews(res.payload.blogs);
    } else if (segment === "courses") {
      const res = await REST.Course.listCourses({
        token: localStorage.getItem("token") as string,
      });

      if (res.status !== 200) {
        setError(true);
        setLoading(false);
        alert("Fehler: " + res.payload.error);
        return;
      }

      const courses = res.payload.courses;
      const orgCourses = courses.filter((course: any) => {
        if (course.available === "org:" + org._id) return true;
        return false;
      });

      setCourses(orgCourses);
    }
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
              {loading ? "Laden..." : error ? "Fehler" : org.name}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {loading ? "Laden..." : error ? "Fehler" : org.name}
              </IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonSegment
            value={segment}
            onIonChange={(ev) => {
              setQuery("");
              setSegment(ev.detail.value as string);
            }}
          >
            <IonSegmentButton value="news">
              <IonLabel>Mitteilungen</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="courses">
              <IonLabel>Kurse</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          <IonRefresher
            slot="fixed"
            onIonRefresh={async (ev) => {
              await reloadSegment();
              ev.detail.complete();
            }}
          >
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>

          <IonSearchbar
            value={query}
            onIonInput={(ev) => {
              let st = "";
              const target = ev.target as HTMLIonSearchbarElement;
              if (target) st = target.value!.toLowerCase();

              setQuery(st);
            }}
          />
          {segment === "news" && (
            <>
              {news &&
                news
                  .sort((a, b) => {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    );
                  })
                  .filter((blog) => {
                    if (query === "") return true;
                    if (blog.title.toLowerCase().includes(query)) return true;
                    return false;
                  })
                  .map((blog) => {
                    return (
                      <>
                        <IonCard
                          onClick={() => {
                            setIsOpen(true);
                            setCurrentBlog(blog);
                          }}
                        >
                          <IonCardHeader>
                            <IonCardTitle>{blog.title}</IonCardTitle>
                            <IonCardSubtitle>
                              {new Date(blog.createdAt).toLocaleString()}
                            </IonCardSubtitle>
                          </IonCardHeader>
                        </IonCard>
                      </>
                    );
                  })}
            </>
          )}
          {segment === "courses" && (
            <>
              {courses
                .filter((course) => {
                  if (query === "") return true;
                  if (course.name.toLowerCase().includes(query)) return true;
                  if (course.description.toLowerCase().includes(query))
                    return true;
                  return false;
                })
                .map((course) => {
                  return (
                    <>
                      <IonCard routerLink={"/page/courses/" + course._id}>
                        <img alt={course.name} src={course.splashImage} />
                        <IonCardHeader>
                          <IonCardTitle>{course.name}</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>{course.description}</IonCardContent>
                      </IonCard>
                    </>
                  );
                })}
            </>
          )}
          {currentBlog && (
            <IonModal isOpen={isOpen}>
              <>
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>{currentBlog.title}</IonTitle>
                    <IonButtons slot="end">
                      <IonButton
                        onClick={() => {
                          setCurrentBlog(null);
                          setIsOpen(false);
                        }}
                      >
                        Schließen
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                  <IonText>{currentBlog.content}</IonText>
                </IonContent>
              </>
            </IonModal>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
