/* eslint-disable react/no-unescaped-entities */
'use client';

import { useEffect, useState } from 'react';
import CodeBoxes from './CodeBoxes';

declare global {
  interface Window {
    ai: any;
  }
}

const checkAI = async () => {
  if ('ai' in window) {
    if (((await window.ai.languageModel.capabilities()).available) === 'readily') {
      return true;
    }
  }
  return false;
};

export default function CompatibilityWrapper() {
  const [isAI, setIsAI] = useState<null | boolean>(null);

  const updateIsAI = async () => {
    const checkAIStatus = await checkAI();

    setIsAI(checkAIStatus);
  };

  useEffect(() => {
    updateIsAI();
  }, []);

  return (
    <>
      <div>
        {isAI === null && <p>Checking your browser...</p>}
        {isAI !== null &&
          (isAI ? (
            <CodeBoxes />
          ) : (
            <div className="space-y-4">
              <p className="text-lg font-semibold">
                Built-in AI is not working. Please follow the handy steps below.
              </p>
              <ol className="space-y-2 list-decimal list-inside">
                <li className="text-base">
                  Install Chrome: Open{' '}
                  <span className="px-1 font-mono bg-gray-100 rounded">
                    chrome://settings/help
                  </span>{' '}
                  to ensure the version is above 129.
                </li>
                <li className="text-base">
                  Enable Prompt API: Open
                  <span className="px-1 font-mono bg-gray-100 rounded">
                    chrome://flags/#prompt-api-for-gemini-nano
                  </span>
                  , set it to "Enabled".
                </li>
                <li className="text-base">
                  Enable Optimization Guide: Open
                  <span className="px-1 font-mono bg-gray-100 rounded">
                    chrome://flags/#optimization-guide-on-device-model
                  </span>
                  , set it to "Enabled BypassPerfRequirement". Restart the
                  browser.
                </li>
                <li className="text-base">
                  Download Model: Go to{' '}
                  <span className="px-1 font-mono bg-gray-100 rounded">
                    chrome://components/
                  </span>
                  , find "Optimization Guide On Device Model", ensure it's fully
                  downloaded. If the version is "0.0.0.0", click "Check for
                  update".
                </li>
                <li className="text-base">
                  Troubleshoot: If the "Optimization Guide On Device Model" is
                  not displayed, disable the settings in steps 2 and 3, restart
                  your browser and re-enable it.
                </li>
              </ol>
            </div>
          ))}
      </div>
    </>
  );
}
