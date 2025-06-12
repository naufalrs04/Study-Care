// pages/LearningResultPage.jsx
"use client";

import "@/app/globals.css";
import React from "react";
import VisualLearningPage from "@/components/result/visual";
import AudLearningPage from "@/components/result/aud";
import KineLearningPage from "@/components/result/kine";

const LearningResultPage = ({ learning_style, onRetake }) => {
  let ComponentToRender;

  switch (learning_style) {
    case 1:
      ComponentToRender = () => <VisualLearningPage onRetake={onRetake} />;
      break;
    case 2:
      ComponentToRender = () => <AudLearningPage onRetake={onRetake} />;
      break;
    case 3:
      ComponentToRender = () => <KineLearningPage onRetake={onRetake} />;
      break;
    default:
      ComponentToRender = () => (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">
              Gaya belajar tidak dikenali.
            </div>
            <button
              onClick={onRetake}
              className="px-8 py-3 bg-cyan-500 text-white rounded-full font-medium hover:bg-cyan-600 transition-colors"
            >
              Ulangi Tes
            </button>
          </div>
        </div>
      );
  }

  return <ComponentToRender />;
};

export default LearningResultPage;
