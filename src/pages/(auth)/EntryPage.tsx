import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonLoading,
    IonPage,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {useHistory, useRouteMatch} from "react-router-dom";
import {firestore, storage} from "../../firebase/firebase";
import {Entry, toEntry} from "../../models/models";
import {useAuth} from "../../context/auth";
import {createOutline, trash} from "ionicons/icons";
import formatDate from "../../util/date";

interface RouteParams {
    id: string;
}

const EntryPage: React.FC = () => {
    const {userId} = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const match = useRouteMatch<RouteParams>();
    const {id} = match.params;
    const [entry, setEntry] = useState<Entry>();

    useEffect(() => {
        const entryRef = firestore.collection("users").doc(userId).collection("entries").doc(id);
        entryRef.get().then((result) => {
            const entry = toEntry(result);
            setEntry(entry);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }, [userId, id]);

    const handleDelete = () => {
        const imageRef = storage.ref(`/users/${userId}/pictures/${entry.title}-${entry.date.toString()}`);
        imageRef.delete().then(() => {
            const entryRef = firestore.collection("users").doc(userId).collection("entries").doc(id);
            entryRef.delete().then(() => {
                history.goBack();
            }).catch((err) => {
                console.log(err);
            });
        }).catch((err) => {
            console.log(err);
        });
    }

    const handleEdit = () => {
        history.push({
            pathname: '/my/entries/add/',
            state: entry
        });
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Memory Snap</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={handleDelete}>
                            <IonIcon icon={trash} slot="icon-only"/>
                        </IonButton>
                        <IonButton onClick={handleEdit}>
                            <IonIcon icon={createOutline} slot="icon-only"/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h1 className="ion-padding-start">{entry?.title}</h1>
                <h5 className="ion-padding-start">{formatDate(entry?.date)}</h5>
                <img src={entry?.pictureUrl} alt={entry?.title}/>
                <p>{entry?.description}</p>
                <IonLoading message='Loading' isOpen={loading}/>
            </IonContent>
        </IonPage>
    );
};

export default EntryPage;
