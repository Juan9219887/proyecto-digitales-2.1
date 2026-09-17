import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const actual = await redis.get('ultimosDatos');
    const historialRaw = await redis.lrange('historial', 0, 14);

    const historial = (historialRaw || []).map(item => 
      typeof item === 'string' ? JSON.parse(item) : item
    );

    return res.status(200).json({
      actual: actual ? (typeof actual === 'string' ? JSON.parse(actual) : actual) : null,
      historial: historial
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}