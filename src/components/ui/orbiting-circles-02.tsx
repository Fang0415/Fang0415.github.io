'use client';

import type { CSSProperties } from 'react';
import ParticleSphereAnimation from './orbiting-circles-02-utils/particalsphear';

const AI_ICON_CDN = 'https://cdn.jsdelivr.net/npm/@lobehub/icons-static-svg@1.94.0/icons';
const DEVICON_CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.17.0/icons';

type OrbitIcon = {
  src: string;
  alt: string;
  angle: number;
};

type OrbitDefinition = {
  name: string;
  duration: number;
  direction: 'cw' | 'ccw';
  icons: OrbitIcon[];
};

const orbits: OrbitDefinition[] = [
  {
    name: 'inner',
    duration: 18,
    direction: 'cw',
    icons: [
      { src: `${AI_ICON_CDN}/gemini-color.svg`, alt: 'Gemini', angle: -60 },
      { src: `${AI_ICON_CDN}/deepseek-color.svg`, alt: 'DeepSeek', angle: 0 },
      { src: `${AI_ICON_CDN}/kimi-color.svg`, alt: 'Kimi', angle: 60 },
    ],
  },
  {
    name: 'middle',
    duration: 24,
    direction: 'ccw',
    icons: [
      { src: `${AI_ICON_CDN}/codex-color.svg`, alt: 'Codex', angle: -60 },
      { src: `${AI_ICON_CDN}/claude-color.svg`, alt: 'Claude', angle: 0 },
      { src: `${DEVICON_CDN}/docker/docker-original.svg`, alt: 'Docker', angle: 60 },
    ],
  },
  {
    name: 'outer',
    duration: 30,
    direction: 'cw',
    icons: [
      { src: `${DEVICON_CDN}/java/java-original.svg`, alt: 'Java', angle: -60 },
      { src: `${DEVICON_CDN}/python/python-original.svg`, alt: 'Python', angle: 0 },
      { src: `${DEVICON_CDN}/redis/redis-original.svg`, alt: 'Redis', angle: 60 },
    ],
  },
];

type OrbitStyle = CSSProperties & {
  '--orbit-duration': string;
  '--start-angle': string;
  '--counter-angle': string;
};

export default function OrbitingCirclesGlobe() {
  return (
    <div className="orbit-globe" aria-label="围绕粒子球旋转的 AI 与后端技术图标">
      <div className="orbit-globe__sphere">
        <ParticleSphereAnimation />
      </div>

      {orbits.map((orbit) => {
        const icons = [
          ...orbit.icons,
          ...orbit.icons.map((icon) => ({
            ...icon,
            angle: icon.angle + 180,
            alt: `${icon.alt} mirror`,
          })),
        ];

        return (
          <div
            key={orbit.name}
            className={`orbit-globe__ring orbit-globe__ring--${orbit.name}`}
            aria-hidden="true"
          >
            {icons.map((icon, index) => (
              <div
                key={`${icon.alt}-${index}`}
                className={`orbit-globe__anchor orbit-globe__anchor--${orbit.direction}`}
                style={{
                  '--orbit-duration': `${orbit.duration}s`,
                  '--start-angle': `${icon.angle}deg`,
                  '--counter-angle': `${-icon.angle}deg`,
                } as OrbitStyle}
              >
                <div className={`orbit-globe__icon orbit-globe__icon--${orbit.direction}`}>
                  <img src={icon.src} alt="" width={32} height={32} loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
