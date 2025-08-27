import VideoPlayer from "@/components/video-player";
import { getVideo } from "@/lib/strapi";
import { cn } from "@/lib/utils";
import { notFound } from "next/navigation";
import Script from "next/script";

type Params = Promise<{ slug: string }>;

export default async function VideoPage({ params }: { params: Params }) {
  const { slug } = await params;

  const video = await getVideo(slug);
  if (!video) {
    notFound();
  }

  if (video.data.length === 0) {
    notFound();
  }

  return (
    <>
      <Script id="fb-pixel" strategy="afterInteractive">
        {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${video.data[0].pixel_do_facebook}');
              fbq('track', 'PageView');
            `}
      </Script>
      <div className={cn(
        "min-h-screen flex flex-col items-center justify-center",
        video.data[0].cor_de_fundo || "bg-gray-100"
      )}>
        <VideoPlayer video={video.data[0]} />
        <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt={"facebook pixel no script image"}
              src="https://www.facebook.com/tr?id=1002246091049642&ev=PageView&noscript=1"
            />
          </noscript>
      </div>
    </>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;

  const video = await getVideo(slug);

  if (!video) {
    notFound();
  }

  if (video.data.length === 0) {
    notFound();
  }

  return {
    title: video.data[0]?.title || "Vídeo não encontrado",
    description:
      video.data[0]?.descricao_do_video ||
      "O vídeo solicitado não foi encontrado.",
  };
}
