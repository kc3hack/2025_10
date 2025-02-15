'use client';
import { useEffect } from 'react';

const TypekitLoader: React.FC = () => {
  useEffect(() => {
    (function (d: Document) {
      const config = {
        kitId: `${process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID}`,
        scriptTimeout: 3000,
        async: true,
      };
      const h = d.documentElement;
      const t = setTimeout(() => {
        h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive';
      }, config.scriptTimeout);
      const tk = d.createElement('script');

      h.className += 'wf-loading';
      tk.src = `https://use.typekit.net/${config.kitId}.js`;
      tk.async = true;
      tk.onload = function () {
        clearTimeout(t);
        try {
          (window as any).Typekit.load(config);
        } catch (e) {
          console.error(e);
        }
      };
      tk.onerror = function () {
        clearTimeout(t);
      };

      const s = d.getElementsByTagName('script')[0];
      s.parentNode!.insertBefore(tk, s);
    })(document);
  }, []);

  return null;
};

export default TypekitLoader;
