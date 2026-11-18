import { defineCollection, z } from 'astro:content';

// 1. Notícias e Artigos
const noticias = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.string().default('Comunicação IEADPG'),
    coverImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
  }),
});

// 2. Agenda de Eventos
const eventos = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string().default('Rua Paulina Oliveira Gomes, 1071 — Jardim Amália, Ponta Grossa/PR'),
    bannerImage: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    status: z.enum(['confirmado', 'adiado', 'encerrado']).default('confirmado'),
  }),
});

// 3. Ministérios e Departamentos
const ministerios = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slugName: z.string(),
    description: z.string(),
    leader: z.string(),
    meetingSchedule: z.string(),
    icon: z.string().optional(),
    coverImage: z.string().optional(),
    order: z.number().default(0),
  }),
});

// 4. Cultos Regulares
const cultos = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(), // ex: "Celebração", "Alinhamento"
    dayOfWeek: z.enum(['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']),
    time: z.string(), // ex: "19:00", "20:00"
    description: z.string(),
    highlight: z.boolean().default(false),
  }),
});

// 5. Configurações Globais e Dados Institucionais
const institucional = defineCollection({
  type: 'data',
  schema: z.object({
    churchName: z.string().default('IEADPG Jardim Amália'),
    address: z.string(),
    whatsapp: z.string(),
    emailInbound: z.string().email(),
    socials: z.object({
      instagram: z.string().url().optional(),
      facebook: z.string().url().optional(),
      youtube: z.string().url().optional(),
    }),
    googleMapsUrl: z.string().url().optional(),
    pixKey: z.string().optional(),
    visionStatement: z.string(),
    themeVerse: z.object({
      verse: z.string(),
      reference: z.string(),
    }),
  }),
});

export const collections = {
  noticias,
  eventos,
  ministerios,
  cultos,
  institucional,
};
