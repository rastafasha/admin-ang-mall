// src/app/interfaces/mercadolibre.interfaces.ts

/**
 * ⚙️ Representa la configuración técnica de la app de Mercado Libre de cada tienda.
 * Mapea directamente el resultado del GET y POST de tu endpoint `/ml/config`.
 */
export interface MercadoLibreConfig {
  _id?: string;
  tienda: string;
  client_id: string;
  client_secret?: string; // Opcional, ya que el backend lo oculta en las consultas por seguridad
  redirect_uri: string;
  mel_user_id?: string | null;
  nickname?: string | null;
  status: 'CONFIGURADO' | 'CONECTADO' | 'DESCONECTADO';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * 📦 Extensión para el modelo de Producto nativo de tu SaaS.
 * Mapea la subestructura 'mercadolibre' dentro del documento del producto.
 */
export interface MeliProductoSyncStatus {
  id: string | null;          // ID del ítem en Mercado Libre (ej: "MLV123456789")
  status: string;              // Estado en la plataforma externa (ej: "active", "paused")
  last_sync: string | Date | null; // Fecha de la última actualización de stock/precio
}

/**
 * 📥 Estructura de las respuestas HTTP genéricas de tu API Node.js
 * Sigue el estándar de tus controladores con { ok: boolean }
 */
export interface MeliConfigResponse {
  ok: boolean;
  msg?: string;
  config: MercadoLibreConfig | null;
}

export interface MeliUrlResponse {
  ok: boolean;
  url: string; // URL regional generada para el inicio de sesión OAuth
}

export interface MeliSyncResponse {
  success: boolean;
  mensaje: string;
  ml_id: string;
}
