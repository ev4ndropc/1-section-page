import { VideoData } from "@/types/video"

export const getVideos = async () => {
    try {
        const response = await fetch(`${process.env.STRAPI_URL}/api/videos-landingpages`, {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error)
        return null
    }
}


export const getVideo = async (slug: string): Promise<{data: VideoData[]} | null> => {
    try {
        const response = await fetch(`${process.env.STRAPI_URL}/api/videos-landingpages?filters[slug][$eq]=${slug}&populate=*`, {
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
            }
        })
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Erro ao buscar vídeo:', error)
        return null
    }
}