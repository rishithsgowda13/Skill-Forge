import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AntiCheatingProps {
  onViolation: (count: number, message: string) => void;
  violations: number;
}

export const useAntiCheating = ({ onViolation, violations }: AntiCheatingProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Tab Switching Detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        onViolation(violations + 1, 'Tab switching detected! System compromise alert.');
      }
    };

    const handleBlur = () => {
      onViolation(violations + 1, 'Window focus lost! Alert triggered.');
    };

    // 2. Context Menu Blocking
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      onViolation(violations + 1, 'Right-click interaction blocked.');
    };

    // 3. Keyboard Shortcut Blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Block Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+Shift+I, Ctrl+S, F12
      if (
        (cmdOrCtrl && ['c', 'v', 'u', 's', 'a'].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        e.key === 'F12'
      ) {
        e.preventDefault();
        onViolation(violations + 1, `Restricted shortcut [${e.key}] detected.`);
      }

      // Block Alt+Tab (can't fully block, but we detect blur)
      if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
      }
    };

    // 4. Clipboard Hijacking Prevention
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation(violations + 1, 'Direct data injection blocked.');
    };

    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      onViolation(violations + 1, 'Data extraction attempt blocked.');
    };

    // 5. Navigation Blocking (Disable Back Button)
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
      onViolation(violations + 1, 'Backward navigation is strictly prohibited.');
    };

    // Attach Event Listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('copy', handleCopy);
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('copy', handleCopy);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onViolation, violations]);

  return null;
};
