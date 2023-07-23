import REST from '@codeupspace/rest';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonHeader, IonInput, IonMenuButton, IonPage, IonSearchbar, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
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
            token: localStorage.getItem("token") || undefined
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


    }, []);

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
                                    error ? "Fehler" : section.displayName
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
                                        error ? "Fehler" : section.displayName
                                    )
                                }
                            </IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    {
                        (!loading && !error) && (
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
                            </>
                        )
                    }
                </IonContent>
            </IonPage>
        </>
    )
}