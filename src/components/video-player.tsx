'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface VideoData {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  descricao_do_video: string;
  text_do_botao: string;
  url_do_botao: string;
  delay: number;
  ativo: boolean;
  cor_de_fundo: string;
  cor_de_fundo_do_botao: string;
  cor_do_text_do_botao: string;
  icone: string;
  cor_do_titulo: string;
  cor_do_subtitulo: string;
  video: {
    id: number
    documentId: string
    name: string
    alternativeText: any
    caption: any
    width: any
    height: any
    formats: any
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: any
    provider: string
    provider_metadata: any
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
}

export default function VideoPlayer({ video }: { video: VideoData }) {
  const [showButton, setShowButton] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    console.log(video)
    const timer = setTimeout(() => {
      setShowButton(true);
    }, video.delay * 1000);

    return () => clearTimeout(timer);
  }, [video.delay]);

  if(!video) return null

  const handleButtonClick = () => {
    window.open(video.url_do_botao, '_blank');
  };

  const handleUnmute = () => {
    const element = videoRef.current;
    if (!element) return;
    element.muted = false;
    setMuted(false);
    element.play().catch(() => {});
  };

  const renderIcon = (iconName?: string | null) => {
    if (!iconName) return null;
    
    const iconComponentName = iconName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const IconComponent = (LucideIcons as any)[iconComponentName];
    
    if (IconComponent) {
      return <IconComponent className="w-6 h-6" />;
    }
    
    return null;
  };

  return (
    <div className={cn("min-h-screen flex flex-col items-center", video.cor_de_fundo || "bg-gray-100")}>
      <div className="w-full text-center py-8 px-4">
        <h1 className={cn("text-4xl md:text-5xl lg:text-6xl font-bold mb-4", video.cor_do_titulo || "text-gray-900")}>
          {video.title}
        </h1>
        <p className={cn("text-lg md:text-xl max-w-3xl mx-auto", video.cor_do_subtitulo || "text-gray-600")}>
          {video.descricao_do_video}
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 mb-8">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
          {(() => {
            const getStrapiMediaUrl = (url?: string) => {
              if (!url) return undefined;
              if (url.startsWith('http')) return url;
              const base = (process.env.NEXT_PUBLIC_STRAPI_URL as string) || (process.env.STRAPI_URL as string) || '';
              return `${base}${url}`;
            };

            const possibleUrl = (video as any)?.video?.url
              || (video as any)?.attributes?.video?.data?.attributes?.url
              || (video as any)?.attributes?.video?.url
              || (video as any)?.video?.data?.attributes?.url;

            const videoUrl = getStrapiMediaUrl(possibleUrl);

            if (videoUrl) {
              return (
                <video
                  className="w-full aspect-video"
                  src={videoUrl}
                  autoPlay
                  muted={muted}
                  playsInline
                  ref={videoRef}
                  onCanPlay={e => {
                    const v = e.currentTarget;
                    if (v.paused) v.play().catch(() => {});
                  }}
                />
              );
            }

            return (
              <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold">Vídeo</p>
                  <p className="text-sm text-gray-300">Clique para reproduzir</p>
                </div>
              </div>
            );
          })()}

          {/* Ícone central para ativar o som */}
          {(() => {
            const possibleUrl = (video as any)?.video?.url
              || (video as any)?.attributes?.video?.data?.attributes?.url
              || (video as any)?.attributes?.video?.url
              || (video as any)?.video?.data?.attributes?.url;
            const hasVideo = Boolean(possibleUrl);
            if (!hasVideo || !muted) return null;
            const Volume2 = (LucideIcons as any).Volume2;
            return (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleUnmute}
                  aria-label="Ativar som"
                  className="pointer-events-auto bg-black/60 hover:bg-black/70 text-white rounded-full p-6 md:p-8 shadow-lg transition-colors"
                >
                  {Volume2 ? (
                    <Volume2 className="w-10 h-10 md:w-14 md:h-14" />
                  ) : (
                    <svg className="w-10 h-10 md:w-14 md:h-14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M3 10v4h4l5 5V5L7 10H3z" />
                    </svg>
                  )}
                </button>
              </div>
            );
          })()}
        </div>
      </div>

      <div className="w-full max-w-md px-4 mb-12">
        {showButton && (
          <Button
            onClick={handleButtonClick}
            className={cn(
              "w-full font-bold text-xl py-8 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3",
              video.cor_de_fundo_do_botao || "bg-blue-500",
              video.cor_do_text_do_botao || "text-white"
            )}
          >
            {video.text_do_botao}
            {renderIcon(video.icone)}
          </Button>
        )}
      </div>
    </div>
  );
}
