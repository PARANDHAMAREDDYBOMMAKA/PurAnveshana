"use client";

import { useEffect } from 'react';

export default function TranslateErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const originalRemoveChild = Node.prototype.removeChild;
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.removeChild = function<T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        console.warn('Google Translate DOM conflict suppressed (removeChild)');
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    Node.prototype.insertBefore = function<T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        console.warn('Google Translate DOM conflict suppressed (insertBefore)');
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };

    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  return <>{children}</>;
}
