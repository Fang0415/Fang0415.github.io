import { ImageResponse } from 'next/og';
import { PROFILE } from '../lib/site';

// Generated instead of shipped as a binary so the favicon always matches the
// wordmark in the nav — change PROFILE.mark and both follow.
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#221d13',
          color: '#f6b417',
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        {PROFILE.mark}
      </div>
    ),
    size,
  );
}
