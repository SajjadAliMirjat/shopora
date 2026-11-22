import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Shopora` : 'Shopora | Everyday objects, chosen well';
  }, [title]);
}
