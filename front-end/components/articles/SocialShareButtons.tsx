'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface SocialShareButtonsProps {
  path: string;
  title?: string;
}

export default function SocialShareButtons({
  path,
  title,
}: SocialShareButtonsProps) {
  // Load Facebook SDK
  useEffect(() => {
    // Add FB root element if it doesn't exist
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.appendChild(fbRoot);
    }
  }, []);

  const sharingTitle = title || "弁護士プラットフォーム";

  const protocol = window.location.protocol;
  const baseUrl = window.location.host;
  const sharingUrl = `${protocol}//${baseUrl}${path}`;

  // Handle Twitter share
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      sharingTitle
    )}&url=${encodeURIComponent(sharingUrl)}`;
    window.open(twitterUrl, "_blank");
  };

  // Handle LinkedIn share
  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      sharingUrl
    )}`;
    window.open(linkedInUrl, "_blank");
  };

  // Handle Facebook share
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      sharingUrl
    )}`;
    window.open(facebookUrl, "_blank");
  };

  return (
    <>
      {/* Load Facebook SDK with Next.js Script component */}
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v22.0"
      ></script>
      <div className="flex space-x-4">
        {/* Twitter Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTwitterShare}
          className="text-gray-400 hover:text-blue-500 p-1 h-auto"
          aria-label="Share on Twitter"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
          </svg>
        </Button>

        {/* LinkedIn Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLinkedInShare}
          className="text-gray-400 hover:text-blue-700 p-1 h-auto"
          aria-label="Share on LinkedIn"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </Button>

        {/* Facebook Share Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFacebookShare}
          className="text-gray-400 hover:text-blue-800 p-1 h-auto"
          aria-label="Share on Facebook"
        >
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
          </svg>
        </Button>
      </div>
    </>
  );
}

// Add TypeScript interface for the Facebook SDK
declare global {
  interface Window {
    FB: {
      XFBML: {
        parse: () => void
      }
    }
  }
}
