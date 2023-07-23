import REST from "@codeupspace/rest";
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonMenuButton, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from "react";
import { useParams } from "react-router";


export default function CourseViewer() {
    const { id } = useParams<{ id: string; }>();
    const [course, setCourse] = useState<any>();
    const [sections, setSections] = useState<any[]>([]);
    const [error, setError] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
        REST.Course.getCourse({
            course: id,
            token: localStorage.getItem("token") || undefined
        }).then(async (res) => {
            if (res.status !== 200) {
                setLoading(false);
                setError(true);
                return;
            }

            let contents0 = [];
            for (const contentId of res.payload.course.contentPositions) {
                const res0 = await REST.Course.getSection({
                    course: res.payload.course.friendlyName as string,
                    section: contentId,
                    token: localStorage.getItem("token") || undefined,
                });

                if (res0.status === 200) {
                    contents0.push(res0.payload.content);
                }
            }
            console.log(res.payload.course.contentPositions)

            setSections(contents0);
            setCourse(res.payload.course);
            setLoading(false);
        })
    }, []);

    const [query, setQuery] = useState<string>("");


    return (
        <>
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>
                            {
                                loading ? "Laden..." : (
                                    error ? "Fehler" : course.name
                                )
                            }
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">
                                {
                                    loading ? "Laden..." : (
                                        error ? "Fehler" : course.name
                                    )
                                }
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    {
                        !loading && !error && (
                            <>
                                <img src={course.splashImage} />
                                <IonText style={{
                                    "font-size": "1.2rem"
                                }}>{course.description}</IonText>
                                <IonText style={{
                                    "font-size": "2rem",
                                    display: "block",
                                    "font-weight": "700",
                                    "margin-top": "2rem"
                                }}>Lektionen</IonText>
                                <IonSearchbar onIonInput={(ev) => {
                                    let st = '';
                                    const target = ev.target as HTMLIonSearchbarElement;
                                    if (target) st = target.value!.toLowerCase();

                                    setQuery(st);
                                }} />
                                {
                                    sections
                                    .filter((section) => {
                                        if(query === "") return true;
                                        if(section.displayName.toLowerCase().includes(query)) return true;
                                        return false;
                                    })
                                    .map((section) => {
                                        return (
                                            <>
                                                <IonCard routerLink={"/page/courses/" + course._id + "/" + section._id}>
                                                    <IonCardHeader>
                                                        <IonCardTitle>{section.displayName}</IonCardTitle>
                                                        <IonCardSubtitle>{new Date(section.createdAt).toLocaleString()}</IonCardSubtitle>
                                                    </IonCardHeader>
                                                </IonCard>
                                            </>
                                        )
                                    })
                                }
                            </>
                        )
                    }
                </IonContent>
            </IonPage>
        </>
    )
}