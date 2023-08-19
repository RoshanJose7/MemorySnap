import {IonApp, IonLoading, IonRouterOutlet,} from '@ionic/react';
import React from 'react';
import {IonReactRouter} from "@ionic/react-router";
import {Redirect, Route} from "react-router-dom";
import SignInPage from "./pages/SignInPage";
import AppTabs from "./AppTabs";
import {AuthContext, useAuthInit} from "./context/auth";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage from "./pages/SignUpPage";
import './theme/DailyMoments.css';

const App: React.FC = () => {
    const authState = useAuthInit();

    if (authState.loading) {
        return <IonLoading isOpen/>
    }

    return (
        <IonApp>
            <AuthContext.Provider value={authState.auth}>
                <IonReactRouter>
                    <IonRouterOutlet>
                        <Route exact path="/signin">
                            <SignInPage/>
                        </Route>
                        <Route exact path="/signup">
                            <SignUpPage/>
                        </Route>
                        <Route path="/my">
                            <AppTabs/>
                        </Route>
                        <Redirect exact path="/" to="/my/entries"/>
                        <Route>
                            <NotFoundPage/>
                        </Route>
                    </IonRouterOutlet>
                </IonReactRouter>
            </AuthContext.Provider>
        </IonApp>
    );
};

export default App;
