'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { InputSection } from '@/components/InputSection';
import { MessageContent } from '@/components/MessageContent';
import { WelcomeMessage } from '@/components/WelcomeMessage';
import { LanguageProvider, useLanguage } from './LanguageSwitcher';
import { Header } from '@/components/Header';
import { Message, Step } from '@/types';
import {
  generateClarifyingQuestionsPrompt,
  generateResearchLearning,
  generateResearchPrompt,
  generateResearchResults,
} from '@/lib/prompt';

interface SearchResult {
  title: string;
  url: string;
  content: string;
}

interface ResearchQuery {
  researchGoal: string;
  query: string;
}

interface ResearchResponse {
  queries: ResearchQuery[];
}

const NEXT_PUBLIC_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_BASE_URL!
    : '/v1/chat/completions';

const NEXT_PUBLIC_SEARCH_URL =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_SEARCH_URL!
    : '/search';

const BaseContent = () => {
  const [userInput, setUserInput] = useState('');
  const [showKeywords, setShowKeywords] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);
  const [isSiteEnv, setIsSiteEnv] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [step, setStep] = useState<Step>('query');
  const refStep = useRef<Step>('query');
  const refMessages = useRef<Message[]>([]);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUserScrollTimestampRef = useRef<number>(0);

  const updateStep = (newStep: Step) => {
    setStep(newStep);
    refStep.current = newStep;
  };

  useEffect(() => {
    setIsSiteEnv(window.location.href.includes('.site'));
    setIsClient(true);
    (window as any).refMessages = refMessages;

    const setupScrollListener = () => {
      const messageElement = messageRef.current;
      if (!messageElement) {
        // If element isn't available yet, try again shortly
        console.log('Message element not available yet, retrying...');
        setTimeout(setupScrollListener, 100);
        return;
      }

      console.log('Adding scroll event listener to message container');

      // Add explicit logging to check if scroll events are firing
      const handleUserScroll = () => {
        console.log('Scroll event detected');

        // Store the timestamp of when user manually scrolled
        lastUserScrollTimestampRef.current = Date.now();

        // Check if user has scrolled up (not at bottom)
        const isAtBottom =
          messageElement.scrollHeight - messageElement.scrollTop <=
          messageElement.clientHeight + 150;

        console.log(
          `Is at bottom: ${isAtBottom}, Auto scrolling: ${isAutoScrolling}`
        );

        if (!isAtBottom && isAutoScrolling) {
          // User scrolled up, disable auto-scrolling
          console.log('User scrolled away from bottom, disabling auto-scroll');
          setIsAutoScrolling(false);
          setShowScrollButton(true);

          // Clear existing interval
          if (autoScrollIntervalRef.current) {
            clearInterval(autoScrollIntervalRef.current);
            autoScrollIntervalRef.current = null;
          }
        }
      };

      messageElement.addEventListener('scroll', handleUserScroll, {
        passive: false,
      });

      // Test if the element is actually scrollable
      console.log(
        `Element scroll properties - Height: ${messageElement.scrollHeight}, Client Height: ${messageElement.clientHeight}`
      );

      return () => {
        messageElement.removeEventListener('scroll', handleUserScroll);
      };
    };

    setupScrollListener();
    // Start auto-scrolling
    setupAutoScroll();

    return () => {
      // Clear interval on unmount
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, []);

  // Setup auto-scroll functionality
  const setupAutoScroll = useCallback(() => {
    // Clear any existing interval
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    // Only set up auto-scroll if it's enabled
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        const messageElement = messageRef.current;
        if (!messageElement) return;

        // Don't auto-scroll if user manually scrolled within the last 500ms
        if (Date.now() - lastUserScrollTimestampRef.current < 500) return;

        messageElement.scrollTo({
          top: messageElement.scrollHeight,
          behavior: 'smooth',
        });
      }, 1000);
    }
  }, [isAutoScrolling]);

  // Function to resume auto-scrolling
  const resumeAutoScroll = () => {
    setIsAutoScrolling(true);
    setupAutoScroll();
    setShowScrollButton(false);

    // Immediately scroll to bottom
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  // Update auto-scroll when isAutoScrolling changes
  useEffect(() => {
    setupAutoScroll();
  }, [isAutoScrolling, setupAutoScroll]);

  // Also scroll when messages change, but only if auto-scrolling is enabled
  useEffect(() => {
    if (isAutoScrolling && messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: 'smooth',
      });
    } else if (!isAutoScrolling && messages.length > 0) {
      // If not auto-scrolling but content is being added, show the button
      setShowScrollButton(true);
    }
  }, [messages, isAutoScrolling]);

  const openUrl = (siteEnvUrl: string, defaultUrl: string) => {
    const url = isSiteEnv ? siteEnvUrl : defaultUrl;
    window.open(url, '_blank');
  };

  const onEdgeOneAIBtnClick = () => {
    openUrl(
      'https://edgeone.cloud.tencent.com/pages/document/169925463311781888',
      'http://edgeone.ai/document/169927753925951488'
    );
  };

  const onGithubBtnClick = () => {
    openUrl(
      'https://github.com/TencentEdgeOne/pages-templates/blob/main/examples/free-deep-research/README_zh-CN.md',
      'https://github.com/TencentEdgeOne/pages-templates/tree/main/examples/free-deep-research'
    );
  };

  const onDeployBtnClick = () => {
    openUrl(
      'https://console.cloud.tencent.com/edgeone/pages/new?from=github&template=free-deep-research',
      'https://edgeone.ai/pages/templates/free-deep-research'
    );
  };

  const processStreamResponse = async (
    response: Response,
    updateMessage: (content: Message) => void
  ) => {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      return updateMessage({
        content:
          errorData?.error || 'Sorry, something went wrong. Please try again.',
      });
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    let accumulatedContent = '';
    let accumulatedThink = '';
    let thinking = false;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || line.includes('[DONE]') || !line.includes('data: '))
          continue;
        try {
          const json = JSON.parse(line.replace(/^data: /, ''));
          const token = json.choices[0]?.delta?.content || '';
          const reasoningToken =
            json.choices[0]?.delta?.reasoning_content || '';

          // Handle think content
          if (
            token.includes('<think>') ||
            token.includes('\u003cthink\u003e')
          ) {
            thinking = true;
            continue;
          }
          if (
            token.includes('</think>') ||
            token.includes('\u003c/think\u003e')
          ) {
            thinking = false;
            continue;
          }

          if (thinking || reasoningToken) {
            accumulatedThink += token || reasoningToken || '';
          } else {
            accumulatedContent += token || '';
          }

          updateMessage({
            content: accumulatedContent,
            think: accumulatedThink,
          });
        } catch (e) {
          console.error('Failed to parse chunk:', e);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    setShowKeywords(false);
    setIsLoading(true);
    const currentInput = textareaRef.current?.value || '';
    setUserInput('');

    if (refStep.current === 'query') {
      const _messages: Message[] = [
        { step: 'query', role: 'user', content: currentInput },
        { step: 'clarify', role: 'assistant', content: '' },
      ];
      refMessages.current = _messages;
      setMessages(() => _messages);
    }

    if (refStep.current === 'clarify') {
      const _messages: Message[] = [
        ...messages,
        { step: 'clarify', role: 'user', content: currentInput },
        { step: 'clarify', role: 'assistant', content: '' },
      ];
      refMessages.current = _messages;
      setMessages(() => _messages);
    }

    try {
      await processStep(currentInput);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);

      if (refStep.current === 'research') {
        handleResearch();
      }
    }
  };

  const parseStringToJson = (str: string) => {
    const jsonString = str.match(
      /\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\}/
    )?.[0];
    return jsonString ? JSON.parse(jsonString) : null;
  };

  const handleResearch = async (): Promise<void> => {
    try {
      // Extract JSON from the latest message
      const latestMessage = refMessages.current[refMessages.current.length - 1];
      const content = latestMessage.content;

      const json = parseStringToJson(content);

      if (!json) {
        console.error('No JSON string found in content');
        return;
      }

      // Parse research queries
      const { queries } = json as ResearchResponse;

      // Create new messages for each query
      const queriesMessages: Message[] = queries.map(
        (query: ResearchQuery) =>
          ({
            step: 'research',
            role: 'assistant',
            goal: query.researchGoal,
            query: query.query,
          } as Message)
      );

      // Update state and ref by replacing the last message with query messages
      setMessages((prev) => [...prev.slice(0, -1), ...queriesMessages]);
      refMessages.current = [
        ...refMessages.current.slice(0, -1),
        ...queriesMessages,
      ];

      // Process each query in parallel
      await Promise.all(
        queries.map((query, index) =>
          processSearchQuery(query.query, index, queriesMessages.length)
        )
      );
    } catch (error) {
      console.error('Error in research process:', error);
    } finally {
      handleLeaning();
    }
  };

  const handleStreamResponse = (_content: Message) => {
    setMessages((prev) => {
      const newMessages = structuredClone(prev);
      const lastMessage = newMessages[newMessages.length - 1];

      if (_content.think) {
        lastMessage.think = _content.think;
      }
      if (_content.content) {
        lastMessage.content = _content.content;
      }

      return newMessages;
    });
    refMessages.current[refMessages.current.length - 1].content =
      _content.content;
  };

  const handleLeaning = async () => {
    try {
      const messages = refMessages.current;
      const learningMessages = messages.filter(
        (message) => message.step === 'research' && message.source
      );
      const learningContent: string[] = [];
      learningMessages.forEach((message) => {
        message.source?.forEach((source) => {
          learningContent.push(`
<title>${source.title}</title>
content: ${source.content}
`);
        });
      });
      const learning = generateResearchLearning(
        messages[0].content,
        learningContent
      );

      const _messages: Message[] = [
        ...refMessages.current,
        { step: 'learning', role: 'assistant', content: '' },
      ];
      refMessages.current = _messages;
      setMessages(() => _messages);

      const res = await fetchAIResponse(learning);

      await processStreamResponse(res, handleStreamResponse);
    } catch (error) {
      console.error('Error in handleLeaning:', error);
    } finally {
      handleOutput();
    }
  };

  const handleOutput = async () => {
    try {
      const messages = refMessages.current;
      const output = messages
        .filter((message) => message.step === 'learning')
        .map((message) => message.content)
        .join('');
      const json = parseStringToJson(output);
      const learningMessages = json?.learnings || [];
      if (!learningMessages.length) {
        console.error('No learning messages found');
        return;
      }

      const _messages: Message[] = [
        ...refMessages.current,
        { step: 'results', role: 'assistant', content: '' },
      ];
      refMessages.current = _messages;
      setMessages(() => _messages);

      const [userQuery, aiClarifyingQuestions, userClarificationResponses] =
        refMessages.current;
      const researchResultsMessages = generateResearchResults(
        userQuery.content,
        aiClarifyingQuestions.content + userClarificationResponses.content,
        learningMessages
      );
      const res = await fetchAIResponse(researchResultsMessages);
      await processStreamResponse(res, handleStreamResponse);
    } catch (error) {
      console.error('Error in handleOutput:', error);
    } finally {
    }
  };

  // Helper function to process individual search queries
  const processSearchQuery = async (
    searchQuery: string,
    index: number,
    totalQueries: number
  ): Promise<void> => {
    if (!searchQuery) {
      console.warn(`Empty search query at index ${index}`);
      return;
    }

    try {
      // Perform search request
      const searchRes = await fetch(
        `${NEXT_PUBLIC_SEARCH_URL}?q=` + encodeURIComponent(searchQuery)
      );

      if (!searchRes.ok) {
        throw new Error(
          `Search request failed with status: ${searchRes.status}`
        );
      }

      const searchResJson = await searchRes.json();
      const searchResults: SearchResult[] =
        searchResJson.results?.map((result: any) => ({
          title: result.title || 'No Title',
          url: result.url || '',
          content: result.content || 'No content available',
        })) || [];

      // Update both state and ref in a single function
      updateMessageWithSearchResults(index, totalQueries, searchResults);
    } catch (error) {
      console.error(`Error searching for query ${index}:`, error);
      updateMessageWithError(index, totalQueries, error);
    }
  };

  // Helper to update message with search results
  const updateMessageWithSearchResults = (
    index: number,
    totalQueries: number,
    searchResults: SearchResult[]
  ): void => {
    // Update state
    setMessages((prev) => {
      const newMessages = structuredClone(prev);
      const targetIndex = newMessages.length - totalQueries + index;

      if (targetIndex >= 0 && targetIndex < newMessages.length) {
        newMessages[targetIndex].source = searchResults;
      }

      return newMessages;
    });

    // Update ref
    const targetIndex = refMessages.current.length - totalQueries + index;
    if (targetIndex >= 0 && targetIndex < refMessages.current.length) {
      refMessages.current[targetIndex].source = searchResults;
    }
  };

  // Helper to update message with error
  const updateMessageWithError = (
    index: number,
    totalQueries: number,
    error: unknown
  ): void => {
    setMessages((prev) => {
      const newMessages = structuredClone(prev);
      const targetIndex = newMessages.length - totalQueries + index;

      if (targetIndex >= 0 && targetIndex < newMessages.length) {
        newMessages[targetIndex].content = `Error retrieving search results: ${
          error instanceof Error ? error.message : error
        }`;
      }

      return newMessages;
    });
  };

  const fetchAIResponse = async (messages: Message[]) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const body: {
      stream: boolean;
      messages: Message[];
      model?: string;
    } = {
      stream: true,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    };

    const res = await fetch(NEXT_PUBLIC_BASE_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res;
  };

  // Process the current step of the research process
  const processStep = async (userInput: string) => {
    let conversationHistory: Message[];

    // Generate appropriate prompt based on current step
    switch (step) {
      case 'query':
        conversationHistory = generateClarifyingQuestionsPrompt(userInput);
        // Move to clarify step after initial query
        updateStep('clarify');
        break;
      case 'clarify':
        const [userQuery, aiClarifyingQuestions, userClarificationResponses] =
          refMessages.current;

        conversationHistory = generateResearchPrompt(
          userQuery.content,
          aiClarifyingQuestions.content,
          userClarificationResponses.content
        );
        updateStep('research');
        break;
      default:
        console.error('Invalid step');
        return;
    }

    const res = await fetchAIResponse(conversationHistory);

    await processStreamResponse(res, handleStreamResponse);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    isClient && (
      <div className="flex flex-col h-screen bg-white">
        {/* Header */}
        <Header
          onDeployBtnClick={onDeployBtnClick}
          onGithubBtnClick={onGithubBtnClick}
        />

        <WelcomeMessage
          show={showKeywords}
          onEdgeOneAIBtnClick={onEdgeOneAIBtnClick}
        />

        {/* Messages section */}
        <div
          ref={messageRef}
          className="flex-1 px-4 py-4 overflow-y-auto md:px-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <MessageContent
                key={index}
                message={message}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>

        {showScrollButton && (
          <button
            onClick={resumeAutoScroll}
            className="fixed p-3 text-white transition-all bg-gray-800 rounded-full shadow-lg bottom-24 right-6 hover:bg-gray-700"
            aria-label="Scroll to bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
                transform="rotate(180, 8, 8)"
              />
            </svg>
          </button>
        )}

        {/* Input section */}
        {['query', 'clarify'].includes(step) && (
          <InputSection
            step={step}
            userInput={userInput}
            isLoading={isLoading}
            textareaRef={textareaRef}
            handleTextareaChange={handleTextareaChange}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
    )
  );
};

export const Base = () => {
  return (
    <LanguageProvider>
      <BaseContent />
    </LanguageProvider>
  );
};
