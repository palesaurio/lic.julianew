/**
 * Sistema de almacenamiento para las galerías
 * Este archivo simula una base de datos usando localStorage
 */

export interface GalleryItem {
  id: number
  imageUrl: string
  title: string
  description: string
  alt?: string
}

// Tipos de galerías disponibles
export type GalleryType = "hero" | "eventos" | "actividades" | "propuestas-accion"

// Datos iniciales para las galerías
const INITIAL_GALLERIES: Record<GalleryType, GalleryItem[]> = {
  hero: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Julia Villagómez en campaña",
      description: "Trabajando por un mejor futuro para nuestra comunidad",
      alt: "Julia Villagómez en campaña",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Reunión con la comunidad",
      description: "Escuchando las necesidades de los ciudadanos",
      alt: "Reunión con la comunidad",
    },
    {
      id: 3,
      imageUrl: "/placeholder.svg?height=600&width=800",
      title: "Propuestas para el futuro",
      description: "Presentando nuestras propuestas para el desarrollo",
      alt: "Propuestas para el futuro",
    },
  ],
  eventos: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Visita a la comunidad",
      description: "Reunión con líderes comunitarios para discutir necesidades locales.",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Evento comunitario",
      description: "Participación en evento comunitario local.",
    },
  ],
  actividades: [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Foro político",
      description: "Participación en foro sobre políticas públicas.",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Reunión de trabajo",
      description: "Reunión con equipo de trabajo para planificar estrategias.",
    },
  ],
  "propuestas-accion": [
    {
      id: 1,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Proyecto de salud",
      description: "Inauguración de nueva clínica comunitaria para mejorar servicios de salud.",
    },
    {
      id: 2,
      imageUrl: "/placeholder.svg?height=400&width=600",
      title: "Programa educativo",
      description: "Lanzamiento de programa educativo para jóvenes.",
    },
  ],
}

// Función para obtener los elementos de una galería
export function getGalleryItems(galleryType: GalleryType): GalleryItem[] {
  if (typeof window === "undefined") {
    return INITIAL_GALLERIES[galleryType]
  }

  try {
    const storedItems = localStorage.getItem(`gallery-${galleryType}`)
    if (storedItems) {
      return JSON.parse(storedItems)
    }
  } catch (error) {
    console.error(`Error loading gallery ${galleryType} from localStorage:`, error)
  }

  return INITIAL_GALLERIES[galleryType]
}

// Función para guardar los elementos de una galería
export function saveGalleryItems(galleryType: GalleryType, items: GalleryItem[]): void {
  if (typeof window === "undefined") {
    return
  }

  try {
    localStorage.setItem(`gallery-${galleryType}`, JSON.stringify(items))
    // Disparar un evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent("gallery-updated", { detail: { type: galleryType, items } }))
  } catch (error) {
    console.error(`Error saving gallery ${galleryType} to localStorage:`, error)
  }
}

// Función para escuchar cambios en las galerías
export function listenToGalleryChanges(callback: (galleryType: GalleryType, items: GalleryItem[]) => void): () => void {
  if (typeof window === "undefined") {
    return () => {}
  }

  const handleGalleryUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<{ type: GalleryType; items: GalleryItem[] }>
    callback(customEvent.detail.type, customEvent.detail.items)
  }

  window.addEventListener("gallery-updated", handleGalleryUpdate)

  // Devolver función para eliminar el listener
  return () => {
    window.removeEventListener("gallery-updated", handleGalleryUpdate)
  }
}

// Inicializar el almacenamiento si es necesario
export function initializeGalleryStore(): void {
  if (typeof window === "undefined") {
    return
  }

  // Comprobar si ya hay datos guardados
  Object.keys(INITIAL_GALLERIES).forEach((galleryType) => {
    const key = `gallery-${galleryType}`
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(INITIAL_GALLERIES[galleryType as GalleryType]))
    }
  })
}
