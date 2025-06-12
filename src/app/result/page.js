// pages/LearningResultPage.jsx
"use client";

import '@/app/globals.css';
import React from 'react';
import VisualLearningPage from '@/components/result/visual';
import AudLearningPage from '@/components/result/aud';
import KineLearningPage from '@/components/result/kine';
import LoadingPage from '@/components/result/loading';

const LearningResultPage = ({ learning_style }) => {
  let ComponentToRender;

  switch (learning_style) {
    case 1:
      ComponentToRender = VisualLearningPage;
      break;
    case 2:
      ComponentToRender = AudLearningPage;
      break;
    case 3:
      ComponentToRender = KineLearningPage;
      break;
    default:
      ComponentToRender = () => (
        <div className="text-center text-red-500 p-4">
          Gaya belajar tidak dikenali.
        </div>
      );
  }

  return (
    <div>
      {/* <ComponentToRender /> */}
      {/* <AudLearningPage/> */}
      {/* <VisualLearningPage/> */}
      {/* <KineLearningPage/> */}
      <LoadingPage />
    </div>
  );
};

export default LearningResultPage;
