"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { setStoryReplyDraft } from "@/lib/story-reply-drafts";

type SpeechRecognitionConstructor = new () => SpeechRecognition;

function storyKey(briefingId: string, storyId: string) {
  return `${briefingId}:${storyId}`;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const windowWithSpeech = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return (
    windowWithSpeech.SpeechRecognition ??
    windowWithSpeech.webkitSpeechRecognition ??
    null
  );
}

export function useStoryDictation() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [activeStoryKey, setActiveStoryKey] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef("");
  const pendingTargetRef = useRef<{ briefingId: string; storyId: string } | null>(
    null,
  );

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const toggleDictation = useCallback(
    (briefingId: string, storyId: string) => {
      const key = storyKey(briefingId, storyId);

      if (isListening && activeStoryKey === key) {
        recognitionRef.current?.stop();
        return;
      }

      if (isListening) {
        recognitionRef.current?.abort();
      }

      const SpeechRecognitionAPI = getSpeechRecognitionConstructor();

      if (!SpeechRecognitionAPI) {
        window.alert(
          "Dictation is not supported in this browser. Try Chrome, Edge, or Safari.",
        );
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      transcriptRef.current = "";
      pendingTargetRef.current = { briefingId, storyId };

      recognition.onresult = (event) => {
        let text = "";

        for (let index = 0; index < event.results.length; index += 1) {
          text += event.results[index][0]?.transcript ?? "";
        }

        transcriptRef.current = text.trim();
      };

      recognition.onend = () => {
        setIsListening(false);
        setActiveStoryKey(null);
        recognitionRef.current = null;

        const target = pendingTargetRef.current;
        pendingTargetRef.current = null;

        if (!target) {
          return;
        }

        const draft = transcriptRef.current.trim();
        transcriptRef.current = "";

        if (draft) {
          setStoryReplyDraft(target.briefingId, target.storyId, draft);
        }

        router.push(
          `/briefings/${target.briefingId}/stories/${target.storyId}`,
        );
      };

      recognition.onerror = (event) => {
        if (event.error === "aborted" || event.error === "no-speech") {
          return;
        }

        setIsListening(false);
        setActiveStoryKey(null);
        pendingTargetRef.current = null;
        recognitionRef.current = null;
        window.alert(`Dictation unavailable: ${event.error}`);
      };

      recognitionRef.current = recognition;
      setActiveStoryKey(key);
      setIsListening(true);
      recognition.start();
    },
    [activeStoryKey, isListening, router],
  );

  return {
    isListening,
    activeStoryKey,
    toggleDictation,
  };
}
