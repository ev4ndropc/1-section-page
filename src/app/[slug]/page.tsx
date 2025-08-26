import VideoPlayer from '@/components/video-player';
import { getVideo } from '@/lib/strapi';
import { notFound } from 'next/navigation';

type Params = Promise<{ slug: string }>

export default async function VideoPage({ params }: { params: Params }) {
  const { slug } = await params

  const video = await getVideo(slug)
  if(video.data.length === 0) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-white">
      <VideoPlayer video={video.data[0]} />
    </main>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  
  const video = null

  if (!video) {
    return {
      title: 'Vídeo não encontrado',
      description: 'O vídeo solicitado não foi encontrado.',
    };
  }
}