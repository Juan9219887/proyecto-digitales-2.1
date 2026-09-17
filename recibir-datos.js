import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const datos = req.body;
    datos.hora = new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' });

    // Guardar actual e historial
    await redis.set('ultimosDatos', JSON.stringify(datos));
    await redis.lpush('historial', JSON.stringify(datos));
    await redis.ltrim('historial', 0, 14);

    return res.status(200).json({ status: 'ok' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}