'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe } from 'lucide-react';

const EXCLUDE_SELECTORS = [
  'script',
  'style',
  'code',
  'pre',
  '.notranslate',
  '[translate="no"]',
  'input',
  'textarea',
  'select',
  'option',
].join(',');

interface TextNode {
  node: Node;
  originalText: string;
  translatedText?: string;
}

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textNodesRef = useRef<TextNode[]>([]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    if (savedLanguage === 'hi') {
      setTimeout(() => translatePageContent('hi'), 500);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getTextNodes = (element: HTMLElement): TextNode[] => {
    const textNodes: TextNode[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          if (parent.matches(EXCLUDE_SELECTORS)) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim();
          if (!text || text.length === 0) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (text && text.length > 0) {
        textNodes.push({
          node,
          originalText: node.textContent || '',
        });
      }
    }

    return textNodes;
  };

  const translatePageContent = async (targetLanguage: string) => {
    if (targetLanguage === 'en') {
      textNodesRef.current.forEach(({ node, originalText }) => {
        if (node.textContent !== null) {
          node.textContent = originalText;
        }
      });
      setProgress(0);
      return;
    }

    setIsTranslating(true);
    setProgress(0);

    try {
      const body = document.body;
      if (!body) return;

      if (textNodesRef.current.length === 0) {
        textNodesRef.current = getTextNodes(body);
      }

      const totalNodes = textNodesRef.current.length;
      const textsToTranslate = textNodesRef.current.map(({ originalText }) => originalText.trim());

      const batchSize = 20;
      const batches: string[][] = [];

      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        batches.push(textsToTranslate.slice(i, i + batchSize));
      }

      let completedNodes = 0;

      await Promise.all(
        batches.map(async (batch, batchIndex) => {
          const startIndex = batchIndex * batchSize;

          const response = await fetch('/api/translate/batch', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              texts: batch,
              source: 'en',
              target: 'hi',
            }),
          });

          if (!response.ok) {
            console.error('Translation batch failed');
            return;
          }

          const data = await response.json();
          const translations = data.translatedTexts;

          translations.forEach((translatedText: string, index: number) => {
            const nodeIndex = startIndex + index;
            if (textNodesRef.current[nodeIndex]) {
              const { node, originalText } = textNodesRef.current[nodeIndex];
              textNodesRef.current[nodeIndex].translatedText = translatedText;

              if (node.textContent !== null) {
                const leadingSpace = originalText.match(/^\s*/)?.[0] || '';
                const trailingSpace = originalText.match(/\s*$/)?.[0] || '';
                node.textContent = leadingSpace + translatedText + trailingSpace;
              }

              completedNodes++;
              setProgress(Math.round((completedNodes / totalNodes) * 100));
            }
          });
        })
      );

      setProgress(100);
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setTimeout(() => {
        setIsTranslating(false);
        setProgress(0);
      }, 300);
    }
  };

  const changeLanguage = async (lang: string) => {
    if (lang === currentLanguage) {
      setIsOpen(false);
      return;
    }

    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setIsOpen(false);

    await translatePageContent(lang);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        aria-label="Select Language"
        disabled={isTranslating}
      >
        <Globe className="w-4 h-4 text-black" />
        <span className="text-sm font-medium text-black">
          {currentLanguage === 'hi' ? 'हिन्दी' : 'English'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={() => changeLanguage('en')}
              disabled={isTranslating}
              className={`w-full text-left px-4 py-2 text-sm text-black hover:bg-slate-50 transition-colors disabled:opacity-50 ${
                currentLanguage === 'en' ? 'bg-slate-100 font-medium' : ''
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('hi')}
              disabled={isTranslating}
              className={`w-full text-left px-4 py-2 text-sm text-black hover:bg-slate-50 transition-colors disabled:opacity-50 ${
                currentLanguage === 'hi' ? 'bg-slate-100 font-medium' : ''
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>
          {isTranslating && (
            <div className="px-4 py-2 border-t">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Translating...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
