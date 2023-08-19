import {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonThumbnail,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import {firestore} from "../../firebase/firebase";
import {Entry, toEntry} from "../../models/models";
import {useAuth} from "../../context/auth";
import {add} from "ionicons/icons";
import formatDate from "../../util/date";

const HomePage: React.FC = () => {
    const {userId} = useAuth();
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [listLength, setListLength] = useState(0);

    useEffect(() => {
        const entriesRef = firestore.collection("users").doc(userId).collection("entries");
        return entriesRef
            .orderBy('date', 'desc')
            .onSnapshot(({docs}) => {
                setLoading(false)
                setEntries(docs.map(toEntry))
                getListHeight();
            });
    }, [userId]);

    const getListHeight = () => {
        setListLength(Math.floor(((window.innerHeight - 356) / 80)));
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Memory Snap</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <h1 className='ion-padding'>Your Moments</h1>
                {
                    entries?.length === 0 && !loading &&
                    <h1 className='ion-padding'>It seems, you have no moments yet</h1>
                }
                <IonList>
                    {entries.map((entry) =>
                        <IonItem button key={entry.id}
                                 routerLink={`/my/entries/view/${entry.id}`}>
                            <IonThumbnail slot="end">
                                <IonImg src={entry.pictureUrl}/>
                            </IonThumbnail>
                            <IonLabel class="ion-text-nowrap">
                                <h2>{entry.title}</h2>
                                <p>{entry.description}</p>
                                <h3>{formatDate(entry.date)}</h3>
                            </IonLabel>
                        </IonItem>
                    )}
                </IonList>
                <IonFab vertical="bottom" horizontal="end">
                    <IonFabButton routerLink="/my/entries/add">
                        <IonIcon icon={add}/>
                    </IonFabButton>
                </IonFab>
                <IonLoading message='Loading' isOpen={loading}/>
            </IonContent>
            {
                entries?.length <= listLength &&
                <img className='bottom-banner' src='/assets/img/girl2.png' width="216" alt={''}/>
            }
        </IonPage>
    );
};

export default HomePage;
