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
  IonInput,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useEffect, useState } from "react";
import REST from "@codeupspace/rest";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    REST.Course.listCourses({
      token: localStorage.getItem("token") || undefined,
    }).then((res) => {
      if (res.status !== 200) {
        alert("Fehler beim Laden der Kurse");
        return;
      }

      setCourses(res.payload.courses);
    });
  }, []);

  const [query, setQuery] = useState<string>("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Kurse</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Kurse</IonTitle>
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
        {courses
          .filter((course) => {
            if (query === "") return true;
            if (course.name.toLowerCase().includes(query)) return true;
            if (course.description.toLowerCase().includes(query)) return true;
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
      </IonContent>
    </IonPage>
  );
};

export default Courses;
