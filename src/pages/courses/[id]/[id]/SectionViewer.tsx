import REST from "@codeupspace/rest";
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
  IonMenuButton,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

export default function SectionViewer() {
  const { id, sid } = useParams<{ id: string; sid: string }>();
  const [course, setCourse] = useState<any>();
  const [section, setSection] = useState<any>();
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    REST.Course.getCourse({
      course: id,
      token: localStorage.getItem("token") || undefined,
    }).then(async (res) => {
      if (res.status !== 200) {
        setLoading(false);
        setError(true);
        return;
      }
      const res0 = await REST.Course.getSection({
        course: res.payload.course.friendlyName as string,
        section: sid,
        token: localStorage.getItem("token") || undefined,
      });

      if (res0.status !== 200) {
        setLoading(false);
        setError(true);
        return;
      }

      setSection(res0.payload.content);
      setLoading(false);
      setError(false);
    });
  }, [id, sid]);

  return (
    <>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>
              {loading ? "Laden..." : error ? "Fehler" : section.displayName}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">
                {loading ? "Laden..." : error ? "Fehler" : section.displayName}
              </IonTitle>
            </IonToolbar>
          </IonHeader>
          {!loading && !error && (
            <>
              <Plyr
                source={{
                  type: "video",
                  title: "Intro",
                  sources: [
                    {
                      src: section.videoUrl,
                      provider: "youtube",
                      size: 720,
                    },
                  ],
                  poster: "",
                  previewThumbnails: {
                    src: "",
                  },
                  tracks: [],
                }}
              />
              {section.quiz.length > 0 && (
                <IonCard>
                  <IonCardHeader>
                    <IonCardTitle>Quiz</IonCardTitle>
                    <IonCardSubtitle>
                      {section.quiz.length} Fragen
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {section.quiz.map((question: any, index: number) => {
                      return (
                        <div
                          key={"question-" + index}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            paddingBottom: "1rem",
                            gap: "1rem",
                          }}
                        >
                          <IonText>{question.question}</IonText>
                          {question.answers.map(
                            (answer: any, index2: number) => {
                              return (
                                <>
                                  <IonButton
                                    fill={"solid"}
                                    onClick={() => {
                                      if (answer.correct) {
                                        alert("Diese Antwort ist richtig!");
                                      } else {
                                        alert(
                                          "Falsch! Die richtige Antwort ist: " +
                                            question.answers.find(
                                              (a: any) => a.correct,
                                            ).answer,
                                        );
                                      }
                                    }}
                                  >
                                    {answer.answer}
                                  </IonButton>
                                </>
                              );
                            },
                          )}
                        </div>
                      );
                    })}
                  </IonCardContent>
                </IonCard>
              )}
            </>
          )}
        </IonContent>
      </IonPage>
    </>
  );
}
