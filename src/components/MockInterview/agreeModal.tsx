import React from "react";
import { createPortal } from "react-dom";

const InterviewRulesModal: React.FC<{ onAgree: () => void }> = ({
  onAgree,
}) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">Interview Rules</h2>

        <div className="space-y-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            ⚠️ You will have <b>3 minutes</b> to set up your microphone and
            check if it is working properly. You can also test your microphone
            in advance using this{" "}
            <a
              href="https://mictests.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              mic test website
            </a>{" "}
            to ensure a smooth experience.
          </p>

          <ul className="list-disc list-inside text-gray-800 text-sm space-y-2">
            <li>
              Switching tabs or exiting fullscreen will result in{" "}
              <b>session termination</b>.
            </li>
            <li>
              Once the interview has started, it <b>cannot be resumed</b>.
            </li>
            <li>
              If you close the session, it will be <b>counted as complete</b>.
            </li>
            <li>
              The interview will run for <b>20 minutes</b> or{" "}
              <b>10 questions</b>.
            </li>
            <li>
              It will <b>automatically end</b> if time is up or all questions
              are completed.
            </li>
            <li>Results will be shown immediately after the session ends.</li>
          </ul>
        </div>

        {/* Agree & Continue */}
        <button
          onClick={onAgree}
          className="mt-6 w-full py-3 rounded-xl font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Agree & Continue
        </button>
      </div>
    </div>,
    document.body
  );
};

export default InterviewRulesModal;
