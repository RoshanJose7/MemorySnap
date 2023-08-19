import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonDatetime,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
    isPlatform
} from '@ionic/react';
import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from "../../context/auth";
import {firestore, storage} from "../../firebase/firebase";
import {useHistory} from "react-router-dom";
import {CameraResultType, CameraSource, Plugins} from "@capacitor/core";
import formatDate from "../../util/date";

const {Camera} = Plugins;

const AddEntryPage: React.FC = () => {
    const {userId} = useAuth();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");
    const [pictureUrl, setPictureUrl] = useState("/assets/placeholder.png");
    const [entry, setEntry]: any = useState();
    const fileInputRef = useRef<HTMLInputElement>();

    useEffect(() => () => {
        if (pictureUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pictureUrl);
        }
    }, [pictureUrl]);

    useEffect(() => {
        if (history.location.state) {
            setEntry(history.location.state);
        }
    }, []);

    useEffect(() => {
        if (entry) {
            setTitle(entry.title);
            setDate(entry.date);
            setDescription(entry.description);
            setPictureUrl(entry.pictureUrl);
        }
    }, [entry]);

    const handleSave = async () => {
        setLoading(true);

        if (entry) {
            await handleUpdate();
            return;
        }

        const entriesRef = firestore.collection('users').doc(userId)
            .collection('entries');
        const entryData = {date, title, pictureUrl, description}
        if (pictureUrl.startsWith('blob:')) {
            entryData.pictureUrl = await savePicture(pictureUrl);
        }
        entriesRef.add(entryData).then(() => {
            history.goBack();
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            setLoading(false);
        })
    }

    const handleUpdate = async () => {
        const entryData = {date, title, pictureUrl, description}
        // Title Aynı Resim Farklı
        if (title === entry.title && pictureUrl.startsWith('blob:')) {
            const imageRef = storage.ref(`/users/${userId}/pictures/${entry.title}-${entry.date.toString()}`);
            imageRef.delete().then(async () => {
                const entryRef = firestore.collection('users').doc(userId)
                    .collection('entries').doc(entry.id);
                if (pictureUrl.startsWith('blob:')) {
                    entryData.pictureUrl = await savePicture(pictureUrl);
                }
                entryRef.update(entryData).then(() => {
                    history.replace('/');
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
            }).catch((err) => {
                console.log(err);
            });
        } else if (title !== entry.title && !pictureUrl.startsWith('blob:')) {
            // Title farklı Resim Aynı
            const imageRef = storage.ref(`/users/${userId}/pictures/${entry.title}-${entry.date.toString()}`);
            imageRef.getDownloadURL().then(async () => {
                entryData.pictureUrl = await savePicture(pictureUrl);
                firestore.collection('users').doc(userId)
                    .collection('entries').doc(entry.id).update(entryData).then(async () => {
                    await imageRef.delete();
                    history.replace('/');
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                });
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            });
        } else if (title !== entry.title && pictureUrl.startsWith('blob:')) {
            // Title Farklı Resim Farklı
            const imageRef = storage.ref(`/users/${userId}/pictures/${entry.title}-${entry.date.toString()}`);
            imageRef.delete().then(async () => {
                const entryRef = firestore.collection('users').doc(userId)
                    .collection('entries').doc(entry.id);
                if (pictureUrl.startsWith('blob:')) {
                    entryData.pictureUrl = await savePicture(pictureUrl);
                }
                entryRef.update(entryData).then(() => {
                    history.replace('/');
                    setLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setLoading(false);
                })
            }).catch((err) => {
                console.log(err);
            });
        } else {
            // Title Aynı Resim Aynı
            const entryRef = firestore.collection('users').doc(userId)
                .collection('entries').doc(entry.id);
            entryRef.update(entryData).then(() => {
                history.replace('/');
                setLoading(false);
            }).catch((err) => {
                console.log(err);
                setLoading(false);
            })
        }
    }

    const savePicture = async (blobUrl) => {
        const pictureRef = storage.ref(`/users/${userId}/pictures/${title}-${date.toString()}`);
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        const snapshot = await pictureRef.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        return url;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files.length > 0) {
            const file = event.target.files.item(0);
            const pictureUrl = URL.createObjectURL(file);
            setPictureUrl(pictureUrl);
        }
    }

    const handlePictureClick = () => {
        if (isPlatform('capacitor')) {
            Camera.getPhoto({
                resultType: CameraResultType.Uri,
                source: CameraSource.Prompt,
                width: 600,
                quality: 50,
                allowEditing: true
            }).then((photo) => {
                setPictureUrl(photo.webPath);
            }).catch((err) => {
                console.log(err);
            })
        } else {
            fileInputRef.current.click()
        }
    }

    const returnIsValid = () => {
        return date.length > 0 && title.length > 0 && pictureUrl !== '/assets/placeholder.png';
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton/>
                    </IonButtons>
                    <IonTitle>Daily Moments</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {
                    entry && <h1 className='ion-padding'>Edit Moment from {formatDate(entry?.date)}</h1>
                }
                {
                    !entry && <h1 className='ion-padding'>Add New Moment</h1>
                }
                <IonList>
                    <IonItem className='ion-margin-bottom'>
                        <IonLabel position="stacked">Date</IonLabel>
                        <IonDatetime value={date} onIonChange={(event) => setDate(event.detail.value)}/>
                    </IonItem>
                    <IonItem className='ion-margin-bottom'>
                        <IonLabel position="stacked">Title</IonLabel>
                        <IonInput value={title} onIonChange={(event) => setTitle(event.detail.value)}/>
                    </IonItem>
                    <IonItem className='ion-margin-bottom'>
                        <IonLabel position="stacked">Picture</IonLabel>
                        <br/>
                        <input type="file" accept="image/*"
                               hidden ref={fileInputRef}
                               onChange={handleFileChange}/>
                        <img src={pictureUrl} alt=""
                             style={{cursor: 'pointer'}}
                             onClick={handlePictureClick}/>
                    </IonItem>
                    <IonItem className='ion-margin-bottom'>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonTextarea rows={4} value={description}
                                     onIonChange={(event) => setDescription(event.detail.value)}/>
                    </IonItem>
                </IonList>
                <IonButton disabled={!returnIsValid()} expand="block" onClick={handleSave}>Save</IonButton>
                <IonLoading message='Loading' isOpen={loading}/>
            </IonContent>
        </IonPage>
    );
};

export default AddEntryPage;
