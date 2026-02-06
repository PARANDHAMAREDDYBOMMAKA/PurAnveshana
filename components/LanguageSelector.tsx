'use client';

import { useState, useEffect, useRef } from 'react';
import { Globe, Check } from 'lucide-react';

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

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'EN' },
  { code: 'hi', label: 'हिन्दी', native: 'HI' },
  { code: 'te', label: 'తెలుగు', native: 'TE' },
  { code: 'or', label: 'ଓଡ଼ିଆ', native: 'OR' },
];

export default function LanguageSelector() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isOpen, setIsOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const textNodesRef = useRef<TextNode[]>([]);
  const processedNodesRef = useRef<WeakSet<Node>>(new WeakSet());
  const pendingNodesRef = useRef<TextNode[]>([]);
  const translateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);

    if (savedLanguage !== 'en') {
      setTimeout(() => translatePageContent(savedLanguage), 500);
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

  const isTranslatableNode = (node: Node) => {
    const parent = node.parentElement;
    if (!parent) return false;
    if (parent.closest(EXCLUDE_SELECTORS)) return false;
    const text = node.textContent?.trim();
    return !!text && text.length > 0;
  };

  const getTextNodes = (element: HTMLElement, onlyNew = false): TextNode[] => {
    const textNodes: TextNode[] = [];
    const walker = document.createTreeWalker(
      element,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          if (!isTranslatableNode(node)) return NodeFilter.FILTER_REJECT;
          if (onlyNew && processedNodesRef.current.has(node)) {
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

  const translateNodes = async (nodes: TextNode[], targetLanguage: string) => {
    if (targetLanguage === 'en' || nodes.length === 0) return;

    const textsToTranslate = nodes.map(({ originalText }) => originalText.trim());
    const batchSize = 20;
    const batches: string[][] = [];

    for (let i = 0; i < textsToTranslate.length; i += batchSize) {
      batches.push(textsToTranslate.slice(i, i + batchSize));
    }

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
            target: targetLanguage,
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
          if (nodes[nodeIndex]) {
            const { node, originalText } = nodes[nodeIndex];
            nodes[nodeIndex].translatedText = translatedText;

            if (node.textContent !== null) {
              const leadingSpace = originalText.match(/^\s*/)?.[0] || '';
              const trailingSpace = originalText.match(/\s*$/)?.[0] || '';
              node.textContent = leadingSpace + translatedText + trailingSpace;
            }
          }
        });
      })
    );
  };

  const queueTranslation = (nodes: TextNode[]) => {
    if (nodes.length === 0) return;
    pendingNodesRef.current.push(...nodes);

    if (translateTimerRef.current !== null) {
      window.clearTimeout(translateTimerRef.current);
    }

    translateTimerRef.current = window.setTimeout(async () => {
      const pending = pendingNodesRef.current.splice(0);
      if (pending.length === 0) return;

      setIsTranslating(true);
      try {
        await translateNodes(pending, currentLanguage);
      } catch (error) {
        console.error('Translation failed:', error);
      } finally {
        setTimeout(() => {
          setIsTranslating(false);
        }, 200);
      }
    }, 250);
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
        processedNodesRef.current = new WeakSet();
        const initialNodes = getTextNodes(body);
        initialNodes.forEach(({ node }) => processedNodesRef.current.add(node));
        textNodesRef.current = initialNodes;
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
              target: targetLanguage,
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

    // Restore original text first if switching from a non-English language
    if (currentLanguage !== 'en') {
      textNodesRef.current.forEach(({ node, originalText }) => {
        if (node.textContent !== null) node.textContent = originalText;
      });
      textNodesRef.current = [];
      processedNodesRef.current = new WeakSet();
      pendingNodesRef.current = [];
    }

    setCurrentLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setIsOpen(false);

    await translatePageContent(lang);
  };

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage);

  useEffect(() => {
    if (currentLanguage === 'en') return;

    const body = document.body;
    if (!body) return;

    const observer = new MutationObserver((mutations) => {
      if (currentLanguage === 'en') return;

      const newNodes: TextNode[] = [];

      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (isTranslatableNode(node) && !processedNodesRef.current.has(node)) {
              processedNodesRef.current.add(node);
              const originalText = node.textContent || '';
              const entry = { node, originalText } as TextNode;
              textNodesRef.current.push(entry);
              newNodes.push(entry);
            }
            return;
          }

          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            const collected = getTextNodes(element, true);
            if (collected.length > 0) {
              collected.forEach(({ node: collectedNode }) => {
                processedNodesRef.current.add(collectedNode);
              });
              textNodesRef.current.push(...collected);
              newNodes.push(...collected);
            }
          }
        });
      }

      if (newNodes.length > 0) {
        queueTranslation(newNodes);
      }
    });

    observer.observe(body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (translateTimerRef.current !== null) {
        window.clearTimeout(translateTimerRef.current);
        translateTimerRef.current = null;
      }
    };
  }, [currentLanguage]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all duration-200 ${
          isOpen
            ? 'bg-amber-100/60 text-amber-900'
            : 'text-amber-800/60 hover:bg-amber-100/40 hover:text-amber-900'
        } ${isTranslating ? 'opacity-70' : ''}`}
        aria-label="Select Language"
        disabled={isTranslating}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium notranslate" translate="no">
          {currentLang?.native || 'EN'}
        </span>
        {isTranslating && (
          <div className="w-3 h-3 border-2 border-amber-700/30 border-t-amber-700 rounded-full animate-spin" />
        )}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-52 rounded-xl z-50 border border-amber-200/60 overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #fffbf5 0%, #fff8ed 50%, #fef5e7 100%)', boxShadow: '0 8px 32px rgba(139, 90, 43, 0.15)' }}
        >
          {/* Header */}
          <div className="px-3.5 py-2.5 border-b border-amber-200/40">
            <p className="text-[11px] font-semibold text-amber-700/50 uppercase tracking-wider notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>
              Language
            </p>
          </div>

          {/* Language Options */}
          <div className="py-1 px-1.5">
            {LANGUAGES.map(({ code, label, native }) => (
              <button
                key={code}
                onClick={() => changeLanguage(code)}
                disabled={isTranslating}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all disabled:opacity-50 ${
                  currentLanguage === code
                    ? 'text-amber-900 font-semibold'
                    : 'text-amber-800/70 hover:bg-amber-100/40 hover:text-amber-900'
                }`}
                style={currentLanguage === code ? { background: 'linear-gradient(145deg, rgba(217, 119, 6, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)' } : undefined}
              >
                <span className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold bg-amber-100/60 text-amber-800/70 notranslate" translate="no">
                  {native}
                </span>
                <span className="flex-1 text-left notranslate" translate="no" style={{ fontFamily: 'Georgia, serif' }}>{label}</span>
                {currentLanguage === code && (
                  <Check className="w-4 h-4 text-amber-700" />
                )}
              </button>
            ))}
          </div>

          {/* Translation Progress */}
          {isTranslating && (
            <div className="px-3.5 py-2.5 border-t border-amber-200/40">
              <div className="flex items-center justify-between text-[11px] text-amber-800/60 mb-1.5">
                <span className="font-medium" style={{ fontFamily: 'Georgia, serif' }}>Translating...</span>
                <span className="font-semibold text-amber-900">{progress}%</span>
              </div>
              <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300 bg-linear-to-r from-amber-600 to-amber-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
