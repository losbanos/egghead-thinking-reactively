import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import DisplayCenter from "../components/presentational/DisplayCenter";
import SlowButtons from '../components/SlowButtons';

const Tab1 = () => {
  return (
    <IonPage>
      <IonContent>
        <DisplayCenter>
          <SlowButtons></SlowButtons>
        </DisplayCenter>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
