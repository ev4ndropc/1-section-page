export interface Document {
  id: number;
  documentId: string;
  name: string;
  alternativeText: any;
  caption: any;
  width: any;
  height: any;
  formats: any;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface VideoData {
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
  pixel_do_facebook?: string;
  logo: Document;
  video: Document;
}
